# Template vs Production Instance — GUARDRAIL

> **All agents MUST read this before touching any list with a `(P0)` suffix or residing in `SHOW TEMPLATE`.**

---

## The rule

**Template lists and tasks are structural scaffolding. They contain NO show-specific content, NO active production data, and NO real-person coordination.**

A template task defines the SHAPE of work (what subtasks exist, what fields matter, what the lifecycle looks like). It does NOT hold:
- Email threads about a real production
- Real deadlines or meeting times
- Designer submissions or artifact uploads
- Comments referencing specific people's availability

## How to tell the difference

| Signal | Template | Production instance |
|--------|----------|--------------------|
| List name suffix | `(P0)`, `(P1)`, etc. in SHOW TEMPLATE | `(BL)`, `(TM)`, show abbreviation |
| Folder location | `SHOW TEMPLATE` folder | Named production folder (e.g. `Big Love F'26`) |
| Task content | Generic, describes the category | Specific: names, dates, links, correspondence |
| Comments | None, or structural notes | Active coordination threads |

## The mistake pattern

Search finds a template task with the right NAME (e.g. "[ SCENIC DESIGN ]" in Show Design (P0)) and an agent routes production-specific content there because the title matches. **The title WILL match — that's what templates are for. Check the LIST NAME and FOLDER before routing.**

## What goes where

- **Template tasks** get structural improvements ONLY: better checklists, field additions, description patterns that generalize. If it names a person, a date, or a file, it doesn't belong.
- **Production tasks** (the instantiated versions in the show's own folder) get all the real work: emails, coordination, artifacts, status updates.
- If a production's version of a template task doesn't exist yet, CREATE IT in the production folder — don't use the template as a substitute.

## The four homes for production work (Big Love example)

1. **Season Planning / Onboarding** (e.g. "Big Love — Scenic Designer (Frank Oliva)") — finite checklist, closes when done
2. **Production Cal milestones** (e.g. "[BL] Due: Prelim Scenic Design") — calendar-facing date anchor, marks WHEN
3. **Show Design work tasks** (e.g. "[ prelim Scenic Design ]" in Show Design (BL)) — the deliverable/artifact home, tracks WHAT
4. **CRM Person tasks** (e.g. "Frank Oliva" in ADULTS) — canonical human record, holds WHO + availability fields

These are DISTINCT roles. An email about scheduling a design review goes to #3 (the work) or #2 (the deadline), NOT #1 (which closes after onboarding) and NEVER to the template.

---

_Created 2026-08-04. Source: Milo inbox triage session, Michael's correction._
