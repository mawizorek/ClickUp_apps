/* names.js — export-name transforms. NO NETWORK, NO DOM, NO IMPORTS.

   Pure functions over an already-fetched listing, for one reason that decides the whole design:
   THE UNAUTHENTICATED API BUDGET IS 60 CALLS AN HOUR. A checkbox that re-lists the tree would
   spend it on nothing. So a toggle recomputes names in memory, synchronously, and never touches
   the network.

   WHAT MOVES AND WHAT DOES NOT:
     f.rel  — the ORIGINAL name. Never written to. Every plan is computed from it, which is what
              makes toggling idempotent instead of cumulative (`.md` -> `.txt` -> `.tx` -> ...).
     f.out  — the ZIP ENTRY NAME. The only thing these transforms change.
     f.path — the true path in the repo. Untouched, so rawURL() still fetches the right blob.

   TWO TRANSFORMS, BOTH MARKDOWN-ONLY (Michael, 2026-08-04):
     1. `.md` / `.markdown` -> `.txt`. Markdown has no guaranteed handler on a machine without a
        markdown editor, so a double-click is a coin flip. `.txt` opens the same way everywhere.
        Nothing is protected by this: the source is public, the formatting is already stripped,
        and renaming back to `.md` restores the rendering in two seconds.
     2. `index.md` -> `<parent-folder>_index.md`. Ten files called `index` in one Downloads folder
        are ten files you cannot tell apart.

   🔴 MARKDOWN-ONLY IS A SAFETY RULE, NOT A SCOPE PREFERENCE. `index.html` is the directory
   default — rename it and an extracted site folder stops loading. `index.js` is worse: module
   resolution finds `foo/index.js` for `require("./foo")`, so the rename silently breaks the
   import graph of whatever you grabbed to read. Same shape as `__init__.py`. The rename is a
   DOCUMENTS convenience and it is DESTRUCTIVE ON CODE. Both regexes below are anchored to
   markdown extensions and must stay that way.

   🔴 A COLLISION SKIPS THE RENAME. IT NEVER DROPS A FILE. (Michael, 2026-08-04: "it's not like
   we're refusing all markdowns!") If `notes.md` would become `notes.txt` and `notes.txt` is
   already in the folder, that ONE file keeps its name, gets flagged on screen, and both files
   ship in the zip. This is why the whole feature cannot breach the correctness bar: a rename
   changes what an entry is CALLED and never whether it EXISTS, so the count assertion in
   `gh.js` and `app.js` is untouched by anything in this file.
*/
(function () {
  "use strict";

  var MD_RE    = /\.(md|markdown)$/i;
  var INDEX_RE = /(^|\/)index\.(md|markdown)$/i;

  function isMarkdown(rel) { return MD_RE.test(rel); }
  function isIndexDoc(rel) { return INDEX_RE.test(rel); }

  /* The grabbed folder's own leaf name, for a markdown index sitting at the root of it where
     there is no parent segment to borrow. Same expression `suggestName()` uses — deliberately
     the same shape, because two implementations of one name is how they drift apart. */
  function folderLeaf(listing) {
    var fromPath = listing.path ? listing.path.split("/").filter(Boolean).pop() : "";
    return fromPath || listing.repo || "folder";
  }

  /* NOT SANITISED, ON PURPOSE. The parent name is lifted from an existing path segment, so it is
     already a legal one. Running it through a [^\w] scrub would turn `café` into `caf-` — the
     selftest below catches exactly that, and it is the reason this function is three lines
     instead of a clever one. zip.js already sets the UTF-8 flag, so non-ASCII names survive. */
  function parentName(rel, listing) {
    var seg = rel.split("/");
    return (seg.length > 1 && seg[seg.length - 2]) || folderLeaf(listing);
  }

  /* ORDER IS FIXED: index rename FIRST, extension rewrite SECOND.
     Run the extension rewrite first and the index rule would have to recognise `index.txt`,
     which is a different file that might legitimately be sitting in the folder already.
     Correct: docs/index.md -> docs/docs_index.md -> docs/docs_index.txt */
  function wanted(rel, listing, doIdx, doMd) {
    var out = rel;
    if (!isMarkdown(out)) return out;

    if (doIdx && isIndexDoc(out)) {
      var seg = out.split("/");
      var name = seg.pop();
      var ext = name.slice(name.indexOf("."));   /* .md or .markdown, case preserved */
      seg.push(parentName(rel, listing) + "_index" + ext);
      out = seg.join("/");
    }
    if (doMd) out = out.replace(MD_RE, ".txt");
    return out;
  }

  /* ---------------- plan ----------------
     opts: { md: bool, idx: bool, rows: { <rel>: bool } }

     `rows` is the per-file override and it beats both masters for that one file:
       false -> leave this file alone whatever the toggles say
       true  -> convert this file even with the toggles off (a bare tick means "make this one a
                .txt", so it implies the extension rewrite when no master is on)

     Annotates each file with md / on / out / renamed / blocked and returns a summary.
     Mutates in place and is fully idempotent: every value is derived from f.rel, so calling this
     a hundred times with the same opts yields the same answer, and toggling off restores exactly.
  */
  function plan(listing, opts) {
    opts = opts || {};
    var rows = opts.rows || {};
    var files = (listing && listing.files) || [];
    var desired = new Array(files.length);
    var markdown = 0, i, f;

    for (i = 0; i < files.length; i++) {
      f = files[i];
      f.md = isMarkdown(f.rel);
      if (f.md) markdown++;

      var override = rows[f.rel];
      var forced = (override === true);
      var on = (override === undefined) ? !!(opts.md || opts.idx) : !!override;

      var doMd = !!opts.md, doIdx = !!opts.idx;
      if (forced && !doMd && !doIdx) doMd = true;

      f.on = f.md && on;
      desired[i] = f.on ? wanted(f.rel, listing, doIdx, doMd) : f.rel;
    }

    /* ---- collision pass ----
       Two rounds, because a file that is NOT moving has the stronger claim on its own name.
       Round 1 reserves every stayer. Round 2 lets movers claim, in listing order, and any mover
       whose target is already spoken for simply keeps the name it came with.

       A blocked mover can always fall back safely: original names are unique across the listing
       (gh.js already dropped case-folded duplicates before we got here), so nothing can be
       holding it. */
    var taken = Object.create(null), byRel = Object.create(null);
    var blocked = [], renamed = 0;

    for (i = 0; i < files.length; i++) {
      if (desired[i] === files[i].rel) taken[files[i].rel.toLowerCase()] = files[i].rel;
    }

    for (i = 0; i < files.length; i++) {
      f = files[i];
      byRel[f.rel] = f;

      if (desired[i] === f.rel) { f.out = f.rel; f.renamed = false; f.blocked = null; continue; }

      var key = desired[i].toLowerCase();
      if (taken[key]) {
        f.out = f.rel; f.renamed = false;
        f.blocked = { want: desired[i], holder: taken[key] };
        taken[f.rel.toLowerCase()] = f.rel;
        blocked.push(f);
      } else {
        taken[key] = desired[i];
        f.out = desired[i]; f.renamed = true; f.blocked = null;
        renamed++;
      }
    }

    return {
      markdown: markdown, renamed: renamed, blocked: blocked, byRel: byRel,
      md: !!opts.md, idx: !!opts.idx,
      active: renamed > 0 || blocked.length > 0
    };
  }

  /* A marker on the download filename so two exports of one folder do not collide in ~/Downloads. */
  function suffix(p) {
    if (!p || !p.renamed) return "";
    return (p.md ? "-txt" : "") + (p.idx ? "-idx" : "");
  }

  /* ---------------- selftest ----------------
     Synchronous and pure, so it runs alongside ZIP.selftest() on the Self test page. It asserts
     the six acceptance criteria from next-build-spec.md against fabricated listings — the point
     is that each one CAN fail. The unicode check earned its place immediately: it caught a
     [^\w] scrub in parentName() that turned `café` into `caf-`. */
  function selftest() {
    var results = [], ok = true;

    function check(label, pass, detail) {
      results.push((pass ? "PASS  " : "FAIL  ") + label + (detail ? "  \u2014 " + detail : ""));
      if (!pass) ok = false;
    }
    function L(rels) {
      return { owner: "o", repo: "demo", path: "docs", files: rels.map(function (r) {
        return { rel: r, path: "docs/" + r, size: 1 };
      }) };
    }
    function outs(l) { return l.files.map(function (f) { return f.out; }).join(" | "); }
    function unique(l) {
      var seen = Object.create(null), dup = null;
      l.files.forEach(function (f) {
        var k = f.out.toLowerCase();
        if (seen[k]) dup = f.out;
        seen[k] = 1;
      });
      return dup;
    }

    /* 1 — the index rename borrows the parent folder */
    var a = L(["guide/index.md", "index.md", "guide/intro.md"]);
    plan(a, { md: false, idx: true });
    check("index.md takes its parent folder's name", a.files[0].out === "guide/guide_index.md", a.files[0].out);
    check("a root index.md falls back to the grabbed folder", a.files[1].out === "docs_index.md", a.files[1].out);
    check("a non-index markdown is untouched by the index rule", a.files[2].out === "guide/intro.md", a.files[2].out);

    /* 2 — order, and the code files that must never move */
    var b = L(["index.md", "notes.md", "app/index.html", "app/index.js", "pkg/__init__.py"]);
    plan(b, { md: true, idx: true });
    check("the index rename runs before the extension rewrite", b.files[0].out === "docs_index.txt", b.files[0].out);
    check("markdown becomes .txt", b.files[1].out === "notes.txt", b.files[1].out);
    check("index.html is never renamed", b.files[2].out === "app/index.html", b.files[2].out);
    check("index.js is never renamed", b.files[3].out === "app/index.js", b.files[3].out);
    check("__init__.py is never renamed", b.files[4].out === "pkg/__init__.py", b.files[4].out);

    /* 3 — the collision skips ONE rename and keeps BOTH files */
    var c = L(["notes.md", "notes.txt", "other.md"]);
    plan(c, { md: true, idx: false });
    check("a colliding rename is skipped, not thrown", c.files[0].out === "notes.md" && !!c.files[0].blocked, outs(c));
    check("the file it collided with is named in the flag", !!c.files[0].blocked && c.files[0].blocked.holder === "notes.txt");
    check("the other markdown still converts", c.files[2].out === "other.txt", c.files[2].out);
    check("nothing was dropped", c.files.length === 3);
    check("no duplicate entry names anywhere", !unique(c), unique(c) || "clean");

    /* 4 — two movers wanting one name: first claims, second keeps its own */
    var d = L(["docs_index.md", "index.md"]);
    plan(d, { md: false, idx: true });
    check("two files cannot claim one name", !unique(d), unique(d) || "clean");

    /* 5 — idempotence. THE ONE THAT PROVES PLANS ARE BUILT FROM f.rel AND NOT FROM f.out. */
    var e = L(["a/index.md", "b/index.md", "readme.md"]);
    plan(e, { md: true, idx: true });
    var onNames = outs(e);
    check("sibling index files in different folders do not collide", !unique(e), unique(e) || "clean");
    plan(e, { md: false, idx: false });
    var offNames = outs(e);
    plan(e, { md: true, idx: true });
    check("toggling off restores the original names", offNames === "a/index.md | b/index.md | readme.md", offNames);
    check("toggling back on is identical, not cumulative", outs(e) === onNames, onNames);

    /* 6 — per-file overrides beat the masters */
    var g = L(["one.md", "two.md"]);
    plan(g, { md: true, idx: false, rows: { "two.md": false } });
    check("a row opted OUT keeps its name while the rest convert", g.files[0].out === "one.txt" && g.files[1].out === "two.md", outs(g));
    plan(g, { md: false, idx: false, rows: { "two.md": true } });
    check("a row opted IN converts with both masters off", g.files[0].out === "one.md" && g.files[1].out === "two.txt", outs(g));

    /* 7 — non-ASCII survives (this one has already caught a real bug) */
    var h = { owner: "o", repo: "demo", path: "docs", files: [{ rel: "caf\u00e9/index.md", path: "x", size: 1 }] };
    plan(h, { md: true, idx: true });
    check("a non-ASCII folder name survives the rename", h.files[0].out === "caf\u00e9/caf\u00e9_index.txt", h.files[0].out);

    return { ok: ok, results: results };
  }

  window.NAMES = {
    plan: plan,
    suffix: suffix,
    selftest: selftest,
    isMarkdown: isMarkdown,
    isIndexDoc: isIndexDoc
  };
})();
