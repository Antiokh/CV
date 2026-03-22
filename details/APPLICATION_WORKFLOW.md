# Application Workflow

This repository is intended to serve as a source of truth for creating targeted resumes, cover letters, and job-specific positioning.

## Canonical Inputs

Use these files as primary sources:

- [README.md](../README.md) for the public master profile
- [RESUME.md](../RESUME.md) for the short English version
- [RESUME_RU_EN_SR.md](../RESUME_RU_EN_SR.md) for multilingual reference
- [Portfolio Index](../portfolio/README.md) for project evidence
- [Full Professional Experience](./anton_nazarov_experience_full.md) for long-form detail
- [AI Profile Suggestions](./AI_PROFILE_SUGGESTIONS.md) for positioning logic

## Recommended Process

1. Start from the target role, not from the master CV.
2. Pick the strongest 3-5 projects that match the vacancy.
3. Pull role language from the vacancy only when it fits actual experience.
4. Rewrite the summary and selected experience around the target role.
5. Keep the portfolio links aligned with the claims in the resume.

## Suggested Output Folder

Use the local `applications/` folder for non-committed working files such as:

- tailored resumes
- cover letters
- company notes
- job descriptions
- interview prep notes
- generated application packs

## Suggested Naming

Inside `applications/`, use a structure like:

- `applications/company_name/`
- `applications/company_name/job_description.md`
- `applications/company_name/resume_en.md`
- `applications/company_name/cover_letter.md`
- `applications/company_name/notes.md`

## Rules

- Do not edit the master profile files just to fit one vacancy.
- Treat this repo as the canonical source.
- Treat `applications/` as disposable output space.
- Push improvements back into canonical files only when they make the whole profile better.
