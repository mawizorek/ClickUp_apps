/* nav.js — cross-lens navigation for the standings surface. Additive only: injects a
   masthead APPBAR (shared F1 brand lockup + Matrix · History · Circuits switcher) with a
   "jump to round" menu that deep-links each round to its RACE WEEKEND page, and drops
   race-weekend + circuit-guide connectors into the race brief. Loaded LAST so its click
   handler runs after panel.js has rendered the panel. Touches no other module.
   Race pages are transitory drill-throughs; standings is home.
   (The History segment is injected by history.js, which loads after this one and selects
   '.xnav .xseg' — preserved here.)

   BRAND: the red track-mark lockup is identical across all three lenses (standings /
   weekend / circuits) so the app reads as ONE product. NAV MODEL: Weekend is a per-round
   DRILL-THROUGH, not a peer tab — switcher is Matrix / History / Circuits. */
(function(){
  const CIRCUITS='circuits.html';
  const WEEKEND='weekend.html';
  const roundBy=rn=>(window.ROUNDS||[]).find(r=>String(r.round)===String(rn))||null;
  const shortName=s=>(s||'').replace(' Grand Prix','');
  const MARK='<span class="mk"><svg viewBox="0 0 24 24" fill="none"><path d="M3 17c4-1 6-9 10-9 3 0 4 3 8 2" stroke="white" stroke-width="2.4" stroke-linecap="round"></path><circle cx="6" cy="16.5" r="1.7" fill="white"></circle></svg></span>';

  const css=`
.xnav{display:flex;flex-direction:column;gap:12px;margin-bottom:16px}
.appbar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.brand{display:flex;align-items:center;gap:9px;background:none;border:0;cursor:pointer;padding:0;color:inherit}
.brand .mk{width:30px;height:30px;border-radius:8px;background:var(--red);display:grid;place-items:center;box-shadow:0 0 22px oklch(0.64 0.21 26 / 0.4);flex:none}
.brand .mk svg{width:19px;height:19px}
.brand .t{font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:0.94rem;line-height:1;text-align:left}
.brand .t small{display:block;font-family:'JetBrains Mono',monospace;font-weight:500;font-size:0.54rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--txt-dim);margin-top:4px}
.xseg{display:inline-flex;border:1px solid var(--line);background:var(--s1)}
.xseg>*{font-family:'JetBrains Mono',monospace;font-size:0.66rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--txt-mid);background:transparent;border:0;cursor:pointer;padding:8px 13px;text-decoration:none;display:inline-flex;align-items:center;gap:7px;transition:color .15s var(--ease),background .15s var(--ease)}
.xseg>*+*{border-left:1px solid var(--line)}
.xseg .on{background:var(--s3);color:var(--txt);cursor:default}
.xseg a:hover:not(.on),.xseg button:hover{color:var(--txt)}
.xseg .ar{color:var(--txt-dim);font-size:0.78rem}
.xdrop{position:relative;align-self:flex-start}
.xmenu{position:absolute;top:calc(100% + 4px);left:0;z-index:40;min-width:214px;max-height:62vh;overflow-y:auto;background:var(--s1);border:1px solid var(--line);box-shadow:0 18px 44px oklch(0.08 0.01 268 / 0.55);display:none}
.xmenu.open{display:block}
.xmenu a{display:flex;align-items:center;gap:11px;padding:9px 13px;text-decoration:none;color:var(--txt-mid);border-bottom:1px solid var(--line-soft);transition:background .12s var(--ease),color .12s var(--ease)}
.xmenu a:last-child{border-bottom:0}
.xmenu a:hover{background:var(--s3);color:var(--txt)}
.xmenu .rn{font-family:'JetBrains Mono',monospace;font-size:0.66rem;color:var(--txt-dim);min-width:26px}
.xmenu .rc{font-family:'Chakra Petch',sans-serif;font-weight:600;font-size:0.8rem;letter-spacing:0.03em}
.circuit-link{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:8px;padding:12px 14px;border:1px solid var(--line);background:var(--s1);text-decoration:none;transition:background .15s var(--ease)}
.circuit-link:hover{background:var(--s3)}
.circuit-link .cl-l{display:flex;flex-direction:column}
.circuit-link .cl-k{font-size:0.54rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--txt-dim);font-weight:600;margin-bottom:3px}
.circuit-link .cl-v{font-family:'Chakra Petch',sans-serif;font-weight:600;font-size:0.92rem;color:var(--txt)}
.circuit-link .cl-ar{font-family:'JetBrains Mono',monospace;font-size:1.05rem;color:var(--red)}
@media(max-width:560px){.xseg>*{padding:8px 11px;font-size:0.6rem;letter-spacing:0.06em}}
`;
  const st=document.createElement('style');st.id='nav-css';st.textContent=css;document.head.appendChild(st);

  const nav=document.createElement('nav');nav.className='xnav';nav.setAttribute('aria-label','Lens switcher');
  nav.innerHTML='<div class="appbar">'+
    '<button class="brand" onclick="location.href=\''+'standings.html'+'\'" aria-label="F1 2026 home">'+MARK+'<span class="t">F1 2026<small>Championship</small></span></button>'+
    '<div class="xseg"><span class="on" aria-current="page">Matrix</span><a href="'+CIRCUITS+'">Circuits</a></div>'+
    '</div>'+
    '<div class="xdrop"><div class="xseg"><button type="button" id="xRoundsBtn" aria-haspopup="true" aria-expanded="false">Jump to round <span class="ar">&#9662;</span></button></div><div class="xmenu" id="xRoundsMenu" role="menu"></div></div>';
  document.body.insertBefore(nav,document.body.firstChild);

  const btn=nav.querySelector('#xRoundsBtn'),menu=nav.querySelector('#xRoundsMenu');
  function fill(){
    const rs=[...(window.ROUNDS||[])].sort((a,b)=>b.round-a.round);
    menu.innerHTML=rs.length?rs.map(rd=>'<a role="menuitem" href="'+WEEKEND+'#/'+rd.slug+'"><span class="rn">R'+rd.round+'</span><span class="rc">'+shortName(rd.name)+'</span></a>').join(''):'<a href="'+WEEKEND+'"><span class="rc">Open weekends &#8594;</span></a>';
  }
  btn.addEventListener('click',e=>{e.stopPropagation();const open=menu.classList.toggle('open');btn.setAttribute('aria-expanded',open);if(open)fill();});
  document.addEventListener('click',e=>{if(!nav.contains(e.target)){menu.classList.remove('open');btn.setAttribute('aria-expanded','false');}});

  // race brief -> race-weekend + circuit-guide connectors (runs after panel.js has set the panel HTML)
  document.addEventListener('click',e=>{
    const cell=e.target.closest('[data-cell]');if(!cell)return;
    const rd=roundBy(cell.dataset.cell.split(':')[0]);if(!rd||!rd.slug)return;
    const body=document.querySelector('#panel .panel-body');if(!body||body.querySelector('.circuit-link'))return;
    const wk=document.createElement('a');wk.className='circuit-link';wk.href=WEEKEND+'#/'+rd.slug;
    wk.innerHTML='<span class="cl-l"><span class="cl-k">Race weekend</span><span class="cl-v">'+shortName(rd.name)+'</span></span><span class="cl-ar">&#8594;</span>';
    body.appendChild(wk);
    const a=document.createElement('a');a.className='circuit-link';a.href=CIRCUITS+'#/'+rd.slug;
    a.innerHTML='<span class="cl-l"><span class="cl-k">Circuit guide</span><span class="cl-v">'+shortName(rd.name)+'</span></span><span class="cl-ar">&#8594;</span>';
    body.appendChild(a);
  });
})();
