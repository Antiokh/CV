# Employer evidence dossiers

This directory is the **canonical first-stop evidence layer for employment history**.

The repository previously accumulated career evidence by conversation/debrief (`cross_role_*`, `zil_*_debrief`, raw voice notes, portfolio cases, old CVs). Those files are still retained for provenance, but they are not the preferred runtime source because facts about one employer can be scattered across many files and the density differs by employer.

## Source priority

For a vacancy/CV task involving a specific employer or proof case:

1. read the relevant employer dossier here;
2. read project-specific `portfolio/` evidence when a project inside that employer needs technical depth;
3. open the underlying raw/debrief files listed in the dossier only when:
   - verifying provenance;
   - resolving an ambiguity;
   - looking for a detail not yet consolidated;
   - incorporating new first-person evidence.

When new evidence is discovered, update the relevant employer dossier first. Then update derived files such as `GPT/ANTON_EVIDENCE_MATRIX.md`, role profiles and CVs.

Employer dossiers contain source/provenance labels and caveats. **Those labels are internal only and must never leak into public CV text.**

## Current employers / periods

### Current / recent

- [NeedleBit / Independent Practice](./needlebit.md) — Nov 2022–present
- [OTUS](./otus.md) — Sep–Dec 2023
- [New Business Environment](./new_business_environment.md) — Aug–Nov 2022

### Major management / product roles

- [ZIL Cultural Center](./zil_cultural_center.md) — Mar 2020–Jun 2022
- [Directorate of Cultural Centers of Moscow](./directorate_cultural_centers_moscow.md) — Jan 2017–May 2023
- [Moscow Social Development Agency](./moscow_social_development_agency.md) — Sep 2019–Mar 2020
- [Settlement and Savings Bank](./settlement_savings_bank.md) — Jan 2013–Sep 2015

### Earlier enterprise / technical roles

- [Beluga Group / Synergy JSC](./beluga_group.md) — Nov 2016–Mar 2017
- [IscTravel Law Agency](./isctravel_law_agency.md) — short Nov–Dec 2012 engagement
- [I.T. Information Technology](./it_information_technology.md) — Jan 2011–Apr 2012
- [Freelance / Private Practice](./freelance_private_practice_2009_2011.md) — Jan 2009–Jan 2011
- [Domodedovo Airport](./domodedovo_airport.md) — Sep 2008–Sep 2009

## Supplemental non-employer experience

Career evidence that does not map cleanly to one employer is stored separately under [sources/experience](../experience/README.md). This includes the 2016 SMM / promotion transition and event / festival / volunteer evidence.

Do not invent an employer solely to make these periods fit the employer-dossier structure.

## Important distinctions

- **ZIL** is strongest for direct people management, IT operating model, economics, procurement, security, service management and cross-department transformation.
- **Directorate / AIS MosRazvitie** is strongest for product/platform ownership, enterprise data modelling, 100+ institution scope, functional coordination, data governance, scaled adoption and management-information infrastructure.
- **NeedleBit** is strongest for current architecture judgment, portability/handoff, product/business outcomes and AI-assisted delivery.
- **Bank** is strongest for process governance, regulated workflow, stakeholder alignment and management transparency.
- **Agency** is strongest for near-greenfield IT-function launch.

Do not infer that a dossier with more pages represents a more senior role. Evidence density is a documentation property, not a hiring score.

## Legacy / provenance layer

Existing top-level files such as:

- `sources/cross_role_business_outcomes_debrief_2026-09-15.md`
- `sources/cross_role_business_outcomes_second_pass_2026-09-15.md`
- `sources/cross_role_business_outcomes_followup_2026-09-15.md`
- `sources/zil_*_debrief_2026-09-15.md`
- `sources/directorate_support_model_debrief_2026-09-15.md`
- `sources/mosrazvitie.md`
- `GPT/_notebooklm_import/05*_RAW_STORY_*.txt`
- `GPT/anton_nazarov_career_path_story_full_raw.md`

remain valid provenance. They should not normally be loaded as independent competing summaries after the facts have been consolidated here.

## Completeness audit

The first normalization pass was audited against structured profiles, raw technical paths, old CVs and current review attachments. See [COMPLETENESS_AUDIT_2026-09-18.md](./COMPLETENESS_AUDIT_2026-09-18.md) for recovered gaps, deliberately unresolved conflicts and reviewed source classes.

## Update rule

When a new recollection conflicts with an employer dossier:

1. preserve the new recollection in a dated raw/debrief note if useful;
2. resolve or explicitly mark the conflict in the employer dossier;
3. never silently overwrite a stronger documentary source with a later uncertain memory;
4. update the evidence matrix / CVs only after the employer dossier is reconciled.
