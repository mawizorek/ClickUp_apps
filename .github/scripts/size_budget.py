#!/usr/bin/env python3
"""Size budget gate for mawizorek/ClickUp_apps.

MATHS ONLY. Every threshold, scope rule and waiver comes from
`brain-config/size-budget.tsv`. 🚫 Do not add a number to this file.

WHAT IT DEFENDS. A file an agent cannot read back WHOLE cannot be safely
edited, because a safe write requires the complete body. So it gets edited
from a partial read and something quietly breaks -- or it becomes unwriteable
entirely, which is what happened to roster.json on 2026-07-25 when it blocked
the agent-registration flow it existed to serve.

=====================================================================
IT ONLY FAILS ON FILES THE PULL REQUEST ACTUALLY TOUCHED. THIS IS THE
CENTRAL DESIGN DECISION AND IT IS NOT LENIENCY.
=====================================================================
Six files in brain-config are over the ceiling today (worst: 60,133 B). A gate
that failed every PR on day one because of debt nobody in that PR created
would be switched off inside a week, and then we would have the same rule with
the same teeth as before: none. Blame belongs to the diff that causes it.

Pre-existing debt is not hidden to buy that. It is printed as a warning
inventory on EVERY run, so it stays visible and countable, and any PR that
touches one of those files inherits the failure. Debt shrinks; it never sits
quietly.

⚠️ THE RULE THIS ENFORCES ALREADY EXISTED AND WAS ALREADY BEING OUTRUN.
`hooks/source-size-budget-enforcer.md` has been at v6, with measured numbers,
since 2026-07-27. It is a behavioural hook: an agent reads it and complies, or
does not. `open-memory-requests.md` reached 60,133 B under it. That is the same
shape as the spine (PR #567) and the session-board clear (PR #808): a rule that
lives in prose and appears in no executable step is reached by memory or not at
all. This file is the executable step.

🚫 IT DOES NOT BUDGET DATA, AND IT DOES NOT BUDGET APP RUNTIME FILES.
A data file is not source -- nothing hand-edits it from a partial read.
And apps already have an older, locked mechanism for being over cap: a
<app>/source/ chunk set plus _index.md. Two mechanisms aiming at one file
contradict each other within a month. Reasoning lives in the TSV's scope rows.

⚠️ AN UNGATED RUN SAYS SO OUT LOUD (added after the first test pass).
A `workflow_dispatch` run has no base commit, so the diff is empty and NOTHING
is checked. The first version printed "No file this PR touched is over budget"
in that case, which is a fallback wearing a pass's clothes -- exactly what
`hooks/silent-fallback-law.md` exists to stop. It now names itself an
INVENTORY-ONLY RUN. Found by testing the gate against fixtures before merging
it, which is the only reason it is not a live defect.
"""

from __future__ import annotations

import os
import re
import subprocess
import sys
from pathlib import Path

TSV = Path("brain-config/size-budget.tsv")
KB = 1024.0


def _rows(kind: str) -> list[list[str]]:
    """Parse the TSV. A '#' line is a comment; the rest is tab-separated."""
    out = []
    if not TSV.is_file():
        return out
    for line in TSV.read_text(encoding="utf-8").splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        cells = [c.strip() for c in line.split("\t")]
        if cells and cells[0] == kind:
            out.append(cells[1:])
    return out


def _limits() -> dict[str, float]:
    got = {}
    for cells in _rows("limit"):
        if len(cells) >= 2:
            try:
                got[cells[0]] = float(cells[1])
            except ValueError:
                pass
    missing = {"target", "split_line", "read_ceiling", "write_cap"} - set(got)
    if missing:
        # A missing threshold must never silently become "no limit". Refuse.
        print(
            "::error::size-budget: " + TSV.as_posix() + " is missing limit "
            "rows: " + ", ".join(sorted(missing)),
            file=sys.stderr,
        )
        raise SystemExit(2)
    return got


def _to_regex(pattern: str) -> re.Pattern[str]:
    """Glob -> regex, with '**' crossing separators and '*' not.

    fnmatch is wrong for this: its '*' crosses '/' too, so
    'brain-config/**/*.md' would silently miss 'brain-config/README.md'
    while looking like it covered it. An unenforced rule that looks enforced
    is the exact failure this whole gate exists to stop, so the matcher is
    written out rather than borrowed. Verified against that case and six
    others before merge.
    """
    out = []
    i = 0
    while i < len(pattern):
        if pattern.startswith("**/", i):
            out.append("(?:.*/)?")
            i += 3
        elif pattern.startswith("**", i):
            out.append(".*")
            i += 2
        elif pattern[i] == "*":
            out.append("[^/]*")
            i += 1
        elif pattern[i] == "?":
            out.append("[^/]")
            i += 1
        else:
            out.append(re.escape(pattern[i]))
            i += 1
    return re.compile("^" + "".join(out) + "$")


def _scope():
    inc, exc = [], []
    for cells in _rows("scope"):
        if len(cells) >= 2:
            (inc if cells[1] == "include" else exc).append(_to_regex(cells[0]))
    return inc, exc


