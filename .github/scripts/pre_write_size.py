#!/usr/bin/env python3
"""Pre-write size gate. Measures a CANDIDATE file BEFORE it is sent to GitHub.

WHY THIS EXISTS, and it is not a duplicate of the CI gate:
  .github/workflows/size-budget.yml is the BACKSTOP. It runs on pull_request, which
  means it runs AFTER a write already happened. On 2026-09-21 five governance writes
  tripped its thresholds (2 FAIL, 3 WARN) and all five merged, because the PRs were
  opened and squash-merged inside ~2 minutes and nothing waits for the check.
  The gate was never disabled. It was never WAITED FOR.

  This script moves the same arithmetic to BEFORE the write, where it is free and
  deterministic. The root cause it kills: a commit message describing the DIRECTION of
  a size change before the number exists. "Net SHRINK" was written on a pass that grew
  a file 23,734 -> 29,119 B.

THRESHOLDS ARE NOT IN THIS FILE. They are read from brain-config/size-budget.tsv, the
one place they live. If the TSV cannot be read this script EXITS 3 rather than falling
back to defaults -- a size gate guessing its own thresholds is worse than no gate
(hooks/silent-fallback-law.md).

Usage:
  pre_write_size.py --path <repo/path> --candidate <local file> [--current-bytes N]
  pre_write_size.py --selftest       # replays the 2026-09-21 writes

Exit codes: 0 pass/warn/waived, 1 FAIL (over read ceiling), 2 FAIL HARD (over write
cap), 3 thresholds unreadable.
"""
import argparse
import fnmatch
import os
import sys

DEFAULT_TSV = "brain-config/size-budget.tsv"


def load_budget(tsv_path):
    """Parse size-budget.tsv. Returns None if unreadable (caller must refuse)."""
    if not os.path.exists(tsv_path):
        return None
    limits, scope, waivers, watch = {}, [], {}, set()
    with open(tsv_path, encoding="utf-8") as fh:
        for raw in fh:
            line = raw.rstrip("\n")
            if not line.strip() or line.lstrip().startswith("#"):
                continue
            f = line.split("\t")
            kind = f[0].strip()
            if kind == "limit" and len(f) >= 3:
                limits[f[1].strip()] = int(float(f[2].strip()) * 1024)
            elif kind == "scope" and len(f) >= 3:
                scope.append((f[1].strip(), f[2].strip()))
            elif kind == "waiver" and len(f) >= 2:
                waivers[f[1].strip()] = f[3].strip() if len(f) > 3 else ""
            elif kind == "watch" and len(f) >= 2:
                watch.add(f[1].strip())
    if not limits:
        return None
    return {"limits": limits, "scope": scope, "waivers": waivers, "watch": watch}


def in_scope(path, budget):
    """Last matching scope row wins, so a later exclude can narrow an earlier include."""
    if path in budget["watch"]:
        return True, "watch row"
    decision, why = False, "no scope rule matched"
    for pattern, mode in budget["scope"]:
        if fnmatch.fnmatch(path, pattern):
            decision = mode == "include"
            why = "{} via {}".format(mode, pattern)
    return decision, why


def report(path, new, budget, current=None):
    limits = budget["limits"]
    ceiling = limits.get("read_ceiling", 22 * 1024)
    cap = limits.get("write_cap", 30 * 1024)
    split = limits.get("split_line", 15 * 1024)
    target = limits.get("target", 12 * 1024)

    out, code = [], 0
    scoped, why = in_scope(path, budget)
    out.append("path      : {}".format(path))
    out.append("scope     : {} ({})".format("BUDGETED" if scoped else "not budgeted", why))

    if current is not None:
        delta = new - current
        word = "GREW" if delta > 0 else ("SHRANK" if delta < 0 else "UNCHANGED")
        out.append("size      : {:,} B -> {:,} B  =  {} by {:,} B".format(current, new, word, abs(delta)))
    else:
        out.append("size      : {:,} B (new file)".format(new))

    if not scoped:
        out.append("verdict   : PASS (out of scope)")
        return "\n".join(out), 0

    if new > cap:
        out.append("verdict   : FAIL HARD - {:,} B over the write cap. The write will clip or corrupt.".format(new - cap))
        code = 2
    elif new > ceiling:
        waived = path in budget["waivers"]
        out.append("verdict   : FAIL{} - {:,} B over the read ceiling. Unreadable whole = unwriteable.".format(
            "  [WAIVED -> WARN]" if waived else "", new - ceiling))
        code = 0 if waived else 1
    elif new > split:
        out.append("verdict   : WARN - past the split line. Split by concern in THIS pass, silently.")
    elif new > target:
        out.append("verdict   : note - over target, under the split line.")
    else:
        out.append("verdict   : PASS - under target.")

    if code and current is not None and new > current:
        out.append("            ^ this write makes a FAILING file WORSE. Cut before you send it.")
    return "\n".join(out), code


def selftest():
    """Replays the five governance writes of 2026-09-21 against the live thresholds.

    Kept as a test because it is the evidence, not a toy: every one of these was sent
    and merged, and this is what a pre-write gate would have said.
    """
    budget = load_budget(DEFAULT_TSV)
    if budget is None:
        print("selftest needs {} - run from the repo root".format(DEFAULT_TSV), file=sys.stderr)
        return 3
    cases = [
        ("brain-config/super-agents/_shared/super-agent-base.md", 29119, 23734, "pass 1 - commit claimed 'net SHRINK'"),
        ("brain-config/super-agents/_shared/super-agent-base.md", 22564, 23734, "pass 2 - real cuts"),
        ("brain-config/super-agents/_shared/house-layer-base.md", 22116, 16716, "self-correction"),
        ("brain-config/super-agents/_shared/designer-base.md", 16960, None, "parallel session, new file"),
        ("brain-config/super-agents/_shared/department-head-base.md", 15897, 12317, "log de-rot"),
    ]
    worst = 0
    for path, new, cur, label in cases:
        text, code = report(path, new, budget, cur)
        print("--- {}".format(label))
        print(text)
        print()
        worst = max(worst, code)
    return worst


def main():
    ap = argparse.ArgumentParser(description="Measure a candidate file before writing it.")
    ap.add_argument("--path", help="the path it will occupy IN THE REPO (scope matches on this)")
    ap.add_argument("--candidate", help="local file holding the exact bytes to be written")
    ap.add_argument("--current-bytes", type=int, default=None,
                    help="live size of the file being replaced, from a FRESH directory listing")
    ap.add_argument("--tsv", default=DEFAULT_TSV)
    ap.add_argument("--selftest", action="store_true")
    args = ap.parse_args()

    if args.selftest:
        return selftest()
    if not args.path or not args.candidate:
        ap.error("--path and --candidate are both required")

    budget = load_budget(args.tsv)
    if budget is None:
        print("cannot read thresholds at {} - refusing to guess".format(args.tsv), file=sys.stderr)
        return 3

    text, code = report(args.path, os.path.getsize(args.candidate), budget, args.current_bytes)
    print(text)
    return code


if __name__ == "__main__":
    sys.exit(main())
