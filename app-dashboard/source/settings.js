/* app-dashboard — settings drawer + theme toggle. Self-contained (DOM + localStorage only).
   Loaded before app.js. Pre-paint theme is applied by the inline loader script; this file syncs
   the toggle state and wires the gear. Standard: click-outside + Esc close, aria-expanded on gear. */

const THEME_KEY = 'appDashboard_theme';

function currentTheme(){ return document.documentElement.getAttribute('data-theme')==='light' ? 'light' : 'dark'; }

function applyTheme(t){
  if(t==='light') document.documentElement.setAttribute('data-theme','light');
  else document.documentElement.removeAttribute('data-theme');
  try{ localStorage.setItem(THEME_KEY, t); }catch(e){}
  document.querySelectorAll('.th-seg').forEach(function(s){
    const on = s.dataset.themeChoice===t;
    s.classList.toggle('on', on);
    s.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.setAttribute('content', t==='light' ? '#f7f8fa' : '#141518');
}

// sync the toggle to whatever the pre-paint script already applied
applyTheme(currentTheme());

const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');

function openSettings(){ settingsPanel.classList.add('show'); settingsPanel.setAttribute('aria-hidden','false'); settingsBtn.setAttribute('aria-expanded','true'); }
function closeSettings(){ settingsPanel.classList.remove('show'); settingsPanel.setAttribute('aria-hidden','true'); settingsBtn.setAttribute('aria-expanded','false'); }

settingsBtn.addEventListener('click', function(e){
  e.stopPropagation();
  if(settingsPanel.classList.contains('show')) closeSettings(); else openSettings();
});
document.getElementById('themeToggle').addEventListener('click', function(e){
  const seg = e.target.closest('.th-seg'); if(!seg) return;
  applyTheme(seg.dataset.themeChoice);
});
document.addEventListener('click', function(e){
  if(settingsPanel.classList.contains('show') && !settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) closeSettings();
});
document.addEventListener('keydown', function(e){ if(e.key==='Escape' && settingsPanel.classList.contains('show')) closeSettings(); });
