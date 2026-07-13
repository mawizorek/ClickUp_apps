/* history.js — Season History lens for the Championship Matrix.
 Additive only: adds a "History" segment to the existing lens switcher (nav.xnav,
 built by nav.js) and renders a newest-first, round-by-round feed into an in-page
 stage that swaps with the matrix. Reads the SAME globals the other modules use
 (ROUNDS, DRV, cumPoints, teamColor) — no data duplicated, nothing else touched.
 Loaded LAST (after nav.js) so the switcher exists when this runs.

 Each round card fuses the RESULT (podium + pole + fastest lap + sprint winner)
 with the resulting CHAMPIONSHIP STATE: who led the WDC and by how much AFTER that
 round, computed live from cumPoints (race + sprint cumulative through that round).

 DEEP LINK: standings.html#history opens this lens directly (on load + hashchange),
 and the History/Matrix segments drive the hash so the view is shareable and
 back-button friendly. The circuit guide's switcher links here via that hash.

 RESILIENCE: data is fetched asynchronously by data.js (index + every round file).
 This lens renders as soon as that lands — it listens for the 'season-ready' event
 AND keeps a long fallback poll — so a slow mobile load never leaves History frozen
 on "Loading the season…".

 SCOPE NOTE: ROUNDS/DRV are top-level `let` in data.js. Top-level let/const are NOT
 window properties, so we read the BARE identifiers (shared classic-script scope),
 never window.ROUNDS — that was undefined and kept History permanently "loading". */
