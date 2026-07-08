/* app-dashboard — data module. APP_META + SAMPLE (ClickUp window) and FM_META + FM_SAMPLE (FileMaker window).
 Optional per-entry `label` overrides the auto-titlecased folder name (for acronyms/casing the
 titlecaser can't infer). Optional `mono` overrides the derived monogram.
 Optional `status:'retired'` (+ optional `supersededBy:'<slug>'`) marks an app retired. This is a
 first-class field: app.js reads it into each app object, render.js emits data-status + a Retired
 badge, and the "Show retired" toggle (app.js) hides retired rows by default. No runtime DOM graft. */

// ClickUp window: slug -> metadata. Categories: 'dashboard' | 'tool'. status: 'live' (default) | 'retired'.
const APP_META = {
 'world-cup-bracket': { desc: 'Live tournament bracket with match results and progression.', category: 'dashboard', badges: ['dashboard'] },
 'f1-racetracks': { label: 'F1 Racetracks', desc: 'Interactive race circuit explorer with live circuit data, layouts, and session timing.', category: 'dashboard', badges: ['data'] },
 'on-track': { desc: 'Live motorsport "what\'s on now" schedule across series, with a settings drawer and collapsible filters.', category: 'dashboard', badges: ['data'] },
 'routines': { desc: 'Live schedule view of the automated repo refresh routines. Reads schedule.md, zero upkeep.', category: 'dashboard', badges: ['dashboard'] },
 'prism': { desc: 'Data App Viewer. Drop JSON or Markdown; JSON becomes a readable table with CSV/Excel export.', category: 'tool', badges: ['tool'] },
 'file-chunker': { desc: 'Split large files into AI-readable chunks with verification headers and a markdown index.', category: 'tool', badges: ['tool'] },
 'budget-code-mapper': { desc: 'Budget code authority lookup and export tool.', category: 'tool', badges: ['data'] },
 'markdown-viewer': { desc: 'Mobile-first markdown reader. Superseded by Prism (reads Markdown + JSON).', category: 'tool', badges: ['tool'], status: 'retired', supersededBy: 'prism' },
 'pdf-splitter': { label: 'PDF Splitter', desc: 'Extract and split PDF pages entirely client-side.', category: 'tool', badges: ['tool'] },
 'polish-demo': { desc: 'Gated working example of the full app polish standard.', category: 'tool', badges: ['tool'] },
 'quickfire': { desc: 'Quick vibe-to-repo artifact sketches.', category: 'tool', badges: ['tool'] }
};

// ClickUp offline sample: only used when the GitHub API is unreachable (e.g. the ClickUp preview sandbox).
const SAMPLE = [
 { name:'prism', hoursAgo:0.2, commitCount:8, commits:[['v1 initial build (JSON + Markdown lenses)',0.2],['json lens: flatten + flags + CSV/Excel export',1],['markdown lens folded in from markdown-viewer',2]] },
 { name:'on-track', hoursAgo:0.1, commitCount:12, commits:[['settings drawer + collapsible filters',0.1],['per-dropdown select-all / clear',6],['timezone toggle in settings',14],['live refresh note',26],['initial schedule engine',40]] },
 { name:'f1-racetracks', hoursAgo:0.4, commitCount:37, commits:[['unify cache-bust build stamp across all source loads',0.4],['footer wrap fix at 320px',9],['data.json retrofit (v5)',30],['live-tracker companion',52],['v4 circuit explorer',96]] },
 { name:'world-cup-bracket', hoursAgo:20, commitCount:14, commits:[['bump contrast + live updated badge (v1.3)',20],['today filter dynamic',28],['icon.png + manifest',44],['fix Switzerland vs Algeria date',50],['v1 bracket',120]] },
 { name:'routines', hoursAgo:1, commitCount:8, commits:[['add passive live schedule viewer',1],['world-cup refresh runbook',40],['schedule ledger',60]] },
 { name:'markdown-viewer', hoursAgo:52, commitCount:9, commits:[['v3 mobile-first reader',52],['drop-zone done-state',70],['v2 parser fix',110]] },
 { name:'budget-code-mapper', hoursAgo:96, commitCount:22, commits:[['retrofit data.json split (v6)',96],['export wrapper (three-context)',130],['v5 authority builder',180]] },
 { name:'file-chunker', hoursAgo:150, commitCount:41, commits:[['v16.2 source_index rename',150],['INDEX_FILENAME const',175],['zip README metadata',210]] },
 { name:'pdf-splitter', hoursAgo:200, commitCount:6, commits:[['scaffold client-side page extract',200],['README',215]] },
 { name:'polish-demo', hoursAgo:220, commitCount:4, commits:[['gated example of polish standard',220],['access gate config',235]] },
 { name:'quickfire', hoursAgo:240, commitCount:3, commits:[['index + first sketch',240]] }
];

// FileMaker window: folder under filemaker/ -> metadata. No Pages hosting, no health check.
const FM_META = {
 '_template-fmp-app': { label: 'FMP App Template', mono: 'FM', desc: 'FileMaker app scaffold: schema JSON shape, the standard doc set, and the build workflow for new FMP solutions.' },
 'hml-llc': { label: 'HML LLC', desc: 'HML_LLC pilot FileMaker solution — schema JSON plus the 11-doc build set.' }
};

// FileMaker offline sample.
const FM_SAMPLE = [
 { name:'hml-llc', hoursAgo:5, commitCount:11, commits:[['schema JSON + 11 build docs',5],['pilot scaffold',30]] },
 { name:'_template-fmp-app', hoursAgo:30, commitCount:6, commits:[['fmp app template',30],['standard doc set',48]] }
];
