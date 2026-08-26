# WorkInterviews Activity Log

This reference defines the canonical append-only event history for candidate-side employment workflows.

Spreadsheet: `WorkInterviews` (`1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao`).
Tab: `Activity Log`.

Tracker Stage is the current coarse lifecycle state. Activity Log records the detailed timeline: application emails, inbound replies, recruiter messages, assessments/case studies, interviews, follow-ups, user decisions, Stage transitions, conflicts and recovery events.

## Foreign key

Every vacancy-linked event uses the vacancy's immutable `Row ID` as the foreign key. Company and Position are denormalized display copies only.

Row moves between Queue / Active / Low fit / Closed never change Row ID, so the timeline remains attached to the same vacancy throughout the lifecycle.

## Append-only contract

- Never edit/delete an existing event merely because interpretation changes later.
- Corrections are new events with a new Event ID and an explicit correction summary.
- Event ID is UUID v4.
- Preserve event time separately from log insertion time.
- Do not rewrite/reorder the log during discovery or reconciliation.

Activity Log writes are allowed for Row IDs owned by Active / Low fit / Closed because event logging is not a vacancy-row mutation.

## Columns A:Y

1. Event ID
2. Event time
3. Logged at
4. Row ID
5. Company
6. Position
7. Event type
8. Direction
9. Channel
10. Our mailbox
11. From
12. To
13. Cc
14. Subject
15. Message ID
16. Thread ID
17. Source key
18. Stage before
19. Stage after
20. Summary
21. Match basis
22. Match confidence
23. Evidence URL
24. Raw payload
25. Created by

Unknown evidence remains blank. Never invent mailbox headers, identifiers, timestamps or content.

## Idempotency

For external events use a stable Source key:

- Gmail: `gmail:<message-id>`.
- Other providers: stable provider-specific identifier when available.

Immediately before append, search for exact Source key. If it already exists, do not append again. Thread ID is context, not idempotency: multiple messages in one thread are distinct events.

Read-before-append is not a database uniqueness constraint, so concurrent writers can theoretically race. `auditPartitionedTracker()` checks duplicate Activity Log Source keys; treat any duplicate Source key as an integrity error and reconcile by appending a correction rather than deleting history blindly.

## Gmail matching

Do not require an inbound message to share the same sender, recipient, subject or Gmail thread as the outbound application.

Use combined evidence and record it in `Match basis`:

1. exact Message/Thread evidence when available;
2. Row ID already linked to known correspondence;
3. known recruiter/contact addresses from prior Activity Log events;
4. company name and evidence-backed domain/brand aliases;
5. role/title tokens in subject/body;
6. explicit CV/application language;
7. ATS/requisition/application IDs, recruiter name or application URL;
8. temporal proximity to outbound application/prior hiring events.

A new mailbox or new Gmail thread is not negative evidence by itself.

Example: an application to `natalija.kokeric@zepter.com` can legitimately continue from `karijera@zepter.rs` in a new thread when Zepter + CTO/CTTO + explicit CV-receipt language strongly identify the same process.

If multiple vacancies remain genuinely plausible, do not guess. Leave the message unlinked and report the ambiguity.

## Mailbox/contact history

Preserve evidence-backed From / To / Cc addresses for each linked email. Filtering Activity Log by Row ID is the authoritative per-position mailbox/contact history.

Do not collapse recruiter, HR, career, ATS or personal mailboxes into a synthetic single address.

## Stage versus event semantics

Logging an event does not automatically authorize a Stage change.

Examples:

- `Application email sent` can be direct submission evidence.
- `Case study requested`, take-home assignment or online test normally supports the current `Assessment` stage when the evidence is explicit; the event itself should still be logged even if the protected vacancy row cannot be agent-mutated.
- a generic recruiter acknowledgement may be logged without advancing Stage;
- an explicit interview invitation can support `Interview`;
- explicit rejection can support a terminal Stage.

When an actual Stage transition is performed by the human/UI script, append a `Stage changed` event with Stage before/after and the user/evidence cause.

Under tracker-storage v5, agents classify and log later-stage evidence but do not write protected Active/Low fit/Closed vacancy rows.

## Gmail status workflow

1. Find candidate messages narrowly.
2. Resolve the vacancy using multi-signal evidence.
3. Append every strongly matched substantive message to Activity Log **before** deciding Stage implications.
4. Classify lifecycle evidence only when explicit.
5. If the vacancy row is protected from agent writes, report the supported transition and leave physical routing to human/UI automation.

The log is not a mailbox archive. Store concise identifying headers + summary + match rationale; avoid full sensitive message bodies unless minimum raw payload is necessary for recovery/debugging.

## Integrity and recovery

Allowed recovery event types include `Recovery snapshot`, `Conflict detected`, and `Correction`.

If a forbidden direct write blocks the Jobs aggregate, preserve the minimum displaced state as a Row-ID-linked Recovery snapshot before clearing the obstruction. Never silently discard newer information.

`auditPartitionedTracker()` checks Activity Log Source-key duplicates and orphan Row IDs alongside tracker structural checks.

## UI logging

The single canonical bound script is `scripts/workinterviews-partitioned-tracker.gs`.

Human Stage / Date applied actions and physical moves should append events using the same vacancy Row ID. UI logging never creates a replacement vacancy Row ID.
