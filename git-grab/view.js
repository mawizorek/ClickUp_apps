/* view.js — every string this app renders. NO STATE, NO NETWORK, NO LISTENERS.

   Split out of app.js in v1.3 at the REDUCER / RENDER seam. Not a tidying exercise: app.js was
   14,841 B against a 15KB split line and the name-transform UI would have pushed it over. The
   panels were already pure `job -> string` functions sitting next to a state machine, so the
   seam existed before the split did. app.js now owns the job and the listeners; this file owns
   the markup and knows nothing about either.

   Cross-file calls resolve at CALL time (`VIEW.esc(...)`), never hoisted into a load-time var.
   That is the Prism lesson and it applies here for the same reason.

   🔴 THE FILE TABLE IS THE CORRECTNESS SURFACE, NOT DECORATION. It prints the names the archive
   will actually contain, BEFORE anything downloads. That is the only reason the rename feature
   is safe to ship: you see the result of the transform while you can still turn it off.
*/
(function () {
  "use strict";

  /* Rows past this are not rendered — 3,000 <tr> nodes is a scroll jank problem with no payoff.
     Consequence worth stating out loud: rows past the cap cannot be ticked individually and
     follow the master toggles. The table says so on screen. */
  var CAP = 300;

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

  function leaf(p) { return String(p).split("/").pop(); }

  /* ---------------- stepper ---------------- */
  function stepper(job) {
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

  /* ---------------- status ---------------- */
  function statusPanel(job) {
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
      var n = job.zip.entries, promised = job.listing.files.length, p = job.plan;
      /* The count line is unchanged by renaming, and that is the point: a rename changes what an
         entry is CALLED, never whether it exists. If these two numbers ever diverge it is a real
         short zip, not a side effect of the transform. */
      var extra = "";
      if (p && p.renamed) {
        extra = "<br>" + p.renamed + " entr" + (p.renamed === 1 ? "y was" : "ies were") + " renamed on the way in" +
                (p.blocked.length ? ", and " + p.blocked.length + " kept " + (p.blocked.length === 1 ? "its" : "their") +
                 " original name" + (p.blocked.length === 1 ? "" : "s") + " \u2014 listed below." : ".");
      }
      return '<div class="callout"><strong>\u2705 ' + n + " file" + (n === 1 ? "" : "s") +
        " packed, " + GH.humanBytes(job.zip.bytes.length) + " (" + job.zip.method + ").</strong><br>" +
        "GitHub reported " + promised + ", the zip contains " + n +
        (n === promised ? " \u2014 they match." : " \u2014 THEY DO NOT MATCH.") + extra + "</div>";
    }
    return "";
  }

  /* ---------------- size guard ---------------- */
  function sizePanel(job, ctx) {
    var l = job.listing;
    if (!l || job.stage !== "ready") return "";
    var b = l.totalBytes, LIMITS = ctx.limits;
    if (b <= LIMITS.warn) return "";

    var human = GH.humanBytes(b);
    if (b > LIMITS.confirm) {
      return '<div class="callout"><strong>\u26a0\ufe0f ' + human + " is a lot to hold in a browser tab.</strong> " +
        "This tool builds the entire archive in memory before handing it to you, so peak usage is " +
        "roughly two and a half times the folder size. It may work; it may also stall the tab. " +
        "<em>That range is an estimate, not a measurement.</em>" +
        '<p><label class="ack"><input type="checkbox" id="ggAck"' + (job.acked ? " checked" : "") + "> " +
        "I understand, download it anyway</label></p></div>";
    }
    return '<div class="callout"><strong>Heads up: ' + human + ".</strong> " +
      "Large enough to take a moment and use real memory, but it should be fine.</div>";
  }

  /* ---------------- exclusions ---------------- */
  function skippedPanel(job) {
    var l = job.listing;
    if (!l || !l.skipped.length) return "";
    /* NAMED, never dropped quietly. This block existing at all is the point of the app. */
    return '<div class="callout"><strong>' + l.skipped.length + " item" + (l.skipped.length === 1 ? "" : "s") +
      " cannot be packed and were left out:</strong><ul>" +
      l.skipped.map(function (s) { return "<li><code>" + wrapPath(s.path) + "</code> &mdash; " + esc(s.why) + "</li>"; }).join("") +
      '</ul><p class="muted">A submodule is a pointer to another repository, and a symlink\u2019s stored content is just ' +
      "the path it points at &mdash; neither has real file content here to download.</p></div>";
  }

  /* ---------------- preview ---------------- */
  function previewPanel(job) {
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

  /* ---------------- name transform ---------------- */

  /* The one-line verdict under the toggles. Patched in place on every tick rather than
     re-rendered with the panel, so a checkbox never gets destroyed mid-interaction. */
  function nameSummary(p) {
    if (!p) return "";
    if (!p.active) {
      return '<span class="muted">' + p.markdown + " markdown file" + (p.markdown === 1 ? "" : "s") +
             " in this folder. Nothing will be renamed.</span>";
    }
    var out = "<strong>" + p.renamed + " file" + (p.renamed === 1 ? "" : "s") + " will be renamed.</strong>";
    if (p.blocked.length) {
      out += ' <span class="out-blocked">' + p.blocked.length + " stay" + (p.blocked.length === 1 ? "s" : "") +
             " as markdown \u2014 a file with that name is already in the folder. " +
             "Every one of them is still in the zip.</span>";
    }
    return out;
  }

  /* The second line inside a path cell: what this file will be called in the archive. */
  function outCell(f) {
    if (f.blocked) {
      return '<span class="out out-blocked" title="' + esc(f.blocked.holder) + ' is already here">\u21b3 stays ' +
             wrapPath(leaf(f.rel)) + " (" + wrapPath(leaf(f.blocked.holder)) + " already exists)</span>";
    }
    if (f.renamed) {
      return '<span class="out out-new">\u21b3 ' + wrapPath(leaf(f.out)) + "</span>";
    }
    return "";
  }

  function nameControls(job) {
    var p = job.plan;
    /* No markdown in this folder means no feature. A toggle that can never do anything is noise. */
    if (!p || !p.markdown || job.stage !== "ready") return "";
    var n = job.names;
    return '<div class="card namebox">' +
      "<h3>Markdown files</h3>" +
      '<p class="muted">Markdown has no guaranteed handler \u2014 on a machine without a markdown editor a ' +
      "double-click is a coin flip. <code>.txt</code> opens the same way everywhere, and renaming one back " +
      "to <code>.md</code> restores the rendering. Only markdown is touched: <code>index.html</code> and " +
      "<code>index.js</code> are left alone because renaming those breaks what you downloaded.</p>" +
      '<label class="opt"><input type="checkbox" id="ggOptMd"' + (n.md ? " checked" : "") + "> " +
      "Convert every markdown file to <code>.txt</code></label>" +
      '<label class="opt"><input type="checkbox" id="ggOptIdx"' + (n.idx ? " checked" : "") + "> " +
      "Rename <code>index.md</code> to <code>&lt;folder&gt;_index</code>, so ten of them are tellable apart</label>" +
      '<p class="name-sum" id="ggNameSum">' + nameSummary(p) + "</p>" +
      '<p class="muted">Or tick files one at a time in the table below. A master toggle clears those ' +
      "individual choices.</p></div>";
  }

  /* ---------------- file table ---------------- */
  function fileTable(job) {
    var l = job.listing;
    if (!l) return "";
    var p = job.plan;
    var pickable = !!(p && p.markdown && job.stage === "ready");

    var rows = l.files.slice(0, CAP).map(function (f) {
      var cell;
      if (pickable && f.md) {
        cell = '<label><input type="checkbox" class="rowpick" data-rel="' + esc(f.rel) + '"' +
               (f.on ? " checked" : "") + ' aria-label="Convert ' + esc(f.rel) + '">' +
               "<span>" + wrapPath(f.rel) + outCell(f) + "</span></label>";
      } else if (pickable) {
        cell = '<label><span class="rowpick-gap"></span><span>' + wrapPath(f.rel) + "</span></label>";
      } else {
        cell = wrapPath(f.rel) + outCell(f);
      }
      return '<tr data-rel="' + esc(f.rel) + '"><td class="mono path">' + cell +
             '</td><td class="mono num">' + GH.humanBytes(f.size) + "</td></tr>";
    }).join("");

    var notes = "";
    if (l.files.length > CAP) {
      notes = '<p class="muted">Showing the first ' + CAP + " of " + l.files.length +
        ". All of them will be in the zip" +
        (pickable ? ", and the rest follow the toggles above \u2014 only these " + CAP + " can be ticked one by one" : "") +
        ".</p>";
    }

    return "<h2>Files</h2>" + notes +
      '<table class="tbl tbl-files"><thead><tr><th>Path' +
      (pickable ? ' <span class="muted">(and what it will be called)</span>' : "") +
      "</th><th>Size</th></tr></thead><tbody>" + rows + "</tbody></table>";
  }

  /* ---------------- actions ---------------- */
  function actions(job, ctx) {
    var s = job.stage;
    var isBusy = ctx.busy;
    var out = '<div class="btn-row">';

    if (s === "ready") {
      var needsAck = job.listing.totalBytes > ctx.limits.confirm && !job.acked;
      out += '<button class="btn btn-primary" id="ggGrab"' + (needsAck ? " disabled" : "") + ">Download " +
             job.listing.files.length + " file" + (job.listing.files.length === 1 ? "" : "s") + " as a zip</button>";
    } else if (s === "done") {
      out += '<a class="btn btn-primary" id="ggSave" href="' + ctx.saveURL +
             '" download="' + esc(GH.suggestName(job.listing, job.plan)) + '">Save the zip</a>';
    } else {
      out += '<button class="btn btn-primary" id="ggLook"' + (isBusy ? " disabled" : "") + ">" +
             (isBusy ? "Working\u2026" : "Show me the files") + "</button>";
    }
    /* Start over always exists. Second-download-in-a-row is the most common real session and the
       state everyone forgets to build. */
    out += '<button class="btn btn-secondary" id="ggReset"' + (isBusy ? " disabled" : "") + ">Start over</button>";
    return out + "</div>";
  }

  /* ---------------- the whole surface ----------------
     ctx: { limits, saveURL, busy } — everything view needs that lives in app.js. Passed in
     rather than reached for, so this file stays a pure function of its arguments. */
  function html(job, ctx) {
    return stepper(job) + statusPanel(job) + sizePanel(job, ctx) + actions(job, ctx) +
           skippedPanel(job) + "<h2>The preview</h2>" + previewPanel(job) +
           nameControls(job) + fileTable(job);
  }

  window.VIEW = {
    html: html,
    esc: esc,
    wrapPath: wrapPath,
    outCell: outCell,
    nameSummary: nameSummary,
    CAP: CAP
  };
})();
