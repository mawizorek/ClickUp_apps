// Shared, mutable session state. No DOM. Modules import this singleton.
export const S = {
  file: null,          // { name }
  headers: [],         // source column names
  rows: [],            // parsed source rows
  fingerprint: null,   // header fingerprint of the current file
  schemas: [],         // loaded target schemas
  profiles: [],        // loaded mapping profiles
  profile: null,       // active working profile (may be unsaved passthrough)
  schema: null,        // active target schema
  matched: false,      // did a saved profile auto-match this file?
  step: 'source',
};

export const $ = (sel, root = document) => root.querySelector(sel);
export const el = (tag, props = {}, kids = []) => {
  const n = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k === 'class') n.className = v;
    else if (k === 'html') n.innerHTML = v;
    else if (k === 'text') n.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
    else if (v != null) n.setAttribute(k, v);
  });
  (Array.isArray(kids) ? kids : [kids]).forEach((c) => c != null && n.append(c.nodeType ? c : document.createTextNode(c)));
  return n;
};