def _budgeted(path: str, inc, exc, watch: set[str]) -> bool:
    if path in watch:
        return True
    if any(r.match(path) for r in exc):
        return False
    return any(r.match(path) for r in inc)


def _changed() -> list[str]:
    base = os.environ.get("BASE_SHA", "").strip()
    if not base:
        return []
    try:
        raw = subprocess.run(
            ["git", "diff", "--name-only", "--diff-filter=ACMR", base, "HEAD"],
            capture_output=True, text=True, check=True,
        ).stdout
    except subprocess.CalledProcessError as exc:
        print("::error::size-budget: git diff failed: " + str(exc), file=sys.stderr)
        raise SystemExit(2)
    return [p for p in raw.splitlines() if p.strip()]


def _kb(path: str) -> float | None:
    try:
        return Path(path).stat().st_size / KB
    except OSError:
        return None


def main() -> int:
    lim = _limits()
    inc, exc = _scope()
    watch = {c[0] for c in _rows("watch") if c}
    waived = {c[0]: (c[1] if len(c) > 1 else "", c[2] if len(c) > 2 else "")
              for c in _rows("waiver") if c}

    failures, warnings, summary = [], [], []
    gated = bool(os.environ.get("BASE_SHA", "").strip())

    # ---- 1. THE GATE: only files this PR touched. -------------------------
    for path in _changed():
        if not _budgeted(path, inc, exc, watch):
            continue
        kb = _kb(path)
        if kb is None:
            continue
        shown = format(kb, ".1f") + "KB"

        if kb > lim["write_cap"]:
            failures.append(
                path + " is " + shown + ", past the "
                + format(lim["write_cap"], ".0f") + "KB WRITE CAP. The write tool "
                "clips or corrupts here. Split it, or route it through the "
                "GitHub UI / a chunk set."
            )
        elif kb > lim["read_ceiling"]:
            msg = (
                path + " is " + shown + ", over the "
                + format(lim["read_ceiling"], ".0f") + "KB read ceiling. It cannot "
                "be read back whole, so it cannot be safely edited. Split by "
                "concern, or move why-history to a .notes.md sidecar."
            )
            if path in waived:
                expires, note = waived[path]
                warnings.append(msg + " [WAIVED to " + (expires or "?") + ": "
                                + (note or "no note given") + "]")
            else:
                failures.append(msg)
        elif kb > lim["split_line"]:
            warnings.append(
                path + " is " + shown + ", past the "
                + format(lim["split_line"], ".0f") + "KB split line. Split it in "
                "this pass if a clean concern boundary exists."
            )

    # ---- 2. THE INVENTORY: repo-wide, warn only, so debt stays visible. ---
    over = []
    for path in sorted(Path(".").rglob("*")):
        if not path.is_file() or ".git" in path.parts:
            continue
        rel = path.as_posix()
        if not _budgeted(rel, inc, exc, watch):
            continue
        kb = _kb(rel)
        if kb is not None and kb > lim["read_ceiling"]:
            over.append((kb, rel))
    over.sort(reverse=True)

    # ---- 3. REPORT. One block, at the end. -------------------------------
    for msg in failures:
        print("::error::" + msg, file=sys.stderr)
    for msg in warnings:
        print("::warning::" + msg)

    summary.append("## Size budget")
    summary.append("")
    summary.append("Thresholds: target " + format(lim["target"], ".0f")
                   + "KB · split " + format(lim["split_line"], ".0f")
                   + "KB · read ceiling " + format(lim["read_ceiling"], ".0f")
                   + "KB · write cap " + format(lim["write_cap"], ".0f") + "KB")
    summary.append("")
    if failures:
        summary.append("### Failures (" + str(len(failures)) + ")")
        summary += ["- " + m for m in failures]
        summary.append("")
    if warnings:
        summary.append("### Warnings (" + str(len(warnings)) + ")")
        summary += ["- " + m for m in warnings]
        summary.append("")
    if not gated:
        # A fallback that reads as a pass is the failure mode
        # hooks/silent-fallback-law.md exists to stop. Name it.
        summary.append(
            "⚠️ **INVENTORY-ONLY RUN.** No base commit was given (BASE_SHA "
            "empty), so NOTHING WAS GATED. The standing-debt list below is "
            "still true."
        )
        summary.append("")
    elif not failures and not warnings:
        summary.append("No file this PR touched is over budget.")
        summary.append("")

    summary.append("### Standing debt: " + str(len(over))
                   + " budgeted file(s) already over the ceiling")
    summary.append("")
    summary.append("Not this PR's fault and not blocking it. Listed so it stays "
                   "visible. Touching one of these inherits the failure.")
    summary.append("")
    for kb, rel in over[:25]:
        summary.append("- `" + rel + "` — " + format(kb, ".1f") + "KB")
    if len(over) > 25:
        summary.append("- …and " + str(len(over) - 25) + " more")

    text = "\n".join(summary) + "\n"
    print(text)
    out = os.environ.get("GITHUB_STEP_SUMMARY")
    if out:
        with open(out, "a", encoding="utf-8") as handle:
            handle.write(text)

    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
