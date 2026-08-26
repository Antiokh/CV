# Old Chat Employment Migration

Use this file only when Anton asks an existing employment chat to export/migrate accumulated application data to WorkInterviews.

This is archival preservation, not a new vacancy analysis and not a loophole around current storage safety.

## Read order

1. `GPT/GPT_RUNTIME.md`
2. `GPT/MODE_ROUTER.md`
3. `GPT/work-application-manager/SKILL.md`
4. `GPT/work-application-manager/references/tracker-storage-v5.md`
5. `GPT/work-application-manager/references/salary-normalization-v6.md`
6. `GPT/work-application-manager/references/cv-markdown-v1.md`
7. `GPT/work-application-manager/references/activity-log.md`
8. live hidden `Agent Instructions`
9. this migration overlay

Newer explicit user instructions win.

## Hard storage boundary

Migration does not override tracker-storage-v5:

- Jobs remains read-only.
- Existing Active / Low fit / Closed vacancy rows remain agent-read-only.
- Never update/reconstruct an existing protected lifecycle row through API.
- Never create a duplicate Queue row for a vacancy already present in Jobs.
- Never write a later/terminal Stage into Queue as a substitute for physical routing.

A migration that cannot be represented safely is incomplete and must be reported rather than forced.

## Migration semantics

Inspect the entire current chat and recover supported historical facts only. Do not rerun fit analysis, salary market research, availability checks or current web reconstruction merely because migration was requested.

For each distinct vacancy:

1. Resolve/deduplicate through aggregate Jobs using Row ID when known, then Vacancy URL and normalized Company + Position.
2. If the vacancy already exists:
   - preserve the physical vacancy row;
   - update vacancy fields only when the Row ID is currently writable in Queue and the update is allowed by v5;
   - if Row ID is in Active / Low fit / Closed, do not mutate it;
   - append recoverable recruiter/interview/application/correspondence history to Activity Log when Row ID exists and event is not already logged.
3. If the vacancy does not exist and its historically correct current lifecycle is a Queue stage (`To review`, `Reviewed`, `CV ready`), create it in Queue through normal atomic/deduplicated creation.
4. If it does not exist and its truthful current lifecycle is `Referral`, `Applied`, `Recruiter screen`, `Assessment`, `Interview`, `Technical interview`, `Final`, `Offer`, `Not a fit`, `Rejected`, `Withdrawn`, `Ghosted`, or `Closed`, do not fabricate a Queue state and do not write directly to a protected partition. Report a migration blocker requiring human/UI reconciliation. The chat is not safe to delete until that record is durably represented.

## Historical evidence to preserve

When supported by the old chat, preserve:

- Vacancy URL / Apply URL;
- Posted date / Date found when evidenced;
- historical fit without re-scoring;
- explicitly confirmed Salary expectation;
- historical salary evidence/provenance;
- recruiter/contact identities;
- application identifiers;
- submission/assessment/interview/rejection/offer events;
- useful feedback/process facts;
- existing CV/cover artifacts;
- full substantive vacancy text.

Do not invent application events, dates, stages, contacts, salary values or files.

## Vacancy source and artifacts

Preserve historical substantive vacancy body in:

`WorkApplications/<Company>/<PositionTitle>/Position.md`

Verify by Drive readback and write its URL to `Vacancy file` only when the owning vacancy row is writable under v5.

Keep Vacancy snapshot and Notes concise. Full vacancy/correspondence text belongs in artifacts/Activity Log.

For historical Fit ranges, normalize storage type only: use rounded numeric midpoint and preserve original wording in Notes. Word-only assessments remain prose unless numeric evidence already exists.

## Salary migration

`salary-normalization-v6.md` is authoritative for current canonical salary fields, but archival migration does not trigger new salary research by itself.

- Never write historical free-text salary into vacancy F or annual midpoint into AF; both are computed current fields.
- Preserve available historical salary evidence/provenance without inventing missing bounds, tax basis or FX.
- New structured Salary Data writes are allowed only for a Row ID currently owned by Queue and only when existing historical evidence is sufficient to satisfy the current structured contract without new research.
- Otherwise preserve legacy evidence/audit context and report any remaining salary blocker rather than fabricating current normalized data.
- Protected Active/Low fit/Closed salary records are not agent-repaired during migration.

## CV artifact migration

`cv-markdown-v1.md` is authoritative: Markdown is the current canonical tailored CV source and tracker `CV` points to Markdown by default.

- Recover an existing canonical Markdown CV when available.
- If an old chat contains only a Word derivative, preserve that historical artifact, but do not treat it as permission to independently maintain Word as a second canonical source.
- Do not require creation of a persistent DOCX merely to complete migration.
- If a tailored Markdown CV exists/is recovered and the writable Queue record requires Cover, create/recover the canonical humanized TXT unless Anton explicitly declined it.
- For protected Active/Low fit/Closed rows, preserve/recover artifacts where possible but do not mutate the protected vacancy row merely to attach them; report the tracker-link blocker.

## Activity Log migration

For an existing Row ID, append materially useful historical events supported by the chat. Use stable Source keys when an external event identifier is known and do not duplicate existing events.

Examples: application sent, recruiter reply, assessment requested/completed, interview invitation/completion, rejection, withdrawal, offer, significant follow-up.

Corrections are new events; never rewrite prior events.

## Delete-safety result

Before saying the old chat is safe to delete, verify all unique recoverable data that can be persisted safely.

End with exactly one of:

`MIGRATION COMPLETE — SAFE TO DELETE THIS CHAT`

`MIGRATION INCOMPLETE — KEEP THIS CHAT`

`NO UNIQUE MIGRATION DATA — SAFE TO DELETE THIS CHAT`

Use `MIGRATION INCOMPLETE` whenever unique vacancy/process/artifact data remains unrepresented because the current safety boundary prevents a safe write. Never relax storage rules merely to produce a green migration result.

Do not write Upwork, NeedleBit, freelance-client, RFP, consulting-delivery or agency-opportunity data into WorkInterviews.
