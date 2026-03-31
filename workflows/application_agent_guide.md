# Application Agent Guide

This guide is for using this repository as the source of truth when preparing job applications.

## Goal

Produce tailored application materials without polluting or distorting the canonical profile files.

## Canonical Sources

Always start from these files:

- [README.md](../README.md)
- [RESUME.md](../RESUME.md)
- [RESUME_RU_EN_SR.md](../RESUME_RU_EN_SR.md)
- [Portfolio Index](../portfolio/README.md)
- [Full Professional Experience](../details/anton_nazarov_experience_full.md)
- [AI Profile Suggestions](./ai_profile_suggestions.md)
- [Application Workflow](./application_workflow.md)
- [Evidence Map Guide](./evidence_map_guide.md)
- [Role Market Fit Matrix](../data/role_market_fit.md)
- [Career Strategy](../data/career_strategy.md)

## Output Location

All job-specific output belongs in the local `applications/` folder, which is ignored by git.

Recommended structure:

- `applications/company_name/`
- `applications/company_name/job_description.md`
- `applications/company_name/resume_en.md` or `resume_ru.md`
- `applications/company_name/cover_letter.md` or `cover_letter_ru.md`
- `applications/company_name/notes.md` or `notes_ru.md`
- `applications/company_name/negotiation_strategy.md` or `negotiation_ru.md`
- optional PDF exports of the main docs

## Language Handling

Match the package language to the vacancy language whenever possible.

- English vacancy -> English pack
- Russian vacancy -> Russian pack
- mixed / uncertain -> use the language of the application surface and keep the core resume consistent

Do not mix languages inside the main resume unless it is intentionally a bilingual pack.

## Workflow

1. Read the job description first.
2. Identify the target role category:
   - Head of Engineering
   - Systems Architect
   - Technical Product Lead
   - Founding Engineer
   - Fractional CTO
   - other
3. Pick the strongest matching evidence from portfolio and experience.
4. Rewrite summary and selected experience around fit, not around completeness.
5. Keep claims tied to evidence already present in this repo.
6. Save tailored outputs only inside `applications/`.

## Rules

- Do not rewrite canonical files just to fit one vacancy.
- Do not invent outcomes, metrics, or ownership.
- If a case has no numeric result, emphasize:
  - scope
  - architecture
  - workflow complexity
  - migration
  - operational improvement
  - integration difficulty
- Prefer 3-5 strongest proof points over broad coverage.
- Keep each tailored resume role-aligned, not biography-like.

## Good Evidence Types

Strong evidence in this repo usually falls into one of these categories:

- rebuilt a broken or fragmented operational process
- designed architecture across frontend, backend, data, and automation
- introduced role-based control, reporting, or admin tooling
- migrated legacy data or systems
- built AI-assisted workflows with real engineering discipline
- handled both technical execution and organizational alignment

## Avoid

- listing too many tools without a narrative
- overusing weak projects when stronger ones exist
- describing yourself as a narrow low-code freelancer
- mixing incompatible role narratives in one application

## Default Recommendation

If no better strategy is obvious, optimize the application around:

- systems thinking
- architecture ownership
- operational product delivery
- AI-assisted engineering maturity
