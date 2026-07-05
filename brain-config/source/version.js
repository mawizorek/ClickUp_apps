/* Brain Config — build stamp.
   Single source of the running build number. Because the LOADED js writes this into
   the footer, a stale (cached) bundle shows an OLD number: that's the point, it's a
   concrete "am I current?" readout. Bump BUILD on every ship; keep this file tiny so a
   version bump is a one-line edit that never risks the bigger modules.
   Loaded last by the shell so the footer already exists. */
(function () {
  'use strict';
  var BUILD = 'v3.6';
  var SHIPPED = '2026-07-04';
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
    el.textContent = 'build ' + BUILD + ' · ' + SHIPPED;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', stamp);
  else stamp();
})();
