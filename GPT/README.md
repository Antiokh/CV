# GPT Workspace

This folder contains career evidence, employment workflow files, and legacy/shared GPT packaging utilities.

## ChatGPT Project deployment: employment

For Anton's employment / job-search ChatGPT Project, copy only [GPT_BOOTSTRAP.md](./GPT_BOOTSTRAP.md) into the Project Instructions.

The employment bootstrap intentionally does **not** load the combined `GPT_RUNTIME.md` or `MODE_ROUTER.md`. It preselects candidate-side employment work and loads only the employment workflow plus task-relevant evidence from `Antiokh/CV`.

The ChatGPT Project may keep two local files with narrow roles:

- `anton_nazarov_profile.json` — stable factual cache only. Canonical GitHub evidence wins on conflict; its Upwork/NeedleBit positioning is not an instruction source for the employment project.
- `Anton_Nazarov_CTO_CV.docx` — visual/layout reference only. Its wording and omissions are not canonical career evidence.

For vacancy, CV, cover-letter, recruiter, interview, tracker, or application-pack work, the operational entry point is:

- `work-application-manager/SKILL.md`

Load positioning/evidence selectively:

- executive/managerial: `EXECUTIVE_POSITIONING.md`, `MANAGEMENT_EXPERIENCE_CASES.md`, `MANAGEMENT_TRANSLATION_LAYER.md`
- technical/specialist employment: `TECHNICAL_DELIVERY_POSITIONING.md`, `AI_NATIVE_DELIVERY.md`, relevant factual project/experience evidence
- interview/career story: `anton_nazarov_career_path_story.md` and deeper sources only when needed
- canonical facts: `../data/`, `../details/`, and `../portfolio/`

Do not load Upwork, NeedleBit marketing, freelance/agency skills, or `Antiokh/needlebit-marketing` during ordinary employment work.

## Commercial / Freelance materials

This repository still contains shared and legacy files used by the previous combined CV + Agency packaging, including:

- `MODE_ROUTER.md`
- `freelance-agency-manager/SKILL.md`
- `UPWORK_PROJECT_CASES.md`
- `NEEDLEBIT_POSITIONING.md`
- `NEEDLEBIT_CASES.md`
- `NEEDLEBIT_OLD_ARCHIVE_NOT_PRIMARY.md`
- `GPT_RUNTIME.md`

They are **not part of the employment ChatGPT Project bootstrap**. Commercial NeedleBit/Upwork work should live in the separate Freelance/Agency project and use `Antiokh/needlebit-marketing` as its canonical positioning source.

`GPT_RUNTIME.md` remains a generated compatibility artifact for the older combined bootstrap/runtime design. If that combined design is maintained, regenerate it with `build_notebooklm_sources.ps1` after changing its source files. Do not copy it into the employment Project Instructions.

## Evidence files

Employment-relevant files include:

- `EXECUTIVE_POSITIONING.md`
- `MANAGEMENT_EXPERIENCE_CASES.md`
- `MANAGEMENT_TRANSLATION_LAYER.md`
- `TECHNICAL_DELIVERY_POSITIONING.md`
- `AI_NATIVE_DELIVERY.md`
- `anton_nazarov_career_path_story.md`
- `anton_nazarov_management_cases_full.md`
- `anton_nazarov_career_path_story_full_raw.md`
- `anton_nazarov_experience_full.md`
- `comprehensive_psychological_career_profile.md`

Use them selectively. Do not load all evidence for every task.

## Canonical-source rule

Files in `GPT/` may be packaging copies. Canonical originals still live elsewhere in the repository, including:

- [data/anton_nazarov_profile.json](../data/anton_nazarov_profile.json)
- [details/anton_nazarov_experience_full.md](../details/anton_nazarov_experience_full.md)
- [details/comprehensive_psychological_career_profile.md](../details/comprehensive_psychological_career_profile.md)

When precision, freshness, or a conflict matters, prefer the canonical source.
