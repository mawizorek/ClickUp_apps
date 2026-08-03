/* app.js — the job reducer and the render.

   ONE RECORD, ONE RENDER. Every stage takes the job and returns the job; the UI is a pure
   function of it. There is no second source of truth, no isLoading flag sitting next to stage
   waiting to disagree with it, and error is a FIELD rather than a parallel path. That is what
   makes the lifecycle an actual state machine instead of six booleans.

   idle -> listing -> ready -> fetching -> packing -> done
   error is reachable from any stage and always offers a way back.

   THE PREVIEW IS THE CORRECTNESS MECHANISM, NOT DECORATION. The count on screen is shown before
   anything downloads, and the done state re-states files-in-zip against files-GitHub-reported,
   so a short zip is visible rather than silent. That assertion is the whole app.
*/
(function () {
  "use strict";

  var job = null;
  var els = {};

  function reset() {
    job = { stage: "idle", url: "", listing: null, error: null, done: 0, total: 0, zip: null };
    render();
  }

  function set(patch) {
    Object.keys(patch).forEach(function (k) { job[k] = patch[k]; });
    render();
  }

  function fail(e) {
    set({ stage: "error", error: (e && e.message) || String(e) });
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ---------------- stages ---------------- */

  function look() {
    var url = (els.url && els.url.value || "").trim();
    if (!url) { fail(new Error("Paste a GitHub folder URL first, or pick a saved one.")); return; }
    set({ stage: "listing", url: url, error: null, listing: null, zip: null });

    GH.inspect(url).then(function (listing) {
      set({ stage: "ready", listing: listing, total: listing.files.length, done: 0 });
    }).catch(fail);
  }

  function grab() {
    if (!job.listing) return;
    set({ stage: "fetching", done: 0, error: null });

    GH.fetchAll(job.listing, function (done) {
      /* Progress only touches the counter; a full re-render per file would thrash the DOM on a
         large folder for no benefit. */
      job.done = done;
      if (els.meter) els.meter.style.width = Math.round((done / job.total) * 100) + "%";
      if (els.progress) els.progress.textContent = done + " of " + job.total + " files";
    }).then(function (entries) {
      set({ stage: "packing" });
      return ZIP.build(entries).then(function (z) {
        /* Re-assert before offering the download. gh.js already checked its own count; this
           checks what the ZIP actually contains, which is the number that matters. */
        if (z.entries !== job.listing.files.length) {
          throw new Error("The zip holds " + z.entries + " files but the listing found " +
                          job.listing.files.length + ". Refusing to hand you an incomplete archive.");
        }
        set({ stage: "done", zip: z });
      });
    }).catch(fail);
  }

  /* ---------------- render ---------------- */

  function stepper() {
    var order = ["idle", "listing", "ready", "fetching", "packing", "done"];
    var at = order.indexOf(job.stage);
    var steps = [
      { label: "1 · read the link", active: ["listing"], doneAt: 2 },
      { label: "2 · list the files", active: ["listing"], doneAt: 2 },
      { label: "3 · download them", active: ["fetching"], doneAt: 4 },
      { label: "4 · make the zip", active: ["packing"], doneAt: 5 }
    ];
    return '<div class="stepper" aria-label="Progress">' + steps.map(function (s) {
      var cls = "step";
      if (s.active.indexOf(job.stage) >= 0) cls += " is-active";
      else if (at >= s.doneAt) cls += " is-done";
      return '<span class="' + cls + '">' + s.label + "</span>";
    }).join("") + "</div>";
  }

  function previewPanel() {
    var l = job.listing;
    var row = function (k, v) { return "<dt>" + k + "</dt><dd>" + v + "</dd>"; };
    if (!l) {
      return '<dl class="kv">' + row("Repo", "&mdash;") + row("Branch or tag", "&mdash;") +
             row("Exact commit", "&mdash;") + row("Folder", "&mdash;") +
             row("Files found", "&mdash;") + row("Total size", "&mdash;") + "</dl>";
    }
    return '<dl class="kv">' +
      row("Repo", esc(l.owner + "/" + l.repo)) +
      row("Branch or tag", esc(l.ref)) +
      row("Exact commit", esc(l.sha.slice(0, 10))) +
      row("Folder", esc(l.path || "(whole repo)")) +
      row("Files found", l.files.length) +
      row("Total size", GH.humanBytes(l.totalBytes)) +
      "</dl>";
  }

  function skippedPanel() {
    var l = job.listing;
    if (!l || !l.skipped.length) return "";
    /* NAMED, never dropped quietly. This block existing at all is the point. */
    return '<div class="callout"><strong>' + l.skipped.length + " item" + (l.skipped.length === 1 ? "" : "s") +
      " cannot be packed and were left out:</strong><ul>" +
      l.skipped.map(function (s) { return "<li><code>" + esc(s.path) + "</code> &mdash; " + esc(s.why) + "</li>"; }).join("") +
      "</ul><p class=\"muted\">A submodule is a pointer to another repository, and a symlink's stored content is just the path it points at &mdash; neither has real file content here to download.</p></div>";
  }

  function fileTable() {
    var l = job.listing;
    if (!l) return "";
    var rows = l.files.slice(0, 300).map(function (f) {
      return '<tr><td class="mono">' + esc(f.rel) + '</td><td class="mono">' + GH.humanBytes(f.size) + "</td></tr>";
    }).join("");
    var more = l.files.length > 300
      ? '<p class="muted">Showing the first 300 of ' + l.files.length + ". All of them will be in the zip.</p>"
      : "";
    return "<h2>Files</h2>" + more +
      '<table class="tbl"><thead><tr><th>Path</th><th>Size</th></tr></thead><tbody>' + rows + "</tbody></table>";
  }

  function actions() {
    var s = job.stage;
    var busy = (s === "listing" || s === "fetching" || s === "packing");
    var out = '<div class="btn-row">';

    if (s === "ready") {
      out += '<button class="btn btn-primary" id="ggGrab">Download ' + job.listing.files.length +
             " file" + (job.listing.files.length === 1 ? "" : "s") + " as a zip</button>";
    } else if (s === "done") {
      out += '<a class="btn btn-primary" id="ggSave" href="' + URL.createObjectURL(job.zip.blob) +
             '" download="' + esc(GH.suggestName(job.listing)) + '">Save the zip</a>';
    } else {
      out += '<button class="btn btn-primary" id="ggLook"' + (busy ? " disabled" : "") + ">" +
             (busy ? "Working\u2026" : "Show me the files") + "</button>";
    }
    /* RESET always exists. Second-download-in-a-row is the most common real session and the
       state everyone forgets to build. */
    out += '<button class="btn btn-secondary" id="ggReset"' + (busy ? " disabled" : "") + ">Start over</button>";
    return out + "</div>";
  }

  function statusPanel() {
    if (job.stage === "error") {
      return '<div class="callout"><strong>\u274c ' + esc(job.error) + "</strong></div>";
    }
    if (job.stage === "fetching") {
      return '<div class="card"><p id="ggProgress" class="mono">0 of ' + job.total + ' files</p>' +
             '<div style="height:8px;background:var(--surface-3);border-radius:var(--radius-pill);overflow:hidden">' +
             '<div id="ggMeter" style="height:100%;width:0%;background:var(--accent);transition:width 120ms"></div></div></div>';
    }
    if (job.stage === "packing") {
      return '<div class="card"><p class="mono">Building the archive\u2026</p></div>';
    }
    if (job.stage === "done") {
      var n = job.zip.entries, promised = job.listing.files.length;
      return '<div class="callout"><strong>\u2705 ' + n + " file" + (n === 1 ? "" : "s") +
        " packed, " + GH.humanBytes(job.zip.bytes.length) + " (" + job.zip.method + ").</strong><br>" +
        "GitHub reported " + promised + ", the zip contains " + n +
        (n === promised ? " \u2014 they match." : " \u2014 THEY DO NOT MATCH.") + "</div>";
    }
    return "";
  }

  function render() {
    if (!els.out) return;
    els.out.innerHTML =
      stepper() + statusPanel() + actions() + skippedPanel() +
      "<h2>The preview</h2>" + previewPanel() + fileTable();

    els.progress = document.getElementById("ggProgress");
    els.meter = document.getElementById("ggMeter");

    var look_ = document.getElementById("ggLook");
    if (look_) look_.addEventListener("click", look);
    var grab_ = document.getElementById("ggGrab");
    if (grab_) grab_.addEventListener("click", grab);
    var reset_ = document.getElementById("ggReset");
    if (reset_) reset_.addEventListener("click", function () {
      if (els.url) els.url.value = "";
      if (els.preset) els.preset.value = "";
      reset();
    });
  }

  /* ---------------- mount ----------------
     Called by index.html's afterRender hook, because the router injects partials with innerHTML
     and a script tag inserted that way never executes. */
  function mount() {
    els.url = document.getElementById("ggUrl");
    els.preset = document.getElementById("ggPreset");
    els.out = document.getElementById("ggOut");
    if (!els.out) return;

    if (els.preset) {
      els.preset.addEventListener("change", function () {
        if (this.value && els.url) els.url.value = this.value;
      });
    }
    if (els.url) {
      els.url.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); look(); }
      });
    }
    reset();
  }

  window.GRAB = { mount: mount };
})();
