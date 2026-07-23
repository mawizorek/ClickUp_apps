/* Brain Config Index — static data tables.
   Loaded as a classic script before app.js; these become globals it reads.
   PROSE_HOOKS + TRIGGERS have no repo profile (prose-only in the ClickUp index);
   BADGES decorate the repo-backed tools. Nicknames are NOT hard-coded here —
   app.js reads each tool's `nicknames:` straight from its profile front-matter
   (the canonical identity source per metadata-schema.md). */

const PROSE_HOOKS = [
  { name: 'De-Slop Pass', purpose: 'Strip AI-sounding filler, hedging, and sign-offs from every response.' },
  { name: 'Source & ID Guard', purpose: 'Get facts right: verify IDs, don\'t fabricate, don\'t hallucinate URLs.' },
  { name: 'Date & Math Guard', purpose: 'Count from provided dates, double-check arithmetic, never trust date-from-memory.' },
  { name: 'Hygiene Sweep', purpose: 'Formatting consistency, no orphaned references, clean output.' },
  { name: 'Clarify First', purpose: 'When something is genuinely ambiguous, ask before guessing destructively.' },
  { name: 'Voice Match', purpose: 'Match Michael\'s register. Sharp coworker, not corporate. Subsumes retired Tone Dial.' },
  { name: 'Naming Canonicalizer', purpose: 'Use canonical names for workspace objects. No invented abbreviations.' },
  { name: 'Compression', purpose: 'Dense output. One sentence beats two. Fragment beats a sentence.' },
  { name: 'Steelman / Red Team', purpose: 'Challenge weak reasoning, push back on half-baked ideas.' }
];

const TRIGGERS = [
  { name: 'Session Open', purpose: 'First response: surface recent activity, load context, check open-thread.md.' },
  { name: 'Session Close', purpose: 'End of session: memory audit, session log, flag unfinished threads, usage log commit.' },
  { name: 'Scope Lock', purpose: 'Before implementing from docs: thorough pass, validate scope, clarify gaps.' },
  { name: 'When Coding', purpose: 'Coding router: review prefs, determine language/scope, load domain gate.' },
  { name: 'When Building Apps', purpose: 'App router: load Apps/HTML Artifacts reference, enforce conventions, check APPS list.' },
  { name: 'When Researching', purpose: 'Research router: multiple sources, structured findings, links mandatory.' },
  { name: 'When Documenting', purpose: 'Doc hygiene: load existing first, no duplicates, current truth at top.' },
  { name: 'When Planning / Scoping', purpose: 'Planning router: structure immediately, propose the system, estimate scope.' },
  { name: 'Chunked Document Review', purpose: 'Multi-part docs: verify markers, confirm each part, hold until all received.' },
  { name: 'Schema Linter', purpose: 'Validate record shape against domain schema (recipes, F1, URITP fields).' },
  { name: 'Revision Log Tracker', purpose: 'Track what changed across revisions of a document or spec.' },
  { name: 'HTML Artifact Regeneration', purpose: 'Regenerate an artifact from source when version drift detected.' },
  { name: 'Attachment Router', purpose: 'Any attached file: classify by type, route to type-specialist branch.' },
  { name: 'PDF Split Markdown Packager', purpose: 'Decide split points + titles, emit import-markdown for the PDF Splitter.' }
];

const BADGES = {
  'secrets-pii-guard': 'halt', 'source-size-budget-enforcer': 'halt',
  'skill-ban-guard': 'halt', 'commit-pre-flight': 'halt',
  'memory-edit-guard': 'halt', 'task-dedup-gate': 'halt',
  'post-build-verify': 'warn', 'artifact-ship-paperwork': 'warn',
  'memory-write-relay': 'warn', 'stale-context-reload': 'silent',
  'link-provenance': 'silent', 'multi-edit-batch-gate': 'silent'
};
