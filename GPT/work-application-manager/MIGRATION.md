# Old Chat Employment Migration

Use this file only when Anton asks an existing employment chat to export/migrate accumulated application data to WorkInterviews.

This is archival preservation, not a new vacancy analysis and not a loophole around tracker-storage safety.

## Read order

1. `GPT/GPT_RUNTIME.md`
2. `GPT/MODE_ROUTER.md`
3. `GPT/work-application-manager/SKILL.md`
4. `GPT/work-application-manager/references/tracker-storage-v5.md`
5. `GPT/work-application-manager/references/activity-log.md`
6. live hidden `Agent Instructions`
7. this migration overlay

Newer explicit user instructions win.

## Hard storage boundary

Migration does **not** override v5:

- Jobs remains read-only.
- Existing Active / Low fit / Closed vacancy rows remain agent-read-only.
- Never update or reconstruct an existing protected lifecycle row through API.
- Never create a duplicate Queue row for a vacancy that already exists in Jobs.
- Never write a later/terminal Stage into Queue as a substitute for physical routing.

A migration that cannot be represented safely under this boundary is incomplete and must be reported as such rather than forcing a write.

## Migration semantics

Inspect the entire current chat and recover supported historical facts only. Do not rerun fit analysis, salary research, vacancy availability checks or current web reconstruction merely because migration was requested.

For each distinct vacancy:

1. Resolve/deduplicate through aggregate Jobs using Row ID when known, then Vacancy URL and normalized Company + Position.
2. If the vacancy already exists:
   - preserve the existing physical vacancy row;
   - update vacancy-row fields only when the Row ID is currently writable in Queue and the update is allowed by v5;
   - if the Row ID is in Active / Low fit / Closed, do not mutate it;
   - append recoverable recruiter/interview/application/correspondence history to Activity Log when the Row ID exists and the event is not already logged.
3. If the vacancy does not exist and its historically correct current lifecycle is representable as a Queue stage (`To review`, `Reviewed`, `CV ready`), create it in Queue through the normal atomic/deduplicated creation workflow.
4. If the vacancy does not exist and its historically correct current lifecycle is `Referral`, `Applied`, `Recruiter screen`, `Assessment`, `Interview`, `Technical interview`, `Final`, `Offer`, `Not a fit`, `Rejected`, `Withdrawn`, `Ghosted`, or `Closed`, **do not fabricate a Queue state and do not write directly to a protected partition**. Report a migration blocker requiring human/UI reconciliation. The chat is not safe to delete until that record is durably represented.

This explicit blocker is safer than silently changing historical lifecycle truth.

## Historical evidence to preserve

When supported by the old chat, preserve:

- Vacancy URL and Apply URL;
- Posted date and Date found when evidence supports them;
- historical fit without re-scoring;
- explicitly confirmed Salary expectation;
- historical salary evidence/provenance;
- recruiter/contact identities;
- application identifiers;
- submission/interview/assessment/rejection/offer events;
- useful feedback and process facts;
- existing CV/cover artifacts;
- full substantive vacancy text.

Do not invent application events, dates, stages, contacts, salary values or files.

## Vacancy source and artifacts

Preserve the historical substantive vacancy body in:

`WorkApplications/<Company>/<PositionTitle>/Position.md`

Verify by Drive readback and write its URL to `Vacancy file` only when the owning vacancy row is writable under v5.

Keep Vacancy snapshot and Notes concise. Full vacancy/correspondence text belongs in artifacts/Activity Log, not Sheet prose.

For historical Fit ranges, normalize storage only: use the rounded numeric midpoint and preserve original wording in Notes. Word-only assessments remain prose unless defensible numeric evidence already exists.

## Salary migration

Do not write old free-text salary values into vacancy F or annual midpoint values into AF.

Current salary storage is the structured `Salary Data` schema in `tracker-storage-v5.md`. Historical salary evidence may be preserved in its legacy audit fields / notes according to current rules, but new canonical structured Salary Data writes are allowed only when the vacancy Row ID is currently owned by Queue.

If a protected historical record requires salary repair, report it rather than mutating Salary Data outside the permitted boundary.

## Activity Log migration

For an existing Row ID, append historical events when they are materially useful and supported by the chat. Use stable Source keys when an external message/event identifier is known. Do not duplicate an event already present.

Examples: application sent, recruiter reply, assessment requested/completed, interview invitation/completion, rejection, withdrawal, offer, significant follow-up.

Corrections are new events; never rewrite prior Activity Log events.

## Missing cover-letter repair

If a tailored CV already exists or is successfully recovered and the vacancy row is writable in Queue, the canonical pack should also contain the cover-letter TXT unless Anton explicitly declined it.

Use the historical vacancy + verified profile/CV evidence, apply the current language humanizer, save the canonical TXT, verify it and store its URL in Cover.

For protected Active/Low fit/Closed rows, do not mutate the vacancy row merely to attach a missing artifact; preserve/recover the file where possible and report the tracker-link blocker.

## Delete-safety result

Before saying an old chat is safe to delete, verify all unique recoverable data that can be persisted safely.

End with exactly one of:

`MIGRATION COMPLETE — SAFE TO DELETE THIS CHAT`

`MIGRATION INCOMPLETE — KEEP THIS CHAT`

`NO UNIQUE MIGRATION DATA — SAFE TO DELETE THIS CHAT`

Use `MIGRATION INCOMPLETE` whenever any unique vacancy/process fact remains unrepresented because v5 prevents a safe write. Never relax the storage boundary merely to produce a green migration result.

Do not write Upwork, NeedleBit, freelance-client, RFP, consulting-delivery or agency-opportunity data into WorkInterviews.
