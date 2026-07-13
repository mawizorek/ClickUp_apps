// Core: boot, load store, route the 3 steps, wire chrome (drawers, theme, footer stamp).
import { S, $, el } from './state.js';
import { store, cfg } from './api.js';
import { renderSource } from './ui-source.js';
import { renderMap } from './ui-map.js';
import { renderOutput } from './ui-output.js';
import { renderCatalog } from './ui-catalog.js';

const APP_VERSION = 'v1';
const PR = '192';
const stage = $('#stage');

function setStep(step) {
  S.step = step;
  document.querySelectorAll('.step').forEach((b) => {
    b.classList.toggle('is-active', b.dataset.step === step);
  });
  render();
}

function enableSteps() {
  const has = !!S.file;
  document.querySelectorAll('.step').forEach((b) => {
    if (b.dataset.step !== 'source') b.disabled = !has;
  });
}

async function saveProfileAndRefresh(p) {
  await store.saveProfile(p);
  S.profiles = await store.profiles();
  flash('Saved \u201c' + p.name + '\u201d');
}

function render() {
  enableSteps();
  if (S.step === 'source') renderSource(stage, setStep);
  else if (S.step === 'map') renderMap(stage, setStep, saveProfileAndRefresh);
  else renderOutput(stage);
}

// ---- chrome ----
function openDrawer(id) {
  $('#backdrop').hidden = false;
  const d = document.getElementById(id); d.hidden = false;
  if (id === 'drawerSettings') $('#btnSettings').setAttribute('aria-expanded', 'true');
  if (id === 'drawerCatalog') renderCatalog($('#catalogBody'), {
    onEdit: (p) => {
      S.profile = JSON.parse(JSON.stringify(p));
      S.schema = S.schemas.find((s) => s.schema_id === p.schema_id) || S.schema;
      closeDrawers();
      if (S.file) setStep('map'); else flash('Drop a file to apply this profile.');
    },
    refresh: async () => { S.profiles = await store.profiles(); openDrawer('drawerCatalog'); },
  });
}
function closeDrawers() {
  $('#backdrop').hidden = true;
  document.querySelectorAll('.drawer').forEach((d) => (d.hidden = true));
  $('#btnSettings').setAttribute('aria-expanded', 'false');
}

function flash(msg) {
  const t = el('div', { class: 'banner match', style: 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:30' }, msg);
  document.body.append(t); setTimeout(() => t.remove(), 1500);
}

function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  cfg.setTheme(t);
}

function wireChrome() {
  $('#btnSettings').addEventListener('click', () => openDrawer('drawerSettings'));
  $('#btnCatalog').addEventListener('click', () => openDrawer('drawerCatalog'));
  $('#backdrop').addEventListener('click', closeDrawers);
  document.querySelectorAll('[data-close-drawer]').forEach((b) => b.addEventListener('click', closeDrawers));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawers(); });
  document.querySelectorAll('.step').forEach((b) =>
    b.addEventListener('click', () => { if (!b.disabled) setStep(b.dataset.step); }));

  $('#themeToggle').addEventListener('click', () =>
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

  const wu = $('#workerUrl'); wu.value = cfg.workerUrl();
  wu.addEventListener('change', async () => { cfg.setWorker(wu.value.trim()); await reloadStore(); flash('Data source updated'); });
  const wk = $('#writeKey'); wk.value = cfg.writeKey();
  wk.addEventListener('change', () => cfg.setKey(wk.value));

  $('#stamp').textContent = `Report Normalizer ${APP_VERSION} \u00b7 PR #${PR}`;
}

async function reloadStore() {
  try {
    S.schemas = await store.schemas();
    S.profiles = await store.profiles();
  } catch (e) {
    flash('Could not reach the Worker \u2014 running local-only.');
    cfg.setWorker('');
    S.schemas = await store.schemas();
    S.profiles = await store.profiles();
  }
}

async function boot() {
  applyTheme(cfg.theme());
  wireChrome();
  await reloadStore();
  setStep('source');
}

boot();
