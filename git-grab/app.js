/* app.js — the job reducer, the stages, and the event wiring.

   ONE RECORD, ONE RENDER. Every stage takes the job and returns the job; the UI is a pure
   function of it. No second source of truth, no isLoading flag sitting next to stage waiting to
   disagree with it, and error is a FIELD rather than a parallel path. That is what makes the
   lifecycle an actual state machine instead of six booleans.

   idle -> listing -> ready -> fetching -> packing -> done
   error is reachable from any stage and always offers a way back.

   THE PREVIEW IS THE CORRECTNESS MECHANISM, NOT DECORATION. The count is shown before anything
   downloads, and the done state prints files-in-zip against files-GitHub-reported so a short zip
   is visible rather than silent.

   🔴 GENERATION GUARD (v1.2). One record plus async work means a superseded job can write into
   its successor. Every job start increments `gen`; every async continuation captures the value
   and bails if it no longer matches. Without it, hitting Enter mid-fetch produced a zip built
   from one folder's blobs whose count was asserted against a different folder's listing — the
   count check is the entire product, so comparing two unrelated numbers is the worst available
   failure. See the Wave 4 PR for the full trace.

   v1.3 — TWO CHANGES:
     1. The markup moved to `view.js` at the reducer/render seam. This file was 14,841 B against
        a 15KB split line and the rename UI would have pushed it over.
     2. `job.names` + `job.plan` hold the export-name transform. The plan is recomputed on every
        toggle from `names.js` — synchronous, no network, no re-listing. The rename NEVER drops
        a file, so the count assertions below are untouched by it.
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
     earlier than desktop. Treat these as cautious guesses that are honest about being guesses,
     and move them once somebody actually measures. */
  var LIMITS = {
    warn:   100 * 1024 * 1024,  // 100 MB — proceed, but say something
    confirm: 250 * 1024 * 1024, // 250 MB — require an explicit tick
    refuse: 1024 * 1024 * 1024  //   1 GB — do not attempt
  };

  var job = null;
  var els = {};
  var wired = false;

  /* Bumped on every job start. An async continuation whose captured value no longer matches has
     been superseded and must not touch state. */
  var gen = 0;

  /* The one blob URL this app hands out. Minted once per completed job and revoked before the
     next one, because it pins the entire archive in memory until released. */
  var saveURL = null;
  function dropSaveURL() {
    if (saveURL) { try { URL.revokeObjectURL(saveURL); } catch (e) {} saveURL = null; }
  }

  function reset() {
    gen++;
    dropSaveURL();
    job = {
      stage: "idle", url: "", listing: null, error: null, done: 0, total: 0, zip: null, acked: false,
      /* rows is the per-file override map, keyed by the ORIGINAL name. A master toggle empties
         it, which is why the panel copy says so out loud. */
      names: { md: false, idx: false, rows: Object.create(null) },
      plan: null
    };
    render();
  }

  function set(patch) {
    Object.keys(patch).forEach(function (k) { job[k] = patch[k]; });
    render();
  }

  function fail(e) {
    set({ stage: "error", error: (e && e.message) || String(e) });
  }

  function busy() {
    return job.stage === "listing" || job.stage === "fetching" || job.stage === "packing";
  }

  /* Idempotent by construction — names.js derives everything from f.rel, never from f.out — so
     calling this defensively before a pack costs nothing and guarantees the zip matches the
     table the user was looking at. */
  function replan() {
    job.plan = (job.listing && window.NAMES) ? NAMES.plan(job.listing, job.names) : null;
    return job.plan;
  }

  /* ---------------- stages ---------------- */

  function look() {
    /* The buttons are disabled while busy; the URL field's Enter key is not, which is how a
       second job used to start on top of a running one. Guard the ENTRY too, not just the UI. */
    if (busy()) return;

    var url = (els.url && els.url.value || "").trim();
    if (!url) { fail(new Error("Paste a GitHub folder URL first, or pick a saved one.")); return; }

    var mine = ++gen;
    dropSaveURL();
    set({ stage: "listing", url: url, error: null, listing: null, zip: null, acked: false, plan: null });

    GH.inspect(url).then(function (listing) {
      if (mine !== gen) return; /* superseded — die quietly */
      if (listing.totalBytes > LIMITS.refuse) {
        throw new Error(
          "That folder is " + GH.humanBytes(listing.totalBytes) + " across " + listing.files.length +
          " files, which is past what this tool can do. It builds the whole archive in memory as one " +
          "contiguous block, so the browser tab would run out of room part-way and die without " +
          "telling you why. Grab a subfolder instead, or clone the repo."
        );
      }
      /* Plan before the first render so the table never paints names it is about to change. */
      job.listing = listing;
      job.names = { md: false, idx: false, rows: Object.create(null) };
      replan();
      set({ stage: "ready", listing: listing, total: listing.files.length, done: 0 });
    }).catch(function (e) {
      if (mine !== gen) return;
      fail(e);
    });
  }

  function grab() {
    if (!job.listing || busy()) return;

    /* Hard confirm above the middle threshold. Not a block — a speed bump with a real number on
       it, which is the whole of Cass's ask. */
    if (job.listing.totalBytes > LIMITS.confirm && !job.acked) return;

    var mine = ++gen;
    var listing = job.listing; /* pin it: comparing against job.listing later is the bug */
    replan();                  /* the entry names are whatever the table last showed */
    set({ stage: "fetching", done: 0, error: null });

    GH.fetchAll(listing, function (done) {
      if (mine !== gen) return;
      /* Progress touches two nodes directly; a full re-render per file would thrash the DOM on a
         large folder for no benefit. */
      job.done = done;
      if (els.meter) els.meter.style.width = Math.round((done / job.total) * 100) + "%";
      if (els.progress) els.progress.textContent = done + " of " + job.total + " files";
    }).then(function (entries) {
      if (mine !== gen) return;
      set({ stage: "packing" });
      return ZIP.build(entries).then(function (z) {
        if (mine !== gen) return;
        /* Re-assert before offering the download, against the PINNED listing rather than
           job.listing — which a superseded job could have replaced underneath us.

           Renaming cannot move this number. names.js changes what an entry is CALLED and never
           whether it EXISTS; a collision keeps the original name rather than dropping the file.
           So a mismatch here still means exactly what it always meant: a short zip. */
        if (z.entries !== listing.files.length) {
          throw new Error("The zip holds " + z.entries + " files but the listing found " +
                          listing.files.length + ". Refusing to hand you an incomplete archive.");
        }
        dropSaveURL();
        saveURL = URL.createObjectURL(z.blob);
        set({ stage: "done", zip: z });
      });
    }).catch(function (e) {
      if (mine !== gen) return;
      fail(e);
    });
  }

  /* ---------------- name transform wiring ----------------
     A tick must NOT go through set(). set() re-renders via innerHTML, which destroys the very
     checkbox being clicked — focus lost, scroll jumped, and on a 300-row table that is the whole
     interaction ruined. Same lesson as the size acknowledgement in Wave 4, applied to 300 more
     controls. So: recompute the plan, then patch the cells that changed, in place.

     One tick CAN change another row (a freed name lets a blocked rename through), so every
     rendered row is refreshed from the new plan rather than just the one that was clicked. */
  function repaintNames() {
    var plan = replan();
    if (!plan) return;

    var sum = document.getElementById("ggNameSum");
    if (sum) sum.innerHTML = VIEW.nameSummary(plan);

    var rows = els.out ? els.out.querySelectorAll("tr[data-rel]") : [];
    for (var i = 0; i < rows.length; i++) {
      var tr = rows[i];
      var f = plan.byRel[tr.getAttribute("data-rel")];
      if (!f) continue;

      var box = tr.querySelector(".rowpick");
      if (box) box.checked = !!f.on;

      var span = tr.querySelector("td.path span:last-child");
      if (!span) continue;
      var old = span.querySelector(".out");
      if (old) old.parentNode.removeChild(old);
      var markup = VIEW.outCell(f);
      if (markup) span.insertAdjacentHTML("beforeend", markup);
    }
  }

  /* ---------------- render ---------------- */

  function render() {
    if (!els.out) return;
    els.out.innerHTML = VIEW.html(job, { limits: LIMITS, saveURL: saveURL, busy: busy() });

    els.progress = document.getElementById("ggProgress");
    els.meter = document.getElementById("ggMeter");

    var lookBtn = document.getElementById("ggLook");
    if (lookBtn) lookBtn.addEventListener("click", look);

    var grabBtn = document.getElementById("ggGrab");
    if (grabBtn) grabBtn.addEventListener("click", grab);

    var resetBtn = document.getElementById("ggReset");
    if (resetBtn) resetBtn.addEventListener("click", function () {
      if (els.url) els.url.value = "";
      if (els.preset) els.preset.value = "";
      reset();
    });
  }

  /* Every checkbox in the surface, on ONE delegated listener bound once to a container that
     render() never replaces. Nothing here re-renders; each branch patches what it owns. */
  function onChange(e) {
    var t = e.target;
    if (!t) return;

    if (t.id === "ggAck") {
      job.acked = t.checked;
      var g = document.getElementById("ggGrab");
      if (g) g.disabled = !t.checked;
      return;
    }

    if (t.id === "ggOptMd" || t.id === "ggOptIdx") {
      /* A master toggle CLEARS the per-file choices. The alternative is a table where a row's
         state has an invisible origin — inherited or overridden, no way to tell — and the copy
         in the panel promises this behaviour. */
      job.names.rows = Object.create(null);
      if (t.id === "ggOptMd") job.names.md = t.checked;
      else job.names.idx = t.checked;
      repaintNames();
      return;
    }

    if (t.className && String(t.className).indexOf("rowpick") >= 0) {
      job.names.rows[t.getAttribute("data-rel")] = t.checked;
      repaintNames();
    }
  }

  /* ---------------- mount ----------------
     Called by index.html's afterRender hook, because the router injects partials with innerHTML
     and a script tag inserted that way never executes. */
  function mount() {
    els.url = document.getElementById("ggUrl");
    els.preset = document.getElementById("ggPreset");
    els.out = document.getElementById("ggOut");
    if (!els.out) return;

    /* #ggOut survives every render (only its innerHTML is replaced), so one delegated listener
       outlives them all. Guarded because the router can mount the page more than once. */
    if (!wired) { els.out.addEventListener("change", onChange); wired = true; }

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
