# Old Chat Employment Migration

Load this file only when the user asks an existing employment/project chat to export or upload its accumulated data to `WorkInterviews`, including short commands such as `отгрузи данные в <WorkInterviews URL>` or equivalent.

This is archival migration, not a new vacancy analysis.

## Read order

1. Read current `GPT/work-application-manager/SKILL.md` from `Antiokh/CV` main.
2. Read the live hidden `Agent Instructions` tab in `WorkInterviews` before writes.
3. Apply this migration file as the focused migration overlay.

Newer explicit user instructions win.

## Migration semantics

Inspect the entire current chat and recover all unique employment/application information already supported by the conversation.

For each distinct vacancy:

- upsert the existing `Jobs` row by Vacancy URL, then normalized Company + Position and other strong identifiers;
- preserve historical Vacancy URL, decoded Apply URL, dates, fit, stage, contacts, recruiter/interview history, feedback, application identifiers, and useful process facts when actually evidenced;
- preserve the historical substantive vacancy body in `WorkApplications/<Company>/<PositionTitle>/Position.md`;
- verify `Position.md` through Drive readback and write only its verified URL to `Vacancy file`;
- keep `Vacancy snapshot` and `Notes` concise and preserve `CLIP`/compact row height;
- recover existing CV and cover-letter artifacts when they genuinely existed and remain available.

Do not rerun fit analysis, automatic-CV generation, current-vacancy web research, or modern/reposted-vacancy reconstruction merely because migration was requested. Do not invent application events, dates, stages, contacts, or files.

## Missing cover letter repair

There is one deliberate artifact-repair exception to pure archival behavior.

If a tailored CV for a vacancy already exists, is linked in the tracker, is available in the chat, or is successfully recovered during migration, then the canonical application pack must also contain the cover-letter TXT even if the old chat never created it.

When the CV exists and the cover letter is missing:

1. do **not** create or redesign the CV merely because migration is running;
2. use the historical vacancy in `Position.md` plus verified CV/profile evidence as the factual basis;
3. draft the cover letter in the vacancy language;
4. load and apply the current matching cached humanizer from `WorkApplications/_skills/` exactly as required by `SKILL.md` and live `Agent Instructions`;
5. save only final letter text as `Anton_Nazarov<PositionTitle>.txt`;
6. verify the TXT through Drive readback;
7. write its verified Drive URL to `Cover Letter`.

This rule completes an already-existing CV/application pack. It must **not** trigger creation of a new CV for a vacancy that never had one.

If the user explicitly declines cover-letter creation for a vacancy, respect that instruction and report the pack as intentionally incomplete rather than fabricating the artifact.

## Delete-safety gate

Before saying the old chat is safe to delete, verify the affected Sheet rows and Drive artifacts.

If a tailored CV exists for a migrated vacancy, migration is not complete until the canonical cover-letter TXT also exists and its verified URL is stored in `Cover Letter`, unless the user explicitly declined it.

End with exactly one of:

`MIGRATION COMPLETE — SAFE TO DELETE THIS CHAT`

`MIGRATION INCOMPLETE — KEEP THIS CHAT`

`NO UNIQUE MIGRATION DATA — SAFE TO DELETE THIS CHAT`

Do not write Upwork, NeedleBit, freelance-client, RFP, consulting-delivery, or agency-opportunity data into this employment tracker.