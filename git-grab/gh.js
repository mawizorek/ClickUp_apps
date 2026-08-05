/* gh.js — GitHub URL parsing, ref resolution, recursive listing, and body fetching.

   NO DOM. Pure async functions over fetch. Kept DOM-free on purpose: if Prism ever grows an
   "open from a GitHub URL" source adapter it needs exactly this layer, and that extraction
   should be a file move rather than surgery.

   THE TRUST CLAIM, MADE PROVABLE:
   Every network call goes through gate() below, which refuses any hostname that is not
   api.github.com or raw.githubusercontent.com. You verify that by reading five lines instead of
   trusting a sentence in a README. That is the entire reason this app exists.

   THE FOUR SILENT-CORRUPTION DEFENCES. A wrong zip that reports success is the only failure
   that actually costs anything here, so each of these EXCLUDES AND NAMES rather than skipping:
     1. truncated:true on the trees response -> refuse the whole job
     2. gitlinks, mode 160000 (submodules)   -> no blob exists in this repo to fetch
     3. symlinks, mode 120000                -> the blob is the link TARGET as text, so fetching
                                                it produces a file impersonating the real one
     4. case-folded duplicate paths          -> silently overwrite on macOS/Windows extract

   RATE LIMITS, unauthenticated: 60/hr on api.github.com. A job spends 1-3 calls (resolve the
   ref, list the tree). Bodies come from raw.githubusercontent.com, which does NOT count against
   that budget. So roughly 20-30 downloads an hour, which is not a real constraint.

   ⚠️ THREE NAMES PER FILE (v1.3): `path` is the repo path and is the ONLY thing fetched by;
   `rel` is the original relative name and is never written to; `out` is the zip entry name,
   set by names.js. Fetch by path, pack by out. Full rules: README ▸ Three names per file.
*/
(function () {
  "use strict";

  var API = "https://api.github.com";
  var RAW = "https://raw.githubusercontent.com";
  var ALLOWED = { "api.github.com": 1, "raw.githubusercontent.com": 1 };

  /* ---------------- the allowlist gate ----------------
     One choke point. If a future edit introduces a call to anywhere else, it throws instead of
     quietly exfiltrating. Cheap, unglamorous, and the whole security story. */
  function gate(url) {
    var host;
    try { host = new URL(url).hostname; } catch (e) { throw new Error("blocked: unparseable URL"); }
    if (!ALLOWED[host]) throw new Error('blocked: "' + host + '" is not GitHub. Only api.github.com and raw.githubusercontent.com are allowed.');
    return url;
  }

  function ghFetch(url, token, accept) {
    gate(url);
    var headers = { "Accept": accept || "application/vnd.github+json" };
    /* token is threaded through but never supplied in v1 — the seam Michael ruled for in Q2.
       One parameter today; saves a refactor when the private-repo gate lands. */
    if (token) headers.Authorization = "Bearer " + token;
    return fetch(url, { headers: headers, cache: "no-store" });
  }

  /* ---------------- error shaping ----------------
     Distinct sentences per failure, per Polly. "Something went wrong" is a bug, not a state.
     The 404 case is deliberately hedged: GitHub returns 404, NOT 403, for a private repo you are
     not authenticated for — it refuses to confirm the repo even exists. So the app cannot
     truthfully say "this is private"; claiming it would be a lie on every typo. */
  function describe(res) {
    if (res.status === 404) {
      return "Couldn't reach that path. It may not exist, the branch or folder name may be wrong, or the repo may be private (GitHub gives the same answer for all three, on purpose).";
    }
    if (res.status === 403 || res.status === 429) {
      var remaining = res.headers.get("x-ratelimit-remaining");
      if (remaining === "0") {
        var reset = Number(res.headers.get("x-ratelimit-reset") || 0) * 1000;
        var mins = reset ? Math.max(1, Math.round((reset - Date.now()) / 60000)) : null;
        return "GitHub's rate limit is spent" + (mins ? " and resets in about " + mins + " minute" + (mins === 1 ? "" : "s") + "." : ".") + " Unauthenticated requests get 60 an hour.";
      }
      return "GitHub refused the request (403). Usually a rate limit.";
    }
    if (res.status >= 500) return "GitHub is having trouble (" + res.status + "). Not your URL — try again shortly.";
    return "GitHub returned " + res.status + " " + (res.statusText || "") + ".";
  }

  function ghJSON(url, token) {
    return ghFetch(url, token).then(function (res) {
      if (!res.ok) { var e = new Error(describe(res)); e.status = res.status; throw e; }
      return res.json();
    });
  }

  /* ---------------- URL parsing ----------------
     Accepts a bare repo, a /tree/ link, a /blob/ link, a 40-char commit permalink, and the
     owner/repo/path shorthand.

     THE REF IS NOT SPLIT OUT HERE, and that is the point. A branch name may contain slashes
     (feature/foo, release/2026-08), so "tree/feature/foo/docs" is genuinely ambiguous from the
     string alone: feature could be the ref with foo/docs the path, or feature/foo the ref with
     docs the path. We return the whole tail as refAndPath and let resolveRef() settle it against
     the repo's REAL branch and tag lists. Guessing here is a bug that only appears on repos
     using slashed branch names, which is the worst kind. */
  function parseURL(input) {
    var raw = String(input || "").trim();
    if (!raw) throw new Error("Paste a GitHub folder URL first.");

    var owner, repo, kind = null, refAndPath = "";

    if (/^https?:\/\//i.test(raw)) {
      var u;
      try { u = new URL(raw); } catch (e) { throw new Error("That doesn't look like a URL."); }
      if (!/(^|\.)github\.com$/i.test(u.hostname)) {
        throw new Error('Only github.com links work here. That one points at "' + u.hostname + '".');
      }
      var seg = u.pathname.split("/").filter(Boolean).map(decodeURIComponent);
      if (seg.length < 2) throw new Error("That URL has no owner/repo in it.");
      owner = seg[0];
      repo = seg[1].replace(/\.git$/, "");
      if (seg.length > 2) {
        kind = seg[2];
        if (kind !== "tree" && kind !== "blob") {
          throw new Error('Expected a /tree/ or /blob/ link. Got "/' + kind + '/" — open the folder on GitHub and copy the address bar.');
        }
        refAndPath = seg.slice(3).join("/");
      }
    } else {
      var parts = raw.split("/").filter(Boolean);
      if (parts.length < 2) throw new Error("Use owner/repo, or paste a full github.com URL.");
      owner = parts[0];
      repo = parts[1].replace(/\.git$/, "");
      refAndPath = parts.slice(2).join("/");
    }

    return { owner: owner, repo: repo, kind: kind, refAndPath: refAndPath };
  }

  /* ---------------- ref resolution ----------------
     Turns refAndPath into { ref, path, sha }:
       1. a 40-char hex head is unambiguously a commit SHA, no lookup needed
       2. otherwise match the LONGEST branch or tag name that prefixes the tail
       3. an empty tail means the default branch
     Then pin everything to an immutable commit SHA, so a push mid-download cannot produce a zip
     that is half one commit and half another. */
  function resolveRef(loc, token) {
    var tail = loc.refAndPath || "";

    var shaMatch = tail.match(/^([0-9a-f]{40})(?:\/(.*))?$/i);
    if (shaMatch) {
      return Promise.resolve({ ref: shaMatch[1], path: shaMatch[2] || "", sha: shaMatch[1] });
    }

    if (!tail) {
      return ghJSON(API + "/repos/" + loc.owner + "/" + loc.repo, token).then(function (r) {
        return commitFor(loc, r.default_branch, "", token);
      });
    }

    /* Longest match wins because `feature` and `feature/foo` can both exist as branches; the
       more specific one is the real ref. */
    var per = "?per_page=100";
    return Promise.all([
      ghJSON(API + "/repos/" + loc.owner + "/" + loc.repo + "/branches" + per, token).catch(function () { return []; }),
      ghJSON(API + "/repos/" + loc.owner + "/" + loc.repo + "/tags" + per, token).catch(function () { return []; })
    ]).then(function (both) {
      var names = [].concat(both[0] || [], both[1] || []).map(function (x) { return x.name; });
      var best = null;
      names.forEach(function (n) {
        if (tail === n || tail.indexOf(n + "/") === 0) {
          if (!best || n.length > best.length) best = n;
        }
      });
      /* Fall back to the first segment: a tag past the first 100, or a short SHA, still has a
         chance, and if it is wrong the commit call 404s with a real message. */
      if (!best) best = tail.split("/")[0];
      var path = tail.slice(best.length).replace(/^\//, "");
      return commitFor(loc, best, path, token);
    });
  }

  function commitFor(loc, ref, path, token) {
    return ghJSON(API + "/repos/" + loc.owner + "/" + loc.repo + "/commits/" + encodeURIComponent(ref), token)
      .then(function (c) { return { ref: ref, path: path, sha: c.sha }; });
  }

  /* ---------------- listing ----------------
     ONE recursive trees call for the whole repo, filtered by path prefix client-side. One
     request instead of walking directory by directory.

     truncated:true is why this can fail loudly. GitHub sets it past roughly 100k entries or 7MB
     of response AND SAYS NOTHING ELSE — you get a valid-looking body simply missing files. A
     tool that returns a zip quietly missing four files is worse than one that refuses. */
  function listTree(loc, resolved, token) {
    var url = API + "/repos/" + loc.owner + "/" + loc.repo + "/git/trees/" + resolved.sha + "?recursive=1";
    return ghJSON(url, token).then(function (tree) {
      if (tree.truncated) {
        throw new Error("This repository's file list came back incomplete — GitHub truncates very large trees. Refusing, rather than handing you a zip that is quietly missing files.");
      }

      var prefix = resolved.path ? resolved.path.replace(/\/+$/, "") + "/" : "";
      var single = (loc.kind === "blob") ? resolved.path : null;

      var files = [], skipped = [], seen = Object.create(null);

      (tree.tree || []).forEach(function (e) {
        if (single) { if (e.path !== single) return; }
        else if (prefix && e.path.indexOf(prefix) !== 0) return;

        /* MODE is the discriminator, not type. 160000 is a gitlink (a submodule pointer, no blob
           in this repo) and 120000 is a symlink (the blob holds the link target as text, so
           fetching it yields a one-line file impersonating a real one). Both EXCLUDED AND NAMED. */
        if (e.mode === "160000") { skipped.push({ path: e.path, why: "submodule" }); return; }
        if (e.mode === "120000") { skipped.push({ path: e.path, why: "symlink" }); return; }
        if (e.type !== "blob") return; /* trees are folders; paths imply them inside the zip */

        var rel = single ? e.path.split("/").pop() : e.path.slice(prefix.length);
        var key = rel.toLowerCase();
        if (seen[key]) { skipped.push({ path: e.path, why: 'case-folded duplicate of "' + seen[key] + '"' }); return; }
        seen[key] = rel;

        /* `out` seeded to `rel`: names.js is an override, never a prerequisite. */
        files.push({ path: e.path, rel: rel, out: rel, size: e.size || 0, sha: e.sha });
      });

      if (!files.length) {
        throw new Error(resolved.path
          ? 'Nothing to download: "' + resolved.path + '" holds no files' + (skipped.length ? " (" + skipped.length + " excluded, listed below)" : " — check the path") + "."
          : "That repository appears to be empty.");
      }

      files.sort(function (a, b) { return a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0; });

      return {
        owner: loc.owner, repo: loc.repo,
        ref: resolved.ref, sha: resolved.sha, path: resolved.path,
        files: files, skipped: skipped,
        totalBytes: files.reduce(function (n, f) { return n + f.size; }, 0)
      };
    });
  }

  /* ---------------- the one call the UI needs ---------------- */
  function inspect(input, token) {
    var loc;
    try { loc = parseURL(input); } catch (e) { return Promise.reject(e); }
    return resolveRef(loc, token).then(function (r) { return listTree(loc, r, token); });
  }

  /* ---------------- fetching bodies ----------------
     raw.githubusercontent.com pinned to the COMMIT SHA, never a branch name (which can move
     mid-download and is cache-frozen far more often). Does not count against the API limit.
     Concurrency 8: fast, polite, not enough to look like a scraper. */
  function rawURL(job, file) {
    return RAW + "/" + job.owner + "/" + job.repo + "/" + job.sha + "/" +
           file.path.split("/").map(encodeURIComponent).join("/");
  }

  function grabOne(job, file, token) {
    return ghFetch(rawURL(job, file), token, "*/*").then(function (res) {
      if (!res.ok) throw new Error('Could not download "' + file.rel + '" (' + res.status + ').');
      return res.arrayBuffer();
    });
  }

  function fetchAll(job, onProgress, token) {
    var files = job.files;
    var out = new Array(files.length);
    var next = 0, done = 0;
    var LANES = Math.min(8, files.length);

    function pump() {
      var i = next++;
      if (i >= files.length) return Promise.resolve();
      var f = files[i];

      return grabOne(job, f, token)
        .catch(function () {
          /* Exactly one retry with backoff, then fail with a real name. No infinite retry — that
             turns a rate limit into a hang (Enzo's refusal list). */
          return new Promise(function (r) { setTimeout(r, 700); })
            .then(function () { return grabOne(job, f, token); });
        })
        .then(function (ab) {
          /* ⚠️ The ONE place the renamed entry name enters the pipeline — and note it is the
             only line in this file that reads `out`. Falls back to `rel` so this layer still
             works with names.js absent entirely. */
          out[i] = { name: f.out || f.rel, data: new Uint8Array(ab) };
          done++;
          if (onProgress) onProgress(done, files.length, f.rel);
          return pump();
        });
    }

    var lanes = [];
    for (var i = 0; i < LANES; i++) lanes.push(pump());

    return Promise.all(lanes).then(function () {
      /* THE ASSERTION THE WHOLE APP IS BUILT AROUND. If the blobs we hold do not equal the count
         the listing promised, refuse rather than zip what we happen to have. Renaming cannot
         move this number: names.js changes what a file is called, never whether it exists. */
      var got = out.filter(Boolean);
      if (got.length !== files.length) {
        throw new Error("Only " + got.length + " of " + files.length + " files came back. Refusing to build an incomplete zip.");
      }
      return got;
    });
  }

  /* `plan` is optional; when a rename ran, its marker keeps two exports of one folder apart. */
  function suggestName(job, plan) {
    var leaf = (job.path ? job.path.split("/").filter(Boolean).pop() : job.repo) || job.repo;
    var mark = (window.NAMES && NAMES.suffix) ? NAMES.suffix(plan) : "";
    return (job.repo + "-" + leaf + mark + "-" + job.sha.slice(0, 7) + ".zip").replace(/[^\w.\-]+/g, "-");
  }

  function humanBytes(n) {
    if (n < 1024) return n + " B";
    if (n < 1048576) return (n / 1024).toFixed(1) + " KB";
    if (n < 1073741824) return (n / 1048576).toFixed(1) + " MB";
    return (n / 1073741824).toFixed(2) + " GB";
  }

  window.GH = {
    parseURL: parseURL,
    inspect: inspect,
    fetchAll: fetchAll,
    rawURL: rawURL,
    suggestName: suggestName,
    humanBytes: humanBytes,
    ALLOWED_HOSTS: Object.keys(ALLOWED)
  };
})();
