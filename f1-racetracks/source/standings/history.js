/* history.js — Season History lens for the Championship Matrix.
 Additive only: adds a "History" segment to the existing lens switcher (nav.xnav, built by
 nav.js) and renders a newest-first, round-by-round FEED into an in-page stage that swaps
 with the matrix. Reads the SAME globals the other modules use (ROUNDS, DRV, cumPoints,
 teamColor) — no data duplicated, nothing else touched. Loaded LAST (after nav.js).

 v10 (2026-07-13): restyled from bordered rows into a social/activity FEED. Dropped the
 banned left `.hx-rail` color stripe for a timeline (centered connector line + team-tinted
 node dot) with full-bordered post cards. Each round is a 'post': GP name + Rxx badge +
 RELATIVE timestamp, podium as the body (P1 gold / P2 silver / P3 bronze), pole/FL/sprint
 meta, and the championship swing as the engagement footer. Logic/data unchanged.

 Each post fuses the RESULT (podium + pole + fastest lap + sprint winner) with the
 resulting CHAMPIONSHIP STATE: who led the WDC and by how much AFTER that round, computed
 live from cumPoints (race + sprint cumulative through that round). Each card links onward
 to the RACE WEEKEND lens (weekend.html#/<slug>).

 DEEP LINK: standings.html#history opens this lens directly (on load + hashchange), and the
 History/Matrix segments drive the hash so the view is shareable and back-button friendly.

 RESILIENCE: data is fetched async by data.js; this lens renders on the 'season-ready'
 event AND keeps a long fallback poll so a slow mobile load never leaves History frozen on
 "Loading the season\u2026".

 SCOPE NOTE: ROUNDS/DRV are top-level `let` in data.js (NOT window props), so we read the
 BARE identifiers via a typeof-guard, never window.ROUNDS. */
