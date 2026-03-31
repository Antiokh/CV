# Application Workflow

This repository is intended to serve as a source of truth for creating targeted resumes, cover letters, negotiation notes, and job-specific positioning.

## Canonical Inputs

Use these files as primary sources:

- [README.md](../README.md) for the public master profile
- [RESUME.md](../RESUME.md) for the short English version
- [RESUME_RU_EN_SR.md](../RESUME_RU_EN_SR.md) for multilingual reference
- [Portfolio Index](../portfolio/README.md) for project evidence
- [Full Professional Experience](../details/anton_nazarov_experience_full.md) for long-form detail
- [AI Profile Suggestions](./ai_profile_suggestions.md) for positioning logic

## Recommended Process

1. Start from the target role, not from the master CV.
2. Pick the strongest 3-5 projects that match the vacancy.
3. Pull role language from the vacancy only when it fits actual experience.
4. Rewrite the summary and selected experience around the target role.
5. Keep the portfolio links aligned with the claims in the resume.
6. Build the output with clear separation between:
   - Summary
   - Core skills
   - Work experience
   - Selected projects
   - Education / languages / authorization

## Output Structure Rules

When generating a tailored resume, always keep **work experience** and **projects** in separate sections.

Required structure:

- Summary / headline
- Core skills
- Work experience
- Selected projects
- Additional experience or highlights
- Education / languages / authorization

Do not mix project case studies into the work experience section unless the vacancy specifically requires a combined narrative and the separation would reduce clarity.

For AI-heavy roles, use a dedicated **AI Projects** subsection rather than blending those projects into employment history.

## NeedleBit Positioning Rule

By default, when generating application materials, present NeedleBit as:

- `CTO / Systems Architect`
- `Systems Architect`
- `Technical Product Lead`
- `Product Builder`

Avoid using `Founder` in the headline or experience label unless the target vacancy clearly benefits from a founder narrative.

Reason:
- `Founder` can reduce fit for many mid-senior product, engineering, and architecture roles
- the work evidence is stronger than the startup title itself
- the role narrative should emphasize delivery, architecture, and ownership, not company formation

Only keep `Founder` in generated output when:
- the vacancy explicitly favors founding / startup / entrepreneurial ownership
- the title helps clarify a real business context
- omitting it would distort the actual work history

## Compensation Research Rule

For every serious application pack, do a quick compensation sanity check before finalizing the ask range.

Use a combination of:
- Glassdoor
- Levels.fyi
- company career pages and local market snippets
- similar-role search results for the same city/country
- the role’s actual seniority, scope, and ownership expectations

The goal is to build a **weighted, defensible range** that balances:
- local market data
- company size and geography
- role scope
- your actual ownership level
- how much ambiguity and leadership the role expects

## Negotiation Strategy Rule

Every archive generated for an application should include a negotiation strategy file in English.

Minimum contents:
- role positioning
- what to clarify on the call
- compensation strategy
- what not to do
- useful framing lines
- a short bottom line summary

## Suggested Output Folder

Use the local `applications/` folder for non-committed working files such as:

- tailored resumes
- cover letters
- company notes
- job descriptions
- interview prep notes
- generated application packs
- negotiation strategy notes

## Suggested Naming

Inside `applications/`, use a structure like:

- `applications/company_name/`
- `applications/company_name/job_description.md`
- `applications/company_name/resume_en.md`
- `applications/company_name/cover_letter.md`
- `applications/company_name/notes.md`
- `applications/company_name/negotiation_strategy.md`

## Delivery Rule

When the archive is ready, send the **single zip archive** directly in-chat.
Do not ask for extra confirmation for the archive step if the application pack is already in progress.

## Rules

- Do not edit the master profile files just to fit one vacancy.
- Treat this repo as the canonical source.
- Treat `applications/` as disposable output space.
- Push improvements back into canonical files only when they make the whole profile better.
