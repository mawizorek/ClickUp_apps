# Documents

**Role:** document · **Status:** pending · **App:** hml-llc

> Binder module: one metadata/intake record per logical document; file containers live on child `DocumentVersions`. Parked for v1 unless needed. Rename `DOCUMENTS` → `Documents` before any ExecuteSQL references; FK typing target = **Text** (UUID), not numeric.

## Fields (binder design)

| Field | Type | Key | Category | Notes |
|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | target Text UUID (legacy DocumentID Serial) |
| fkProperty | text-uuid | fk | key | the "tab" in the binder (legacy PropertyID_fk numeric) |
| fkLoan | text-uuid | fk | key | optional for now (legacy LoanID_fk numeric) |
| fkCurrentVersion | text-uuid | fk | key | points at active DocumentVersions row (legacy CurrentVersionID_fk) |
| DocumentType | text | plain | detail | value list: Balloon Note, Settlement Statement, Interest Payment, Check Received |
| DocumentDate | date | plain | detail | date on the document |
| DateReceived | date | plain | detail | when physically received/cashed |
| Amount | number | plain | detail | if applicable |
| PayorPayee | text | plain | detail | who wrote/received the check |
| CheckNumber | text | plain | detail | checks only |
| Notes | text | plain | detail | freeform |
| VersionCount | calc | calc | calc | count of versions |
| PinnedLocal | number | plain | detail | 1 = keep cached on device |
| OriginalFilename | text | plain | detail | preserved original filename |
| fkExpectedPayment | text-uuid | fk | key | future: link to expected payment |
| fkReceivedPayment | text-uuid | fk | key | future: link to received payment |
| IsVerified | number | plain | detail | 1 = reconciled against ledger |
| LinkedDate | timestamp | audit | audit | when link made |
| LinkedBy | text | audit | audit | who linked |
| DateCreated | timestamp | audit | audit | |
| DateModified | timestamp | audit | audit | |

## Child: DocumentVersions (if versioning survives v1)

| Field | Type | Notes |
|---|---|---|
| PrimaryKey | text-uuid | version PK (legacy VersionID Serial) |
| fkDocument | text-uuid | FK to Documents |
| VersionNumber | number | auto-increment per document |
| RemoteFile | container | encrypted remote storage |
| LocalCache | container | device-local cache |
| SyncStatus | text | remote_only / local_only / synced / pinned |
| UploadedBy | text | |
| UploadTimestamp | timestamp | auto |
| Notes | text | |

## Relationships

- Referenced by `PropertySUMMARIES.fkDocuments` (many-to-one, under-review)
- Parent of `DocumentVersions.fkDocument` (decision open)

## Open Items

- `Documents` base + child `DocumentVersions`, or file storage directly on `Documents` for v1?
- Convert all legacy numeric Serial FKs to Text UUID.

## Changelog

- 2026-07-14: Per-table file; absorbed full binder field list + DocumentVersions child from legacy docs.
