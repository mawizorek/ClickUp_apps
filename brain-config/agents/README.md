# Agent Creation Conventions

## Naming Convention

All git-markdown agents use **alliterative real human names** as a two-word pairing:
- First word = role/function descriptor (e.g. Memory, Maestro, Scout, Recon)
- Second word = real human first name starting with the same letter
- Format: `lowercase-lowercase` for filenames (e.g. `memory-maggie.md`)
- Display: Title Case in headers (e.g. Memory Maggie)

Examples from the roster: Breaker Beckett, Cautious Cass, Closing Clio, Counter Cole, Maestro Mira, Memory Maggie, Scout Sage, Workshop Wes.

## Pre-Build Gate (Mira Workflow)

Before any committed-source agent build, Maestro Mira runs the **seven-lens gate**:

1. **Red** — Adversarial/failure modes
2. **Creative** — Novel approaches, lateral thinking
3. **Professionalism** — Tone, polish, brand alignment
4. **Development** — Technical feasibility, architecture
5. **Scope** — Boundaries, what's in/out
6. **Ecosystem** — How it fits with existing agents/tools
7. **Handoff** — Documentation, onboarding, maintainability

All seven lenses pass before build proceeds. This is Mira's orchestration responsibility, not a per-agent concern.

## Agent Invocation Gate

When Brain encounters an ambiguous agent reference (close name match, overlapping domain), it presents options and asks rather than guessing. Disambiguation is mandatory.
