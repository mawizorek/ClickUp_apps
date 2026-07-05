---
# =============================================================
# CANONICAL AGENT PROFILE ANATOMY
# Every agent profile carries this front-matter identity block
# PLUS the shared spine below. The two archetypes differ ONLY in
# the middle. Rule: "same bones even if bare" - keep every spine
# section present even when its content is a single line.
# =============================================================
slug:            # PERMANENT identity. filename = <slug>.md. Never changes.
display_name:    # Mutable. A rename touches ONLY this field.
nicknames: [, ]  # invocation + search aliases
role:            # one line: "<Name> - <what it uniquely does>"
type: subagent   # subagent | gate | hook | trigger
status: active   # active | building | dormant | retired
seat:            # core | depth | output | workshop | close | audit | research | gate | lead | build
accent: "oklch(70% 0.13 45)"  # shelf hue for the viewer
---

# <Display Name>

**Primary name:** <Display Name>
**Nicknames:** <...>
**Role:** <one-liner>

**Invocation:** <auto (seated by Maestro Mira) | fires when X> + on-demand by name/nickname.

---

## Anatomy (read before authoring)

Every profile = **shared spine** + **one archetype middle**.

**Shared spine (mandatory on EVERY profile, even if a section is one line):**
- front-matter identity block (above) - the single source of truth for name/nicknames; nothing else should hand-copy the name
- `## Purpose`
- `## Composes with / suppressed by`
- `## Personality`
- `## Changelog`

**Then pick ONE archetype middle:**

- **(A) Reactive lens** - seated by Mira, returns a tight submission. All Council + Workshop voices (Cass, Cole, Lena, Mika, Piper, Nia, Dara, Faye, Rhys, Cleo, Polly, Finn, Skye, Enzo) and gates (Frank). Middle = `When seated` + `The lens / the question` + `Output shape`.
- **(B) On-demand worker** - invoked by name, runs multi-step work in its own context, produces a report. Renata, Sage, Clio, Hana. Middle = `Trigger` + `Scope & Tools` + `Process` (or a domain-named checklist) + `Output Format` + `Testing`.

A bare/new agent still gets the FULL spine plus its archetype middle, even if each section is one line. Bones first; flesh them out over time.

---

<!-- ============ ARCHETYPE (A): REACTIVE LENS ============ -->

## When seated

Which turns Mira seats this voice on, and what suppresses it.

## The lens / the question

The actual pass. Dense, ordered. The specific question(s) this voice always asks.

## Output shape

The tight submission this voice hands back to Mira. Not an essay.

<!-- ============ ARCHETYPE (B): ON-DEMAND WORKER ============
## Trigger
Automatic firing conditions + on-demand invocation phrases.

## Scope & Tools
Read/write access, target repo/docs, guardrails (e.g. "no write access").

## Process
The ordered steps the worker runs. (May be a domain-named checklist, e.g. "Audit Checklist".)

## Output Format
The report skeleton as a fenced markdown block.

## Testing
Cold-start test + validation criteria the output must meet.
============================================================ -->

---

## Composes with / suppressed by

Chaining + de-dupe notes: who covers this angle if this voice is absent, who it pairs with, what suppresses it.

---

## Personality

How it talks. One short paragraph.

---

## Changelog

- <YYYY-MM-DD> - created.
