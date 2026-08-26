# WorkInterviews activity log

This reference defines the append-only event history for the candidate-side employment tracker.

Spreadsheet: `WorkInterviews` (`1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao`).
Activity tab: `Activity Log`.

The tracker Stage is only the current coarse lifecycle state. `Activity Log` records the detailed timeline between Stage changes: application emails, inbound replies, recruiter messages, case studies, interviews, follow-ups, status changes, user decisions, and integrity/recovery events.

## Foreign key

Every event tied to a vacancy MUST use the vacancy's immutable `Row ID` from column W as its foreign key. Company/Position are denormalized display fields only and must not be used as durable identity.

A row move between Queue / Active / Low fit / Closed never changes Row ID, therefore historical events remain attached to the vacancy after partition routing.

## Append-only rule

`Activity Log` is append-only.

- Never edit or delete an existing event merely because a later interpretation changes.
- Corrections are new events with a new Event ID and a summary that identifies what is being corrected.
- Every Event ID is UUID v4.
- Preserve event time separately from log insertion time.
- Do not rewrite the log during vacancy discovery or reconciliation.

## Columns

A:Y:

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

Unknown fields remain blank. Do not invent recipient headers, mailbox aliases, thread IDs, dates, or message content.

## Idempotency

For external events, `Source key` prevents duplicate logging.

- Gmail message: `gmail:<message-id>`.
- Other provider events should use a stable provider-specific key when available.
- Before appending, search Activity Log for the exact Source key. If it already exists, do not append a second copy.
- Thread ID is context, not an idempotency key: multiple relevant messages in one thread are separate events.

## Gmail matching

Do not require an inbound email to share the same sender, recipient, subject, or Gmail thread as the outbound application.

Use multiple signals and record the match rationale in `Match basis`:

1. exact Gmail Message/Thread evidence when available;
2. immutable vacancy Row ID already associated with a known message/contact;
3. known recruiter/contact email addresses from prior Activity Log events;
4. company name and evidence-backed company/domain aliases;
5. position/title tokens in subject or body;
6. explicit application/CV language such as confirmation that the CV/application was received;
7. application identifier, ATS link, requisition ID, or recruiter name;
8. temporal proximity to an outbound application or prior hiring event.

A different mailbox or a new Gmail thread is not negative evidence by itself. Example: an application sent to `natalija.kokeric@zepter.com` may legitimately continue from `karijera@zepter.rs` in a new thread when the message explicitly names Zepter, CTO/CTTO, and confirms receipt of the CV.

If the evidence strongly identifies the vacancy, append the email event even when it does not justify a Stage change. If the match is genuinely ambiguous between multiple vacancies, do not guess; leave it unlinked and report the ambiguity.

## Mailbox/contact history

For every linked email event, preserve the actual evidence-backed From / To / Cc addresses. This creates a per-vacancy contact history automatically through Row ID filtering.

Do not collapse different employer/recruiter mailboxes into one synthetic address. A company may use personal recruiter mailboxes, ATS senders, HR aliases, career aliases, and different domains during one process.

## Stage versus event semantics

Logging an event does not automatically mean Stage must change.

Examples:

- `Application email sent` is direct evidence of submission, but historical Stage reconstruction still follows the lifecycle rules and explicit evidence.
- `Case study requested` is a process event even if the coarse Stage remains Recruiter screen/Interview because the Stage vocabulary has no dedicated assessment state.
- a generic recruiter acknowledgement can be logged without advancing Stage;
- an explicit interview invitation may support an Interview stage;
- explicit rejection supports a terminal Stage under the existing lifecycle rules.

When a real Stage transition occurs, append a `Stage changed` event with Stage before / Stage after and the evidence or user action that caused it.

## Gmail status checks

A Gmail status workflow should first resolve candidate messages, then link every strongly matched message to Activity Log before deciding whether the canonical vacancy Stage needs a change. This prevents useful correspondence from disappearing merely because it does not fit the Stage enum.

The log is not a mailbox archive: save concise summaries and identifying headers, not full sensitive correspondence unless a raw payload is specifically required for recovery/debugging.

## Integrity/recovery events

Tracker repair may append `Recovery snapshot`, `Conflict detected`, or `Correction` events. Raw payload may contain the minimum structured state needed to prevent data loss. This is especially appropriate when a forbidden direct write is found in the Jobs aggregate spill range: preserve the orphan data in the log before clearing the read-only view.

## UI / Apps Script logging

Bound Apps Script routing should append an Activity Log event for human Stage/Date-applied actions and row moves. The event must use the same Row ID and describe the source/destination Stage or partition. UI logging must never create a new vacancy Row ID.
