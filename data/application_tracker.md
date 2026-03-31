# Application Tracker

This file is a lightweight kanban-style tracker for applications, interviews, take-homes, offers, and closed loops.

## Status columns

Use one of these statuses:
- `to_apply`
- `applied`
- `interview`
- `take_home`
- `offer`
- `rejected`
- `closed`

## Default fields

For each application, track:
- company
- role
- language
- source link
- current status
- date added
- last update
- notes
- compensation ask
- next action

## Suggested format

```md
- Company: Paychex
  Role: Engineering Manager
  Language: English
  Source: <link>
  Status: applied
  Date added: 2026-03-31
  Last update: 2026-03-31
  Compensation ask: EUR 3,500–4,500 net/month
  Next action: wait for reply
  Notes: strong EM fit, global company, merger context
```

## Usage rules

- Keep one entry per application or opportunity.
- Update status as the process moves forward.
- If the role is closed, set status to `closed` instead of deleting it.
- If a role is rejected, keep the entry and mark it `rejected`.
- Use `notes` for interview observations, negotiation context, and role-fit signals.

## Why this exists

The tracker lets the agent maintain a simple, reliable view of:
- where Anton has applied
- what stage each application is in
- what compensation ask was used
- what should happen next

This is the canonical place to keep a Kanban-like application log.
