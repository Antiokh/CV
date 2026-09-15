# Case Study Format

Use this format for all portfolio project descriptions in this folder.

## Folder Rules

Each project should have its own folder:

- `portfolio/<project_slug>/README.md` - short portfolio version
- optional `details.md` or `<project_slug>_case_study.md` - expanded internal notes
- optional screenshots or assets if they help explain the work

Use lowercase folder names with underscores.

## Purpose of `README.md`

The project `README.md` should be a concise case study that is easy to scan in 1-2 minutes.

It should explain:

- what the product is
- what problem it solves
- what the system does
- what stack was used
- what was technically difficult
- what result was achieved
- why the project matters in the portfolio

Avoid turning the short `README.md` into a long technical dump.

## Recommended Structure

Use this section order unless there is a strong reason to change it:

1. `# Project Name - Short Descriptor`
2. `## Overview`
3. `## What the System Does`
4. `## Key Features`
5. `## Tech Stack`
6. `## Challenges`
7. `## Result`
8. `## Key Takeaway`
9. `## Additional Notes`
10. `## Screenshots`

## Writing Rules

- Write in English.
- Keep the tone factual and product-oriented.
- Prefer short paragraphs and clear bullets.
- Focus on ownership, decisions, architecture, and outcomes.
- Emphasize real complexity, not buzzwords.
- If the project is public, add a public product link in `Additional Notes`.
- If there is a longer internal write-up, link it from `Additional Notes`.
- If exact metrics are unavailable, describe operational or product impact honestly.

## What to Include

Good signals to include:

- end-to-end ownership
- architecture decisions
- unusual constraints
- tricky product or UX problems
- system behavior under real-world conditions
- business impact
- scale, automation, cost reduction, speed, or reliability improvements

## What to Avoid

- generic claims without examples
- bloated background or methodology sections
- excessive internal implementation detail in the short README
- vague stack lists unrelated to the actual project
- marketing language that hides what was really built

## Expanded Notes

If a project needs deeper explanation, keep that in a separate file such as:

- `details.md`
- `<project_slug>_case_study.md`

The expanded file can include:

- data model details
- scoring logic
- workflow edge cases
- tradeoffs and lessons
- implementation notes not needed in the short portfolio view

## Minimal Template

```md
# Project Name - Short Descriptor

## Overview

One short paragraph explaining what the product is and why it matters.

---

## What the System Does

- core capability
- core capability
- core capability

---

## Key Features

### Feature Name
Short explanation.

---

## Tech Stack

- **Frontend:** ...
- **Backend:** ...

---

## Challenges

### Main Challenge
Short explanation.

---

## Result

Short explanation of what was delivered and why it matters.

---

## Key Takeaway

One short paragraph about what this project demonstrates.

---

## Additional Notes

Public product reference: ...

Detailed internal case study: ...

---

## Screenshots

_Add screenshots here_
```
