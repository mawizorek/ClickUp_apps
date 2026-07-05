/* TIDR footer build stamp — SHARED STANDARD across every app in this repo.
   Copy this file into <app-slug>/source/version.js and load it LAST in the shell
   (after every other script, so <footer> already exists). On every ship, bump the
   two constants below; keep this file tiny so a version bump is a one-line edit that
   never risks the bigger modules.

   Format: 'v<build> · PR#<n>'  — running version + the PR that shipped it, no date.
   Because the LOADED js writes the stamp, a stale (cached) bundle shows an OLD stamp,
   which is the whole point: a concrete "am I on the current build?" readout for the
   user, and the fastest way to tell a cache problem from a real bug.

   Single-file apps (no source/ split): inline this IIFE at the end of the <script>
   block instead of loading it as a file. Same stamp, same footer contract. */
(function () {
  'use strict';
  var BUILD = 'v1';       // bump every ship
  var PR = 'PR#0';        // the PR that shipped this build (or the direct-commit note)
  window.APP_BUILD = BUILD;

  function stamp() {
    var footer = document.querySelector('footer');
    if (!footer) { setTimeout(stamp, 150); return; }
    var el = document.getElementById('build-stamp');
    if (!el) {
      el = document.createElement('div');
      el.id = 'build-stamp';
      el.style.marginTop = '6px';
      el.style.opacity = '0.8';
      footer.appendChild(el);
    }
    el.textContent = BUILD + ' · ' + PR;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', stamp);
  else stamp();
})();
