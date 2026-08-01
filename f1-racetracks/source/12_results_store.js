/* 12_results_store.js — canonical results loader for the circuit guide.
   SINGLE SOURCE OF TRUTH for RESULTS = f1-results/2026/ (index_rounds.json + per-round files).
   Builds the raceResults map the track view renders (podium / pole / fastest lap) by
   DERIVING from the round classification at runtime, so nothing is stored twice.
   Replaces the old (dead, undefined) inline raceResults + the retired data.json.

   ⚠️ CHANGED 2026-08-01: this module no longer READS `current_round_slug` /
   `last_completed_round_slug` off the manifest — those fields are gone, because they were
   hand-maintained and drifted (one of them pointed at a completed round for a week). They are
   now DERIVED from the weekend vector by source/08_season.js and hung on `appDataMeta` here,
   under the exact same key names. Every downstream consumer is unchanged.

   Loaded after 08 and before the app bootstrap so the globals exist before the first render;
   re-renders once the store lands. Fails soft in both directions: if the results store is
   unreachable the circuit guide still renders track breakdowns without result panels, and if
   the season layer is unreachable the results still load without the round pointers. */
window.raceResults = window.raceResults || {};
window.historicWinners = window.historicWinners || {};
window.appDataMeta = window.appDataMeta || {};
(function(){
  var BASE = 'f1-results/2026/';

  /* Round pointers: derived upstream, mirrored here for consumers that already read them. */
  var season = (window.F1Season && window.F1Season.ready) || null;
  if (season) {
    season.then(function(cal){
      if (!cal) return;
      window.appDataMeta.current_round_slug = cal.current_round_slug || null;
      window.appDataMeta.last_completed_round_slug = cal.last_completed_round_slug || null;
    }).catch(function(){ /* season layer unreachable: pointers stay null, results still load */ });
  }

  fetch(BASE + 'index_rounds.json', { cache: 'no-cache' })
    .then(function(r){ if(!r.ok) throw 0; return r.json(); })
    .then(function(idx){
      var rounds = (idx.rounds || []);
      return Promise.all(rounds.map(function(rd){
        return fetch(BASE + rd.file.replace('./',''), { cache: 'no-cache' })
          .then(function(r){ return r.ok ? r.json() : null; })
          .catch(function(){ return null; })
          .then(function(data){ return { rd: rd, data: data }; });
      }));
    })
    .then(function(list){
      list.forEach(function(entry){
        var rd = entry.rd, data = entry.data;
        if(!data || !data.classification) return;
        var fin = data.classification.filter(function(x){ return x.status==='FIN' && x.pos; });
        var byPos = function(p){ return fin.find(function(x){ return x.pos===p; }); };
        var p1 = byPos(1), p2 = byPos(2), p3 = byPos(3);
        if(!p1) return;
        var pole = data.pole ? {
          driver: data.pole.driver, team: data.pole.team,
          time: data.pole.time || 'TBC', gapToP2: data.pole.gapToP2 || ''
        } : null;
        // Only surface a fastest-lap line when a time was actually recorded, so a
        // driver-only FL (e.g. Catalunya) never renders as "· undefined".
        var fl = (data.fastestLap && data.fastestLap.time) ? {
          driver: data.fastestLap.driver, time: data.fastestLap.time, lap: data.fastestLap.lap
        } : null;
        window.raceResults[rd.slug] = {
          winner: p1.driver, team: p1.team,
          p2: p2 ? p2.driver : '', p2Team: p2 ? p2.team : '',
          p3: p3 ? p3.driver : '', p3Team: p3 ? p3.team : '',
          summary: data.summary || '',
          pole: pole,
          fastestLap: fl
        };
      });
      if(typeof router === 'function') router();
    })
    .catch(function(){ /* store unreachable: track guides still render, result panels omitted */ });
})();
