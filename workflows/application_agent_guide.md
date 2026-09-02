# Application Agent Guide

This guide is for using the public CV repository as an evidence source when preparing job applications.

## Goal

Produce tailored application materials without polluting or distorting canonical public profile files.

## Canonical Public Sources

Always start from:

- [README.md](../README.md)
- [RESUME.md](../RESUME.md)
- [RESUME_RU_EN_SR.md](../RESUME_RU_EN_SR.md)
- [Public Summary](../data/public_summary.md)
- [Portfolio Index](../portfolio/README.md)
- [Full Professional Experience](../details/anton_nazarov_experience_full.md)
- [Management Cases](../details/anton_nazarov_management_cases_full.md)
- [Recommendations Dataset](../data/anton_nazarov_recommendations.json)
- [Strengths Reference](../details/metafox_strengths_report.md)
- [Application Workflow](./application_workflow.md)
- [Evidence Map Guide](./evidence_map_guide.md)
- [Pack Template](../data/pack_template.md)

Private role-selection, compensation, psychometric and development material belongs in the private marketing workspace and must not be copied into public CV files.

## Output Location

All job-specific output belongs in the local `applications/` folder, which is ignored by git.

Recommended structure:
- `applications/company_name/`
- `job_description.md`
- `resume_en.md` or `resume_ru.md`
- `cover_letter.md` or `cover_letter_ru.md`
- `notes.md` or `notes_ru.md`
- optional PDF exports

## Language Handling

Match the package language to the vacancy language whenever possible.

- English vacancy -> English pack
- Russian vacancy -> Russian pack
- mixed / uncertain -> use the language of the application surface

Do not mix languages inside the main resume unless it is intentionally bilingual.

## Workflow

1. Read the job description first.
2. Identify the dominant role category.
3. Pick the strongest matching evidence from portfolio, experience, management cases and recommendations.
4. Rewrite the summary and selected experience around fit, not completeness.
5. Keep claims tied to evidence already present in the public repo.
6. Save tailored outputs only inside `applications/`.

## Rules

- Do not rewrite canonical files just to fit one vacancy.
- Do not invent outcomes, metrics or ownership.
- If a case has no numeric result, emphasize scope, architecture, workflow complexity, migration, operational improvement or integration difficulty.
- Prefer 3–5 strongest proof points over broad coverage.
- Keep each tailored resume role-aligned, not biography-like.

## Good Evidence Types

Strong evidence usually includes:
- rebuilt a broken or fragmented operational process
- designed architecture across frontend, backend, data and automation
- introduced role-based control, reporting or admin tooling
- migrated legacy data or systems
- built AI-assisted workflows with real engineering discipline
- handled both technical execution and organizational alignment

## Public Positioning Rule

The public repository is an outward-facing evidence surface. Do not add private weaknesses, psychometric risk notes, compensation strategy, draining-zone analysis or internal role-avoidance reasoning to it.
