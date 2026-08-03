/* app.js — the job reducer and the render.

   ONE RECORD, ONE RENDER. Every stage takes the job and returns the job; the UI is a pure
   function of it. No second source of truth, no isLoading flag sitting next to stage waiting to
   disagree with it, and error is a FIELD rather than a parallel path. That is what makes the
   lifecycle an actual state machine instead of six booleans.

   idle -> listing -> ready -> fetching -> packing -> done
   error is reachable from any stage and always offers a way back.

   THE PREVIEW IS THE CORRECTNESS MECHANISM, NOT DECORATION. The count is shown before anything
   downloads, and the done state prints files-in-zip against files-GitHub-reported so a short zip
   is visible rather than silent.
*/
(function () {
  "use strict";

  /* ---------------- size limits (Wave 4) ----------------
     One object, so the thresholds are editable without hunting through the render.

     ⚠️ THESE ARE POLICY LINES DERIVED FROM ARITHMETIC, NOT MEASUREMENTS. Nobody has profiled
     this app. The reasoning: zip.js allocates ONE CONTIGUOUS BUFFER sized to the whole archive
     (new Writer(total)) while every file body and every deflated copy is still held, so peak
     memory is roughly 2.5x the folder size — and a single contiguous allocation fails well
     before the same number of bytes scattered across many small ones. Mobile Safari gives up far
     earlier than desktop. Treat these numbers as cautious guesses that are honest about being
     guesses, and move them once somebody actually measures. */
  var LIMITS = {
    warn:   100 * 1024 * 1024,  // 100 MB — proceed, but say something
    confirm: 250 * 1024 * 1024, // 250 MB — require an explicit tick
    refuse: 1024 * 1024 * 1024  //   1 GB — do not attempt
  };

  var job = null;
  var els = {};

  /* The one blob URL this app hands out. Minted once per completed job and revoked before the
     next one, because it pins the entire archive in memory until it is released. */
  var saveURL = null;
  function dropSaveURL() {
    if (saveURL) { try { URL.revokeObjectURL(saveURL); } catch (e) {} saveURL = null; }
  }

  function reset() {
    dropSaveURL();
    job = { stage: "idle", url: "", listing: null, error: null, done: 0, total: 0, zip: null, acked: false };
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

  /* Break a long path so it wraps instead of forcing horizontal scroll at 320px.
     A zero-width space after each slash: invisible, copies clean, no CSS hack needed. */
  function wrapPath(p) {
    return esc(p).replace(/\//g, "/\u200B");
  }

  /* ---------------- stages ---------------- */

  function look() {
    var url = (els.url && els.url.value || "").trim();
    if (!url) { fail(new Error("Paste a GitHub folder URL first, or pick a saved one.")); return; }
    dropSaveURL();
    set({ stage: "listing", url: url, error: null, listing: null, zip: null, acked: false });

    GH.inspect(url).then(function (listing) {
      if (listing.totalBytes > LIMITS.refuse) {
        throw new Error(
          "That folder is " + GH.humanBytes(listing.totalBytes) + " across " + listing.files.length +
          " files, which is past what this tool can do. It builds the whole archive in memory as one " +
          "contiguous block, so the browser tab would run out of room part-way and die without " +
          "telling you why. Grab a subfolder instead, or clone the repo."
        );
      }
      set({ stage: "ready", listing: listing, total: listing.files.length, done: 0 });
    }).catch(fail);
  }

  function grab() {
    if (!job.listing) return;

    /* Hard confirm above the middle threshold. Not a block — a speed bump with a real number on
       it, which is the whole of Cass's ask. */
    if (job.listing.totalBytes > LIMITS.confirm && !job.acked) {
      set({ error: null });
      return;
    }

    set({ stage: "fetching", done: 0, error: null });

    GH.fetchAll(job.listing, function (done) {
      /* Progress touches two nodes directly; a full re-render per file would thrash the DOM on a
         large folder for no benefit. */
      job.done = done;
      if (els.meter) els.meter.style.width = Math.round((done / job.total) * 100) + "%";
      if (els.progress) els.progress.textContent = done + " of " + job.total + " files";
    }).then(function (entries) {
      set({ stage: "packing" });
      return ZIP.build(entries).then(function (z) {
        /* Re-assert before offering the download. gh.js checked its own count; this checks what
           the ZIP actually contains, which is the number that matters. */
        if (z.entries !== job.listing.files.length) {
          throw new Error("The zip holds " + z.entries + " files but the listing found " +
                          job.listing.files.length + ". Refusing to hand you an incomplete archive.");
        }
        dropSaveURL();
        saveURL = URL.createObjectURL(z.blob);
        set({ stage: "done", zip: z });
      });
    }).catch(fail);
  }

  /* ---------------- render ---------------- */

  function stepper() {
    var order = ["idle", "listing", "ready", "fetching", "packing", "done"];
    var at = order.indexOf(job.stage);
    var steps = [
      { label: "1 \u00b7 read the link",  active: ["listing"],  doneAt: 2 },
      { label: "2 \u00b7 list the files", active: ["listing"],  doneAt: 2 },
      { label: "3 \u00b7 download them",  active: ["fetching"], doneAt: 4 },
      { label: "4 \u00b7 make the zip",   active: ["packing"],  doneAt: 5 }
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
      row("Branch or tag", wrapPath(l.ref)) +
      row("Exact commit", esc(l.sha.slice(0, 10))) +
      row("Folder", wrapPath(l.path || "(whole repo)")) +
      row("Files found", l.files.length) +
      row("Total size", GH.humanBytes(l.totalBytes)) +
      "</dl>";
  }

  function sizePanel() {
    var l = job.listing;
    if (!l || job.stage !== "ready") return "";
    var b = l.totalBytes;
    if (b <= LIMITS.warn) return "";

    var human = GH.humanBytes(b);
    if (b > LIMITS.confirm) {
      return '<div class="callout"><strong>\u26a0\ufe0f ' + human + " is a lot to hold in a browser tab.</strong> " +
        "This tool builds the entire archive in memory before handing it to you, so peak usage is " +
        "roughly two and a half times the folder size. It may work; it may also stall the tab. " +
        "<em>That range is an estimate, not a measurement.</em>" +
        '<p><label><input type="checkbox" id="ggAck"' + (job.acked ? " checked" : "") + "> " +
        "I understand, download it anyway</label></p></div>";
    }
    return '<div class="callout"><strong>Heads up: ' + human + ".</strong> " +
      "Large enough to take a moment and use real memory, but it should be fine.</div>";
  }

  function skippedPanel() {
    var l = job.listing;
    if (!l || !l.skipped.length) return "";
    /* NAMED, never dropped quietly. This block existing at all is the point of the app. */
    return '<div class="callout"><strong>' + l.skipped.length + " item" + (l.skipped.length === 1 ? "" : "s") +
      " cannot be packed and were left out:</strong><ul>" +
      l.skipped.map(function (s) { return "<li><code>" + wrapPath(s.path) + "</code> &mdash; " + esc(s.why) + "</li>"; }).join("") +
      '</ul><p class="muted">A submodule is a pointer to another repository, and a symlink\u2019s stored content is just ' +
      "the path it points at &mdash; neither has real file content here to download.</p></div>";
  }

  function fileTable() {
    var l = job.listing;
    if (!l) return "";
    var rows = l.files.slice(0, 300).map(function (f) {
      return '<tr><td class="mono path">' + wrapPath(f.rel) + '</td><td class="mono num">' + GH.humanBytes(f.size) + "</td></tr>";
    }).join("");
    var more = l.files.length > 300
      ? '<p class="muted">Showing the first 300 of ' + l.files.length + ". All of them will be in the zip.</p>"
      : "";
    return "<h2>Files</h2>" + more +
      '<table class="tbl tbl-files"><thead><tr><th>Path</th><th>Size</th></tr></thead><tbody>' + rows + "</tbody></table>";
  }

  function actions() {
    var s = job.stage;
    var busy = (s === "listing" || s === "fetching" || s === "packing");
    var out = '<div class="btn-row">';

    if (s === "ready") {
      var needsAck = job.listing.totalBytes > LIMITS.confirm && !job.acked;
      out += '<button class="btn btn-primary" id="ggGrab"' + (needsAck ? " disabled" : "") + ">Download " +
             job.listing.files.length + " file" + (job.listing.files.length === 1 ? "" : "s") + " as a zip</button>";
    } else if (s === "done") {
      out += '<a class="btn btn-primary" id="ggSave" href="' + saveURL +
             '" download="' + esc(GH.suggestName(job.listing)) + '">Save the zip</a>';
    } else {
      out += '<button class="btn btn-primary" id="ggLook"' + (busy ? " disabled" : "") + ">" +
             (busy ? "Working\u2026" : "Show me the files") + "</button>";
    }
    /* Start over always exists. Second-download-in-a-row is the most common real session and the
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
             '<div class="meter-track"><div id="ggMeter" class="meter-fill"></div></div></div>';
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
      stepper() + statusPanel() + sizePanel() + actions() + skippedPanel() +
      "<h2>The preview</h2>" + previewPanel() + fileTable();

    els.progress = document.getElementById("ggProgress");
    els.meter = document.getElementById("ggMeter");

    var lookBtn = document.getElementById("ggLook");
    if (lookBtn) lookBtn.addEventListener("click", look);

    var grabBtn = document.getElementById("ggGrab");
    if (grabBtn) grabBtn.addEventListener("click", grab);

    var ack = document.getElementById("ggAck");
    if (ack) ack.addEventListener("change", function () { set({ acked: this.checked }); });

    var resetBtn = document.getElementById("ggReset");
    if (resetBtn) resetBtn.addEventListener("click", function () {
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

  window.GRAB = { mount: mount, LIMITS: LIMITS };
})();
