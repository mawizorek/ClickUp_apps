/* Brain Config — build stamp (TIDR footer standard, shared across all apps).
   Format: 'v<build> · PR#<n>' — version + the PR that shipped it, no date.
   Because the LOADED js writes this into the footer, a stale (cached) bundle shows an
   OLD stamp: a concrete "am I current?" readout. On every ship: bump BUILD + PR, keep
   this file tiny so the version bump never risks the bigger modules. Loaded last. */
(function () {
  'use strict';
  var BUILD = 'v3.6';
  var PR = 'PR#32';
  window.BRAIN_CONFIG_BUILD = BUILD;

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
