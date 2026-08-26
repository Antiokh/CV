# WorkInterviews salary normalization v6

This is the current hard salary-research and normalization override for candidate-side employment workflows. It supersedes conflicting salary instructions in `work-application-manager/SKILL.md`, `tracker-storage-v5.md`, older tracker references, and any rule that allows a reviewed candidate vacancy to remain without a defensible salary calculation merely because the employer did not publish compensation.

Spreadsheet: `WorkInterviews` (`1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao`).

## Hard completion rule

Salary research is mandatory workflow work, not optional enrichment.

- A Queue vacancy must not remain in `Reviewed` or `CV ready` unless its matching `Salary Data` row has `Normalization status = OK`.
- This `Reviewed` / `CV ready` salary gate applies regardless of Fit %.
- For displayed Fit >60%, salary is also mandatory before the vacancy may be reported as successfully processed/complete or its application pack may be treated as complete.
- `To review` may temporarily contain incomplete salary work while research is still in progress.
- A vacancy moved to terminal `Not a fit` / `Closed` before review may skip unfinished salary research.
- Never report a vacancy as reviewed, ready, or complete while the salary gate is unresolved.

`No salary published` is not a waiver. It is a trigger to research and calculate a defensible market estimate.

## Evidence hierarchy

Use the strongest evidence available, in this order:

1. exact employer disclosure for the exact role/location;
2. exact role disclosure on another current employer/ATS/job-board copy;
3. same-company comparable role with similar level, function, geography and contract model;
4. current market benchmarks matched to geography, seniority, work model and contract type;
5. a close role/geography proxy with explicit caveats.

Prefer a direct employer/role disclosure whenever available. When no exact disclosure exists, use at least two independent current market sources when reasonably available and reconcile them into one defensible range. If only one credible source exists, record the limitation and confidence in the salary note. A weak, stale, geographically mismatched, or seniority-mismatched single source is not enough to mark salary complete.

Do not copy a broad source range mechanically when it clearly spans multiple levels or markets. Narrow/reconcile it only when the evidence supports doing so, and document the reasoning in the salary note.

## When evidence is insufficient

Do not guess merely to satisfy the gate.

If a defensible two-sided range, currency, NET/GROSS basis, or FX rate cannot be established after research:

- keep the vacancy in `To review`;
- keep `Salary Data` status non-OK;
- record which sources were checked and the exact blocker;
- do not create a fake bound, tax basis, currency, or conversion;
- do not claim the vacancy is reviewed, ready, or complete.

A one-sided employer range such as `from 7000` or `up to 9000` is not a complete range. Find a defensible second bound from supporting evidence or leave salary incomplete.

## Canonical structured salary schema

Hidden `Salary Data` is keyed by immutable vacancy Row ID.

| Col | Field | Contract |
|---|---|---|
| A | Row ID | exact immutable vacancy Row ID; unique |
| B | Range min / month | native numeric monthly amount in source currency |
| C | Range max / month | native numeric monthly amount in source currency |
| D | Currency | 3-letter ISO code; use `RSD`, not `DIN` |
| E | Type | exactly `NET` or `GROSS` |
| F | FX EUR per unit | static numeric EUR per one source-currency unit |
| G | Range min EUR/month | derived |
| H | Range max EUR/month | derived |
| I | Midpoint EUR/month | derived |
| J | Normalization status | derived integrity status; must be `OK` for completion |
| K | Legacy estimate text | read-only migration audit |
| L | Legacy midpoint EUR/year | read-only migration audit |

B:F are the canonical inputs. G:J are formulas. K:L are legacy audit only and must not be populated for new vacancies.

Agents may insert/update `Salary Data` only for a Row ID whose vacancy currently exists in Queue. Upsert by exact Row ID; never create a second salary row for the same vacancy. Salary Data remains linked externally by Row ID when Apps Script later moves the vacancy to Active / Low fit / Closed.

## Mandatory monthly calculation

The agent must calculate the monthly source-currency range; quoting the original salary string is not sufficient.

- annual -> divide by 12;
- weekly -> multiply by 52/12;
- hourly -> multiply by 2080/12;
- true fixed monthly compensation -> min = max;
- one-sided range -> find a defensible second bound or leave incomplete;
- do not include equity in B/C;
- bonus, OTE, commission, equity and compensation-composition caveats belong in the visible salary note.

The salary note must preserve the original disclosed amount/range and period so the monthly conversion can be audited.

## NET / GROSS semantics

`Salary Data` Type must be exactly `NET` or `GROSS`.

- `NET` means take-home compensation after personal taxes/contributions.
- `GROSS` means compensation before personal taxes/contributions.
- For B2B/contractor compensation, use `GROSS` for the invoice/base amount before personal/business taxes and excluding VAT, and explicitly state the B2B/contractor basis in the note.
- Never silently convert NET to GROSS or GROSS to NET.
- If the tax basis is genuinely unclear, continue research or leave salary incomplete.

Do not treat `total compensation`, `OTE`, or equity-inclusive numbers as base salary without evidence. If the only available source is total/OTE, document composition and derive/store B/C only when the cash basis and NET/GROSS interpretation are defensible.

## Mandatory EUR calculation and static FX

Every complete salary must resolve to EUR/month.

- EUR uses FX = `1`.
- For non-EUR salary research, store one verified point-in-time `EUR per source-currency unit` rate in Salary Data F.
- The rate must be sourced and dated in the visible salary note.
- Keep the rate static; never use `GOOGLEFINANCE` or another live FX formula for canonical history.
- G/H/I and canonical AF are derived from B/C/F and must be read back after the write.

Historical salary values must not drift with current exchange rates.

## Visible salary field and provenance note

Canonical tracker F is `Estimated salary (EUR/month)` and is formula-derived. Never write a literal value into it.

Example display:

- `€4.5k–6k gross/mo`
- `€950–1.2k net/mo`

Canonical AF is the formula-derived numeric `Salary midpoint EUR/month`; heatmaps use AF.

Write salary provenance as the native note on visible F. The note must include:

- research date;
- salary source URL(s);
- whether the source is exact employer disclosure or a proxy/market estimate;
- original amount/range, source currency and source period;
- NET/GROSS basis;
- monthly normalization method when source period was not monthly;
- FX source, rate and rate date for non-EUR data;
- geography, seniority, work-model and contract-type caveats;
- material bonus/OTE/equity caveats;
- evidence confidence when the estimate relies on proxies.

Do not bury salary provenance only in general Notes; F's native note is the canonical salary provenance surface.

## Completion readback — mandatory

Before reporting salary work complete, read back the exact Row ID from both Queue and Salary Data.

Completion requires all of the following:

1. one unique Salary Data row for the vacancy Row ID;
2. native numeric B, C and F;
3. B <= C;
4. valid ISO Currency;
5. Type exactly NET or GROSS;
6. derived G/H/I present;
7. Salary Data J exactly `OK`;
8. visible Queue F computed in EUR/month;
9. canonical AF is a native numeric EUR/month midpoint;
10. Queue Z is `OK` when the vacancy is being claimed reviewed/ready/complete.

Do not bypass the readback by hardcoding F, AF, J, or Queue Z.

## Salary expectation remains user-only

`Salary expectation` is separate from market salary research. Populate it only from Anton's explicit current confirmed expectation. Never infer it from Salary Data, vacancy disclosure, or market benchmarks.