(function () {
 const CIRCUITS = 'circuits.html';

 const ln = n => { n = String(n || ''); return n === 'Andrea Kimi Antonelli' ? 'Antonelli' : (n.split(' ').slice(-1)[0] || n); };
 const short = s => String(s || '').replace(' Grand Prix', '');
 const fmtDate = d => { if (!d) return ''; const dt = new Date(d + 'T00:00:00'); return isNaN(dt) ? d : dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); };
 const esc = s => String(s ?? '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

 // Bare-identifier readers: ROUNDS/DRV are top-level `let` (not on window). typeof-guard
 // avoids a ReferenceError if this ever runs before data.js has declared them.
 const rounds = () => (typeof ROUNDS !== 'undefined' && Array.isArray(ROUNDS)) ? ROUNDS : null;
 const drv = () => (typeof DRV !== 'undefined' && DRV) ? DRV : null;

 /* ---- self-contained styles (reuses base.css tokens; panel/base untouched) ---- */
 const css = `
#hx-stage{display:flex;flex-direction:column;gap:12px}
#hx-stage.hidden{display:none!important}
.hx-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;flex-wrap:wrap;border-bottom:1px solid var(--line);padding-bottom:10px}
.hx-title{font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:1.02rem;letter-spacing:0.02em}
.hx-sub{font-size:0.64rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--txt-dim);font-weight:600}
.hx-card{display:flex;border:1px solid var(--line);background:var(--s1)}
.hx-rail{width:4px;flex:none;background:var(--team,var(--line))}
.hx-body{flex:1;min-width:0;padding:12px 15px;display:flex;flex-direction:column;gap:9px}
.hx-top{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
.hx-rn{font-family:'JetBrains Mono',monospace;font-size:0.6rem;font-weight:700;color:var(--txt-dim);letter-spacing:0.1em}
.hx-gp{font-family:'Chakra Petch',sans-serif;font-weight:600;font-size:0.96rem;letter-spacing:0.02em}
.hx-date{font-family:'JetBrains Mono',monospace;font-size:0.62rem;color:var(--txt-dim)}
.hx-circuit{margin-left:auto;font-family:'Chakra Petch',sans-serif;font-weight:600;font-size:0.6rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--red);text-decoration:none;white-space:nowrap;transition:color .15s var(--ease)}
.hx-circuit:hover{color:var(--txt)}
.hx-pod{display:flex;gap:16px;flex-wrap:wrap;align-items:center}
.hx-p{display:inline-flex;align-items:center;gap:6px;font-size:0.84rem;font-weight:600;color:var(--txt)}
.hx-p i{font-family:'JetBrains Mono',monospace;font-style:normal;font-weight:800;font-size:0.68rem;width:15px;text-align:center;flex:none}
.hx-p.p1 i{color:var(--gold)}.hx-p.p2 i{color:var(--silver)}.hx-p.p3 i{color:var(--bronze)}
.hx-p .tm{font-size:0.56rem;letter-spacing:0.05em;text-transform:uppercase;color:var(--txt-dim);font-weight:600}
.hx-meta{display:flex;gap:18px;flex-wrap:wrap;font-size:0.72rem;color:var(--txt-mid)}
.hx-meta b{font-family:'Chakra Petch',sans-serif;font-weight:600;font-size:0.54rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--txt-dim);margin-right:6px}
.hx-meta .mono{font-family:'JetBrains Mono',monospace;color:var(--txt)}
.hx-wdc{display:flex;align-items:center;justify-content:space-between;gap:10px;border-top:1px solid var(--line-soft);padding-top:8px}
.hx-wdc-k{font-size:0.54rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--txt-dim);font-weight:600}
.hx-wdc-v{font-family:'Chakra Petch',sans-serif;font-weight:600;font-size:0.84rem;color:var(--txt)}
.hx-wdc-v .mg{font-family:'JetBrains Mono',monospace;color:var(--gold);font-weight:800;margin-left:7px}
.hx-empty{padding:50px 20px;text-align:center;color:var(--txt-dim);font-size:0.9rem;border:1px solid var(--line);background:var(--s1)}
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
 return `<article class="hx-card" style="--team:${rail}">
<div class="hx-rail"></div>
<div class="hx-body">
<div class="hx-top"><span class="hx-rn">R${rd.round}</span><span class="hx-gp">${esc(short(rd.name))}</span><span class="hx-date">${esc(fmtDate(rd.date))}</span>${rd.slug ? `<a class="hx-circuit" href="${CIRCUITS}#/${rd.slug}">Circuit \u2192</a>` : ''}</div>
<div class="hx-pod">${pod}</div>
${meta ? `<div class="hx-meta">${meta}</div>` : ''}
<div class="hx-wdc"><span class="hx-wdc-k">Championship after R${rd.round}</span><span class="hx-wdc-v">${esc(ln(D[wdc.id].name))} leads<span class="mg">${mg}</span></span></div>
</div>
</article>`;
 }

 let tries = 0;
 function renderHistory() {
 const hs = document.getElementById('hx-stage'); if (!hs) return;
 const R = rounds(), D = drv();
 if (!R || !R.length || !D || !Object.keys(D).length) {
 hs.innerHTML = '<div class="hx-empty">Loading the season\u2026</div>';
 // Fallback poll only. The real trigger is the 'season-ready' event (listener below);
 // this just covers the case where the event was missed. ~30s cap so a slow mobile
 // load has room to finish instead of freezing forever.
 if (tries++ < 200) setTimeout(renderHistory, 150);
 return;
 }
 tries = 0;
 // ROUNDS is ascending; keep the original index for cumPoints, display newest-first.
 const cards = R.map((rd, i) => ({ rd, i }))
 .sort((a, b) => b.rd.round - a.rd.round)
 .map(o => card(o.rd, o.i)).join('');
 hs.innerHTML = `<div class="hx-head"><span class="hx-title">Season History</span><span class="hx-sub">${R.length} rounds \u00b7 round by round</span></div>${cards}`;
 }

 /* ---- fold into the existing lens switcher ---- */
 const xseg = document.querySelector('.xnav .xseg');
 if (!xseg) return; // nav.js absent — nothing to fold into

 const stage = document.getElementById('stage');
 const controls = document.querySelector('.controls');
 const hs = document.createElement('section'); hs.id = 'hx-stage'; hs.className = 'hidden';
 if (stage && stage.parentNode) stage.parentNode.insertBefore(hs, stage.nextSibling);

 const circuitsLink = xseg.querySelector('a[href*="circuits"]');
 const standingsEl = [...xseg.children].find(c => c !== circuitsLink) || null;

 const hb = document.createElement('button');
 hb.type = 'button'; hb.className = 'hx-lens'; hb.textContent = 'History';
 if (circuitsLink) xseg.insertBefore(hb, circuitsLink); else xseg.appendChild(hb);

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
 // is the active lens, render immediately — this is what stops the mobile "Loading…" freeze.
 window.addEventListener('season-ready', () => { if (!hs.classList.contains('hidden')) { tries = 0; renderHistory(); } });
 if (location.hash === '#history') showHistory();
})();