(function () {
 const CIRCUITS = 'circuits.html';
 const WEEKEND = 'weekend.html';

 const ln = n => { n = String(n || ''); return n === 'Andrea Kimi Antonelli' ? 'Antonelli' : (n.split(' ').slice(-1)[0] || n); };
 const short = s => String(s || '').replace(' Grand Prix', '');
 const fmtDate = d => { if (!d) return ''; const dt = new Date(d + 'T00:00:00'); return isNaN(dt) ? d : dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); };
 const rel = d => {
 if (!d) return '';
 const t = new Date(d + 'T00:00:00'); if (isNaN(t)) return '';
 const days = Math.floor((Date.now() - t.getTime()) / 86400000);
 if (days <= 0) return 'just now';
 if (days === 1) return '1d ago';
 if (days < 7) return days + 'd ago';
 if (days < 35) return Math.round(days / 7) + 'w ago';
 return Math.round(days / 30) + 'mo ago';
 };
 const esc = s => String(s ?? '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

 // Bare-identifier readers: ROUNDS/DRV are top-level `let` (not on window). typeof-guard
 // avoids a ReferenceError if this ever runs before data.js has declared them.
 const rounds = () => (typeof ROUNDS !== 'undefined' && Array.isArray(ROUNDS)) ? ROUNDS : null;
 const drv = () => (typeof DRV !== 'undefined' && DRV) ? DRV : null;

 /* ---- feed styles (reuses base.css tokens; panel/base untouched). No side-stripe:
 the timeline is a centered connector line + node dot, and posts have full borders. ---- */
 const css = `
#hx-stage{display:flex;flex-direction:column;gap:0}
#hx-stage.hidden{display:none!important}
.hx-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;flex-wrap:wrap;border-bottom:1px solid var(--line);padding-bottom:10px;margin-bottom:4px}
.hx-title{font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:1.02rem;letter-spacing:0.02em}
.hx-sub{font-size:0.64rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--txt-dim);font-weight:600}
.hx-item{display:flex;gap:13px;align-items:stretch}
.hx-railcol{position:relative;width:26px;flex:none;display:flex;justify-content:center}
.hx-railcol::before{content:"";position:absolute;top:0;bottom:0;left:50%;width:2px;transform:translateX(-50%);background:var(--line-soft)}
.hx-item:first-child .hx-railcol::before{top:24px}
.hx-item:last-child .hx-railcol::before{bottom:calc(100% - 24px)}
.hx-node{position:relative;z-index:1;width:12px;height:12px;border-radius:50%;margin-top:18px;background:var(--bg);border:2px solid var(--team,var(--line));box-shadow:0 0 0 3px var(--bg)}
.hx-post{flex:1;min-width:0;border:1px solid var(--line);background:var(--s1);border-radius:10px;padding:13px 15px;margin:8px 0;display:flex;flex-direction:column;gap:10px}
.hx-phead{display:flex;align-items:center;gap:9px;flex-wrap:wrap}
.hx-gp{font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:1rem;letter-spacing:-0.005em}
.hx-badge{font-family:'JetBrains Mono',monospace;font-size:0.56rem;font-weight:700;letter-spacing:0.1em;color:var(--txt-dim);border:1px solid var(--line);border-radius:5px;padding:2px 6px}
.hx-time{margin-left:auto;font-family:'JetBrains Mono',monospace;font-size:0.64rem;color:var(--txt-dim);white-space:nowrap}
.hx-pod{display:flex;gap:16px;flex-wrap:wrap;align-items:center}
.hx-p{display:inline-flex;align-items:center;gap:6px;font-size:0.9rem;font-weight:600;color:var(--txt)}
.hx-p i{font-family:'JetBrains Mono',monospace;font-style:normal;font-weight:800;font-size:0.7rem;width:15px;text-align:center;flex:none}
.hx-p.p1 i{color:var(--gold)}.hx-p.p2 i{color:var(--silver)}.hx-p.p3 i{color:var(--bronze)}
.hx-p .tm{font-size:0.56rem;letter-spacing:0.05em;text-transform:uppercase;color:var(--txt-dim);font-weight:600}
.hx-meta{display:flex;gap:18px;flex-wrap:wrap;font-size:0.72rem;color:var(--txt-mid)}
.hx-meta b{font-family:'Chakra Petch',sans-serif;font-weight:600;font-size:0.54rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--txt-dim);margin-right:6px}
.hx-meta .mono{font-family:'JetBrains Mono',monospace;color:var(--txt)}
.hx-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;border-top:1px solid var(--line-soft);padding-top:9px;flex-wrap:wrap}
.hx-lead{font-size:0.78rem;color:var(--txt-mid)}
.hx-lead b{font-family:'Chakra Petch',sans-serif;color:var(--txt);font-weight:600}
.hx-lead .mg{font-family:'JetBrains Mono',monospace;color:var(--gold);font-weight:800;margin-left:5px}
.hx-weekend{font-family:'JetBrains Mono',monospace;font-size:0.6rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--red);text-decoration:none;font-weight:600;white-space:nowrap;transition:color .15s var(--ease)}
.hx-weekend:hover{color:var(--txt)}
.hx-empty{padding:50px 20px;text-align:center;color:var(--txt-dim);font-size:0.9rem;border:1px solid var(--line);background:var(--s1);border-radius:10px}
.hx-lens.on{background:var(--s3);color:var(--txt);cursor:default}
`;
 const st = document.createElement('style'); st.id = 'hx-css'; st.textContent = css; document.head.appendChild(st);

 /* ---- resulting WDC after ROUNDS index i (ascending order; cumPoints aligns to it) ---- */
 function wdcAfter(i) {
 const D = drv();
 const rows = Object.keys(D).map(id => ({ id, pts: cumPoints(id)[i] }))
 .sort((a, b) => b.pts - a.pts || ln(D[a.id].name).localeCompare(ln(D[b.id].name)));
 const L = rows[0], S = rows[1];
 return { id: L.id, pts: L.pts, margin: S ? L.pts - S.pts : L.pts };
 }

 function card(rd, i) {
 const D = drv();
 const cls = rd.classification || [];
 const at = n => cls.find(r => r.pos === n);
 const w = at(1), p2 = at(2), p3 = at(3);
 const wTeam = w ? (w.team || (D[w.driverId] && D[w.driverId].team) || '') : '';
 const rail = wTeam ? teamColor(wTeam) : 'var(--line)';
 const pole = rd.pole, fl = rd.fastestLap;
 const spr = (rd.sprint && rd.sprint.classification) ? rd.sprint.classification.find(r => r.pos === 1) : null;
 const wdc = wdcAfter(i);

 const pod = [
 w && `<span class="hx-p p1"><i>1</i>${esc(ln(w.driver))}<span class="tm">${esc(wTeam)}</span></span>`,
 p2 && `<span class="hx-p p2"><i>2</i>${esc(ln(p2.driver))}</span>`,
 p3 && `<span class="hx-p p3"><i>3</i>${esc(ln(p3.driver))}</span>`
 ].filter(Boolean).join('');

 const meta = [
 `<span><b>Pole</b>${pole ? `${esc(ln(pole.driver))}${pole.time ? ` <span class="mono">${esc(pole.time)}</span>` : ''}` : '\u2014'}</span>`,
 `<span><b>FL</b>${fl ? `${esc(ln(fl.driver))}${fl.time ? ` <span class="mono">${esc(fl.time)}</span>` : ''}` : '\u2014'}</span>`,
 spr ? `<span><b>Sprint</b>${esc(ln(spr.driver))}</span>` : ''
 ].filter(Boolean).join('');

 const mg = wdc.margin === 0 ? 'level' : `+${wdc.margin}`;
 const when = [rel(rd.date), fmtDate(rd.date)].filter(Boolean).join(' \u00b7 ');
 return `<article class="hx-item">
<div class="hx-railcol"><span class="hx-node" style="--team:${rail}"></span></div>
<div class="hx-post" style="--team:${rail}">
<div class="hx-phead"><span class="hx-gp">${esc(short(rd.name))}</span><span class="hx-badge">R${rd.round}</span><span class="hx-time">${esc(when)}</span></div>
<div class="hx-pod">${pod}</div>
${meta ? `<div class="hx-meta">${meta}</div>` : ''}
<div class="hx-foot"><span class="hx-lead"><b>${esc(ln(D[wdc.id].name))}</b> leads<span class="mg">${mg}</span></span>${rd.slug ? `<a class="hx-weekend" href="${WEEKEND}#/${rd.slug}">Race weekend \u2192</a>` : ''}</div>
</div>
</article>`;
 }

 let tries = 0;
 function renderHistory() {
 const hs = document.getElementById('hx-stage'); if (!hs) return;
 const R = rounds(), D = drv();
 if (!R || !R.length || !D || !Object.keys(D).length) {
 hs.innerHTML = '<div class="hx-empty">Loading the season\u2026</div>';
 if (tries++ < 200) setTimeout(renderHistory, 150);
 return;
 }
 tries = 0;
 // ROUNDS is ascending; keep the original index for cumPoints, display newest-first.
 const cards = R.map((rd, i) => ({ rd, i }))
 .sort((a, b) => b.rd.round - a.rd.round)
 .map(o => card(o.rd, o.i)).join('');
 hs.innerHTML = `<div class="hx-head"><span class="hx-title">Season History</span><span class="hx-sub">${R.length} rounds \u00b7 newest first</span></div>${cards}`;
 }

 /* ---- fold into the existing lens switcher ---- */
 const xseg = document.querySelector('.xnav .xseg');
 if (!xseg) return; // nav.js absent — nothing to fold into

 const stage = document.getElementById('stage');
 const controls = document.querySelector('.controls');
 const hs = document.createElement('section'); hs.id = 'hx-stage'; hs.className = 'hidden';
 if (stage && stage.parentNode) stage.parentNode.insertBefore(hs, stage.nextSibling);

 const weekendLink = xseg.querySelector('a[href*="weekend"]');
 const circuitsLink = xseg.querySelector('a[href*="circuits"]');
 const standingsEl = [...xseg.children].find(c => c !== circuitsLink && c !== weekendLink) || null;

 const hb = document.createElement('button');
 hb.type = 'button'; hb.className = 'hx-lens'; hb.textContent = 'History';
 const anchorRef = weekendLink || circuitsLink;
 if (anchorRef) xseg.insertBefore(hb, anchorRef); else xseg.appendChild(hb);

 function showHistory() {
 if (typeof closePanel === 'function') closePanel();
 controls && controls.classList.add('hidden');
 stage && stage.classList.add('hidden');
 hs.classList.remove('hidden');
 hb.classList.add('on');
 standingsEl && standingsEl.classList.remove('on');
 tries = 0; // fresh polling budget each time History opens
 renderHistory();
 }
 function showStandings() {
 hs.classList.add('hidden');
 controls && controls.classList.remove('hidden');
 stage && stage.classList.remove('hidden');
 hb.classList.remove('on');
 standingsEl && standingsEl.classList.add('on');
 }

 // Hash drives the view so History is shareable / back-button friendly and the
 // circuit guide can deep-link in via standings.html#history.
 hb.addEventListener('click', e => { e.preventDefault(); if (location.hash !== '#history') { location.hash = 'history'; } else { showHistory(); } });
 if (standingsEl) standingsEl.addEventListener('click', e => { e.preventDefault(); if (location.hash === '#history') { history.replaceState(null, '', location.pathname + location.search); } showStandings(); });
 window.addEventListener('hashchange', () => { if (location.hash === '#history') showHistory(); else showStandings(); });
 // Self-heal: when data.js finishes loading the season it fires 'season-ready'. If History
 // is the active lens, render immediately — this is what stops the mobile "Loading\u2026" freeze.
 window.addEventListener('season-ready', () => { if (!hs.classList.contains('hidden')) { tries = 0; renderHistory(); } });
 if (location.hash === '#history') showHistory();
})();
