# Employer dossier completeness audit — 2026-09-18

## Purpose

Verify that the employer-dossier normalization did not lose supported career evidence that still exists elsewhere in the repository or in the current review attachments.

This audit is about **source completeness**, not about forcing every fact into every CV. A detail can be preserved in a dossier and still be intentionally omitted from a vacancy-specific resume.

## Material classes reviewed

The audit cross-checked the employer dossiers against:

- GPT/anton_nazarov_profile.json and data/anton_nazarov_profile.json;
- GPT/anton_nazarov_experience_full.md and details/anton_nazarov_experience_full.md;
- GPT/anton_nazarov_career_path_story_full_raw.md and NotebookLM raw-story slices 05A–05E;
- GPT/anton_nazarov_management_cases_full.md / management-positioning material;
- details/anton_nazarov_tech_path_raw.md;
- details/anton_nazarov_enterprise_it_path_raw.md;
- details/chatgpt_shared_cv_tech_survey_source.md;
- details/confirmed_profile_updates_2026-08-11.md;
- master / Greenhouse / HH / Simplify / LinkedIn historical resume/profile material;
- data/evidence_map.json and data/public_summary.md as secondary/stale-index checks;
- cross-role 2026-09-15 debriefs;
- all ZIL-specific debrief / presentation-extraction notes;
- Directorate support debrief and portfolio/ais_mosrazvitie/README.md;
- the current-chat anton_nazarov_profile.json attachment;
- the current-chat CTO and Comtrade AI Technical Consultant DOCX CVs (text cross-check).

Binary PDFs stored in GitHub were not re-parsed directly because the GitHub connector does not expose binary content. Their already-preserved repository text derivatives / structured extracts were included in the audit. This limitation is recorded explicitly rather than treating the PDFs as newly re-read.

## Result

The first employer-dossier pass was **not fully complete**. It preserved the strongest management/business stories well, but it compressed away a meaningful secondary technical / operational layer and omitted one short engagement entirely.

The audit restored those facts into the canonical source layer without deleting the raw/debrief provenance.

## Per-employer result

### Directorate of Cultural Centers of Moscow / AIS MosRazvitie — RESTORED GAPS

Added / made explicit:

- later-confirmed ~126-person functional coordination scope, still not line management;
- technical specifications / requirements drafting;
- certificate / license procurement;
- IBM Notes internal training and institutional consulting;
- VPN / database-field governance;
- edit locking, conditional visibility, session settings, filtered exports, full-text search, feedback section;
- Word/PDF/Excel output and service/batch-action detail;
- HP ProLiant production, VMware replica/development environment;
- Apache POI / Excel-limit handling;
- older ~20x + ETA metric variant;
- older ~2.5x Windows→Linux performance recollection;
- explicit conflict separation between 200–300 users recollection and 200–300 report-runs/day log evidence.

### ZIL Cultural Center — RESTORED GAPS

Added / made explicit:

- wider environment ~200 PCs / 7 servers / ~20 VMs as a separate source scope from 145/156/581;
- AD/GPO + Synology + Octagram + directory / staffing integration;
- Department of Culture directory integration;
- GLPI domain / inventory / asset-lifecycle integration;
- SoftEther VPN / Yandex Disk remote-work implementation context;
- Kaspersky endpoint/security context;
- Hikvision CCTV rebuild, disks / RAID / recovery;
- Zabbix monitoring of network / CCTV / access / storage components;
- integrated phonebook with maps of buildings / PCs / people;
- uncertain ad-hoc DB → relational DB migration preserved without falsely hard-claiming MS SQL;
- presentation portfolio separated into implemented vs planned/evaluated items;
- operating + modernization budget responsibility.

### Moscow Social Development Agency — RESTORED SMALL GAPS

Added / made explicit:

- initial architecture across workstations, servers, Ethernet, Wi-Fi, SIP telephony and business systems;
- team/function leadership, department planning and execution control;
- phone directory with employee-map display + AD synchronization;
- automation requirements and equipment/internet/telephony documentation.

Core ~100-user greenfield/ASAP, GLPI, procurement, security, inventory and acceptance-commission evidence was already present.

### New Business Environment — COMPLETE ENOUGH, NO NEW FACT PROMOTION

The dossier already preserves the raw story: PlanFix ERP/CRM implementation, adoption failure, support/expansion/LTV problem framing, manager coaching, flat-structure accountability gap, technical black-box/key-person dependency and founder advisory.

An older structured profile says Anton 'increased system adoption and manager engagement', but raw evidence does not preserve a measured outcome. The dossier correctly keeps this as diagnosis/methodology rather than promoting an unsupported result.

### Settlement and Savings Bank — RESTORED GAPS

Added / made explicit:

