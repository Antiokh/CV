# WorkInterviews tracker storage v4 — DEPRECATED

**DO NOT USE THIS FILE AS AN OPERATIONAL INSTRUCTION.**

Tracker storage v4 is retained only as migration history. It is superseded by:

- `GPT/work-application-manager/references/tracker-storage-v5.md` for the current vacancy storage, Queue-only agent write boundary, structured salary contract, and UI routing;
- `GPT/work-application-manager/references/activity-log.md` for correspondence/process history;
- `GPT/work-application-manager/scripts/workinterviews-partitioned-tracker.gs` for the single simple `onEdit` UI automation.

In particular, every old v4 instruction that told agents to write to `Active`, `Low fit`, `Closed`, or `Jobs`, perform cross-tab copy/delete moves, write literal salary values to F/AF, or emulate UI routing through the Sheets API is obsolete and unsafe.

Do not copy rules from this file into prompts, runtime bundles, migration workflows, or Agent Instructions.
