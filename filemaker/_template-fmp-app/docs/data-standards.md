# Data Standards

> Naming conventions and data rules. Inherits the URITP FileMaker standards; app-specific overrides noted here.

- **Primary keys:** `PrimaryKey`, UUID, never serial.
- **Foreign keys:** `fk<Parent>` prefix.
- **Calcs:** `calc_` prefix, each with a purpose comment.
- **Globals:** `g_` prefix; `gLIST_` reserved for value-list globals.
- **Value lists vs tables:** metadata beyond display value = table; simple labels = value list.
