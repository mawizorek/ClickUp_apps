// Mappings catalog: list saved profiles with New / Edit / Duplicate / Delete.
import { S, el } from './state.js';
import { store } from './api.js';

export function renderCatalog(root, { onEdit, refresh }) {
  root.innerHTML = '';
  if (!S.profiles.length) {
    root.append(el('p', { class: 'muted' }, 'No saved profiles yet. Map a file and hit Save profile.'));
    return;
  }
  S.profiles.forEach((p) => {
    const schema = S.schemas.find((s) => s.schema_id === p.schema_id);
    root.append(el('div', { class: 'prof' }, [
      el('div', {}, [
        el('div', { style: 'font-weight:600' }, p.name),
        el('div', { class: 'muted', style: 'font-size:12px' },
          (schema ? schema.name : 'no target') + (p.locked ? ' \u00b7 \uD83D\uDD12' : '')),
      ]),
      el('div', { class: 'prof-actions' }, [
        el('button', { class: 'op', onclick: () => onEdit(p) }, 'Edit'),
        el('button', { class: 'op', onclick: () => dup(p, refresh) }, 'Duplicate'),
        el('button', { class: 'op', onclick: () => del(p, refresh) }, 'Delete'),
      ]),
    ]));
  });
}

async function dup(p, refresh) {
  const copy = JSON.parse(JSON.stringify(p));
  copy.profile_id = 'p-' + Date.now().toString(36);
  copy.name = p.name + ' (copy)';
  copy.locked = 0;
  copy.header_fingerprint = null;
  await store.saveProfile(copy);
  refresh();
}

async function del(p, refresh) {
  if (p.locked && !confirm(`\u201c${p.name}\u201d is locked (seeded). Delete anyway?`)) return;
  if (!p.locked && !confirm(`Delete \u201c${p.name}\u201d?`)) return;
  await store.deleteProfile(p.profile_id);
  refresh();
}
