# Admin Task Template Hook

*Scope: Fires when generating a new task for the Admin Tasks list (or when Template Terry is invoked).*

## The Stance
The Admin Tasks list is a zero-friction dumping ground. Do not use custom fields, tags, or dropdowns. Do not write paragraphs. If it requires more structure, it does not belong in the Admin Tasks list.

## The Format
When creating an admin task, the description MUST be formatted exactly like this, using bare Markdown:

**What:** [One short sentence explaining what this is]
**Link:** [URL to the relevant doc, PR, email, etc.]
**Action:** [Verb-first instruction of the immediate next step]

## Execution Rules
1. Never add a "Context" section.
2. Never add a "Background" section.
3. If any of the three lines are not applicable (e.g. there is no link), omit that line entirely. Do not write "N/A".
4. The title of the task must be action-oriented and verb-first (e.g. "Review Q3 budget doc", not "Q3 Budget").