- 10+ working sessions with executives / department heads;
- review of existing DMS/EDMS products and build-in-house assessment;
- weekly plan/check/change-report/department-discovery cadence;
- several departments automated as rollout expanded;
- earlier inherited English/multilingual XPages service for foreign clients.

Core ~60 users, no-lost-documents, traceability, internal-courier reduction, governance-before-automation, 1C/XML and regulatory-risk evidence was already preserved.

### NeedleBit / Independent Practice — RESTORED GAPS

Added / made explicit:

- developers/designers brought into projects as needed;
- two product tracks in parallel;
- recent B2C/SaaS product shape;
- PWA/browser-first work that could avoid App Store dependency;
- actual mixed delivery method (macro Waterfall, iterative/spiral smaller scope, Kanban current work);
- current Vue/Next.js/React context;
- AWS + other cloud exposure;
- GitHub→Cloudflare test/build/deploy pipelines;
- AI product architecture around memory, provider/policy constraints and model fallback;
- MAX retained only as learning/experimentation, not production experience.

Existing project cases were already unusually complete. Separate Xano stories remain deliberately separate.

### OTUS — NO MATERIAL GAP

Bubble, Figma, AI/neural-network use and international marketplace positioning are represented. No additional employer-specific facts worth promoting were found.

### Synergy JSC / Beluga Group — RESTORED GAPS

Added:

- database visual-style unification;
- XPages / non-XPages bug fixing and old-defect cleanup;
- stronger legacy-backlog / technical-debt framing;
- explicit employer-name alias guardrail.

Boss-Referent/XPages achievements that more clearly belong to I.T. Information Technology remain attribution-guarded rather than duplicated here.

### I.T. Information Technology — RESTORED GAPS

Added:

- training / introductory lectures for new employees including top management;
- two or three small databases moved to pure web format;
- parking-pass / visitor workflow examples;
- MS SQL exposure through LEI / AccessApp integration context;
- Rosreestr client-context support/UI evidence, without inventing a separate employer.

### IscTravel Law Agency — MISSING DOSSIER CREATED

The entire short 2012 engagement had been lost from employer dossiers.

Created a canonical dossier preserving:

- Nov–Dec 2012 structured-profile dates;
- short / possibly non-formal engagement status;
- classic Lotus web work without XPages;
- template / website / email generators;
- fingerprint-reader integration;
- attendance/access/time-tracking-style workflow.

Exact formal title / employment status remains qualified.

### Freelance / Private Practice 2009–2011 — RESTORED DETAIL

Added:

- World of Warcraft / Lineage server work;
- CMS websites;
- PC/OS/software support;
- malware/maintenance work;
- MySQL + Bash;
- SVN→MySQL database-update automation;
- cloud backups.

These are provenance / technical-depth facts, not senior-CV headlines.

### Domodedovo Airport — RESTORED SMALL GAPS

Added:

- mail/notification scripting;
- directory/user/calendar data work;
- external client-library/component integration context;
- user-facing UI adaptation.

The exact remembered Java-DLL/LotusScript/OLE interop mechanism is intentionally not hardened into a public claim because the raw wording is ambiguous.

## Non-employer career evidence recovered

The structured profile contained a 2016 'Freelance / SMM and Promotion Transition' entry that should not be modeled as a fictitious employer.

It is now preserved under sources/experience/event_promotion_and_2016_transition.md together with:

- 2016–2017 event-management / promotion / SMM training;
- Byt Dobru festival work;
- volunteer/fair coordination;
- Polynya concert/promotion work;
- large-event / audience-facing experience.

## Conflicts / stale claims intentionally NOT normalized away

- Directorate: ~126 functional scope is not direct reports.
- Directorate: 200–300 users (older recollection) is separate from 200–300 report runs/day (later logs/debrief).
- Directorate: ~20x + ETA is an older aggregate export statement; the later report-specific 5h→seconds/minutes evidence is preferred.
- ZIL: 145 employees / 156 workstations / 581 assets and ~200 PCs / 7 servers / ~20 VMs are different source scopes, not one baseline.
- ZIL: stale data/evidence_map claim about two years without departures is not restored.
- ZIL: likely-MS-SQL target for one internal DB migration remains uncertain.
- NBE: adoption/retention improvement is not promoted as measured outcome.
- NeedleBit: ~10x is current safe revenue wording; x13 remains an older variant.
- NeedleBit: separate Xano stories are not merged.
- Bank: historical legal fine ranges remain external context, not claimed savings.

## Structural conclusion

Employer dossiers are now the canonical factual layer, but the audit confirms why raw provenance must remain retained. The correct hierarchy is:

1. employer dossier for current factual synthesis;
2. project portfolio for project-level technical depth;
3. supplemental sources/experience for non-employer career evidence;
4. raw/debrief/profile/old-CV files for provenance, conflicts and recovery of omitted detail.

Future source-normalization work should run a completeness diff against structured profile + raw technical paths before declaring an employer dossier finished.
