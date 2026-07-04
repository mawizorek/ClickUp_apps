/* Permanent weekend-surface mount layer.
   Owns lifecycle only: mount home card, mount weekend center, bind controls,
   and re-run after router or app mutations.
 */

function mountCurrentRoundCard() {
  const hero = document.querySelector('.home-h');
  const track = readCurrentTrack();
  if (!hero || !track) return;
  const existing = document.getElementById(HOME_ID);
  if (existing) existing.remove();
  hero.insertAdjacentHTML('afterend', renderHomeCard(track));
  bindCurrentRoundCard();
}

function bindCurrentRoundCard() {
  const trigger = document.querySelector('[data-open-weekend]');
  if (!trigger || trigger.__ppBound) return;
  trigger.__ppBound = true;
  trigger.addEventListener('click', function () {
    const slug = trigger.getAttribute('data-open-weekend');
    const nextHash = '#/' + slug;
    if (location.hash === nextHash) {
      if (typeof router === 'function') router();
      return;
    }
    location.hash = nextHash;
    window.setTimeout(function () {
      if (typeof router === 'function') router();
    }, 0);
  });
}

function bindWeekendCenter(track) {
  const center = document.getElementById(CENTER_ID);
  if (!center) return;

  center.addEventListener('click', function (event) {
    const tab = event.target.closest('[data-mode]');
    if (tab && !tab.hasAttribute('disabled')) {
      clearReplay(track.slug);
      replayState(track.slug).mode = tab.dataset.mode;
      mountWeekendCenter();
      return;
    }

    const action = event.target.closest('[data-action]');
    if (!action) return;
    const replay = REPLAY_DATA[track.slug];
    const state = replayState(track.slug);
    if (!replay) return;

    if (action.dataset.action === 'prev') {
      clearReplay(track.slug);
      state.beat = Math.max(0, state.beat - 1);
    } else if (action.dataset.action === 'next') {
      clearReplay(track.slug);
      state.beat = Math.min(replay.beats.length - 1, state.beat + 1);
    } else if (action.dataset.action === 'play') {
      clearReplay(track.slug);
      replayTimers[track.slug] = window.setInterval(function () {
        const liveState = replayState(track.slug);
        liveState.beat = (liveState.beat + 1) % replay.beats.length;
        mountWeekendCenter();
      }, Math.max(700, 1800 / replayState(track.slug).speed));
      return;
    } else if (action.dataset.action === 'pause') {
      clearReplay(track.slug);
    }

    mountWeekendCenter();
  });

  center.addEventListener('input', function (event) {
    if (!event.target.matches('.wc-scrubber')) return;
    clearReplay(track.slug);
    replayState(track.slug).beat = Number(event.target.value || 0);
    mountWeekendCenter();
  });

  center.addEventListener('change', function (event) {
    const speed = event.target.closest('[data-speed]');
    if (!speed) return;
    clearReplay(track.slug);
    replayState(track.slug).speed = Number(speed.dataset.speed || 1);
    mountWeekendCenter();
  });
}

function mountWeekendCenter() {
  const slug = currentSlug();
  const track = mapState()[slug];
  const meta = document.querySelector('.meta');
  if (!track || !track.report || !meta) return;
  const existing = document.getElementById(CENTER_ID);
  if (existing) existing.remove();
  meta.insertAdjacentHTML('afterend', renderWeekendCenter(track));
  bindWeekendCenter(track);
  if (desiredWeekendMode(track) === 'live') hydrateWeekendLiveMode(track);
}

function renderWeekendSurfaces() {
  injectWeekendSurfaceStyle();
  wrapWeekendFooterUpdater();

  if (currentSlug()) {
    mountWeekendCenter();
  } else {
    mountCurrentRoundCard();
  }

  if (typeof applyWeekendSurfacePolish === 'function') applyWeekendSurfacePolish();
}

window.addEventListener('hashchange', function () {
  window.setTimeout(renderWeekendSurfaces, 40);
});

window.addEventListener('load', function () {
  window.setTimeout(renderWeekendSurfaces, 120);
});

const weekendAppRoot = document.getElementById('app');
if (weekendAppRoot && 'MutationObserver' in window) {
  const weekendObserver = new MutationObserver(function () {
    window.setTimeout(renderWeekendSurfaces, 0);
  });
  weekendObserver.observe(weekendAppRoot, { childList: true });
}

window.setTimeout(renderWeekendSurfaces, 180);
