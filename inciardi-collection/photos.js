/* Inciardi Collection — PHOTOS. The image library: everything shot or adopted, assigned or not.
 *
 * ROUTE: `#photos`. Named at Q19 → A, where Michael struck his OWN word — he asked for a
 * "library" and then rejected Library, Darkroom and Flat file in favour of the plainest option.
 * Same instinct as Q11 picking SHEET/SIDE/SLOT over the more natural PAGE/FACE/POSITION.
 * 🚫 No document calls this "the library" from here on.
 *
 * ============================================================================
 * 🔴 UNASSIGNED IS THE DEFAULT VIEW, AND IT IS THE POINT OF THE SCREEN (J15).
 *
 * Beckett's objection to an image library was that it becomes a junk drawer: 177 adopted photos
 * plus every future upload, and nobody links any of them. The counter is that this app already
 * solved that exact problem once — the SHOE-BOX shows owned-but-unplaced PRINTS, so the backlog
 * is the first thing you see rather than something you have to go looking for.
 *
 * An unassigned image is an uploaded-but-unlinked photo. Same shape, same answer. ⭐ Michael
 * independently reinvented the shoe-box for images, which is the strongest argument available
 * that this fits the app's existing model rather than bolting onto it.
 * ============================================================================
 *
 * Q23 → C is the scope switch: bring in all 177, but OPEN showing only what is relevant to
 * prints he owns. Implemented on `image.kind` — 'upload' is his, 'scrub'/'reference' are hers —
 * so it needs no new column and no second claimant on a fact `kind` already owns.
 */
(function () {

  var state = {
    scope: 'mine',            // mine | theirs | all
    showAssigned: false,
    images: [],
    counts: {},
    prints: null,             // lazily fetched, only when the assign drawer first opens
    picked: null              // the image currently being assigned
  };

  function esc(s) { return Core.esc(s); }
  function $(id) { return document.getElementById(id); }

  /* Served through the worker proxy, never straight from R2 — the bucket is private, which is
   * what lets an archived photo 404 without anything touching the bytes (J13). */
  function src(im) { return API.base() + '/image/' + encodeURIComponent(im.image_id); }

  /* ---------- toolbar ---------- */
  function toolbar() {
    var c = state.counts || {};
    var tabs = [['mine', 'Mine', c.mine], ['theirs', 'Hers', c.theirs], ['all', 'All', c.total]]
      .map(function (t) {
        return '<button class="ph-tab' + (state.scope === t[0] ? ' is-on' : '') +
          '" data-scope="' + t[0] + '">' + t[1] +
          (t[2] == null ? '' : ' <span class="ph-n">' + t[2] + '</span>') + '</button>';
      }).join('');

    return '<div class="ph-bar">' +
        '<div class="ph-tabs" role="group" aria-label="Whose photographs">' + tabs + '</div>' +
        '<label class="ph-check"><input type="checkbox" id="phAssigned"' +
          (state.showAssigned ? ' checked' : '') + '> show assigned ones too</label>' +
      '</div>';
  }

  /* ---------- one tile ----------
   * The caption is the print id for an adopted photo (adopt.js writes it there) and the file's
   * own caption for an upload. A tile with nothing on it is a grey box, and a grey box is how an
   * outage hides — the same rule that puts initials on a photo-less binder card. */
  function tile(im) {
    var links = Number(im.links || 0);
    return '<button class="ph-tile' + (links ? ' is-linked' : '') + '" data-id="' +
        esc(im.image_id) + '">' +
 woop      '</button>';
  }

  window.Photos = {};
})();
