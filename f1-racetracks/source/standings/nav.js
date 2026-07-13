/* nav.js — cross-lens navigation for the standings surface. Additive only: injects a
   masthead switcher (Matrix · History · Weekend · Circuits) with a "jump to round" menu that
   deep-links each round to its circuit page, and drops race-weekend + circuit-guide connectors
   into the race brief. Loaded LAST so its click handler runs after panel.js has rendered the
   panel. Touches no other module. Race pages are transitory drill-throughs; standings is home.
   (The History segment is injected by history.js, which loads after this one.) */
(function(){
  const CIRCUITS='circuits.html';
  const WEEKEND='weekend.html';
  const roundBy=rn=>(window.ROUNDS||[]).find(r=>String(r.round)===String(rn))||null;
  const shortName=s=>(s||'').replace(' Grand Prix','');

  const css=`
.xnav{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px}
.xseg{display:inline-flex;border:1px solid var(--line);background:var(--s1)}
.xseg>*{font-family:'Chakra Petch',sans-serif;font-size:0.72rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--txt-mid);background:transparent;border:0;cursor:pointer;padding:8px 15px;text-decoration:none;display:inline-flex;align-items:center;gap:7px;transition:color .15s var(--ease),background .15s var(--ease)}
.xseg>*+*{border-left:1px solid var(--line)}
.xseg .on{background:var(--s3);color:var(--txt);cursor:default}
.xseg a:hover:not(.on),.xseg button:hover{color:var(--txt)}
.xseg .ar{color:var(--txt-dim);font-size:0.78rem}
.xdrop{position:relative}
.xmenu{position:absolute;top:calc(100% + 4px);left:0;z-index:40;min-width:214px;max-height:62vh;overflow-y:auto;background:var(--s1);border:1px solid var(--line);box-shadow:0 18px 44px oklch(0.08 0.01 255 / 0.55);display:none}
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
`;
  const st=document.createElement('style');st.id='nav-css';st.textContent=css;document.head.appendChild(st);

  const nav=document.createElement('nav');nav.className='xnav';nav.setAttribute('aria-label','Lens switcher');
  nav.innerHTML='<div class="xseg"><span class="on" aria-current="page">Matrix</span><a href="'+WEEKEND+'">Weekend</a><a href="'+CIRCUITS+'">Circuits</a></div>'+
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
