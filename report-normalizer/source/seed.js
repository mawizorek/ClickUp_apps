// Seed data: the canonical Beta Budget target schema + the URF0985 mapping profile,
// lifted from ClickUp task BETA-361's hand-cleaning routine. Loaded when the store is empty
// (local-only mode) so the app is useful on first open. The Worker/D1 supersedes this once wired.

export const SEED_SCHEMAS = [
  {
    schema_id: 'beta-budget-purchases',
    name: 'Beta Budget \u2014 Purchases',
    notes: 'FileMaker Beta Budget purchases import target. From BETA-361.',
    locked: 1,
    fields: [
      { field: 'RECEIPT#', required: 0, type: 'text' },
      { field: 'DATE', required: 1, type: 'date' },
      { field: 'VENDOR', required: 1, type: 'text' },
      { field: 'DESCRIPTION', required: 0, type: 'text' },
      { field: 'METHOD', required: 0, type: 'text' },
      { field: 'AMOUNT', required: 1, type: 'number' },
      { field: 'CODE', required: 0, type: 'text' },
      { field: 'NOTES', required: 0, type: 'text' },
    ],
  },
];

// Profile maps SOURCE column name -> target field (or omitted = dropped).
// Transforms are an ordered op chain keyed by target field.
export const SEED_PROFILES = [
  {
    profile_id: 'urf0985-beta-purchases',
    name: 'URF0985 \u2192 Beta Budget (Purchases)',
    schema_id: 'beta-budget-purchases',
    header_fingerprint: null, // set on first real match so it auto-recognizes next time
    filename_hint: 'URF0985',
    locked: 1,
    source: 'seed',
    map: {
      'Accounting Date': 'DATE',
      'Supplier': 'VENDOR',
      'Line Memo': 'DESCRIPTION',
      'Journal Source': 'METHOD',
      'Amount': 'AMOUNT',
      'Header Memo': 'NOTES',
    },
    transforms: {
      DATE: [{ op: 'dateReformat', args: { out: 'YYYY-MM-DD' } }],
      VENDOR: [{ op: 'trimWhitespace' }],
      'RECEIPT#': [{ op: 'constant', args: { value: '' } }],
    },
    // v1 documents but does not auto-run the labor/purchase split; schema leaves room.
    split_rule: { note: 'Ledger Account < 6000 = labor (Futures)', col: 'Ledger Account', cmp: 'lt', value: 6000 },
    filter: null,
  },
];
