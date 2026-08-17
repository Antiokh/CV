# Vacancy discovery workflow

This reference is mandatory for CV-mode vacancy discovery, scheduled job scans, and any request to find new employment opportunities for Anton.

## Live source inventories

Do not hardcode the job-board or employer lists in this repository. The canonical live inventories are Google Sheet `WorkInterviews` (`1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao`):

- `Job Sources` — job boards, aggregators, ATS directories, Serbia-specific sources, remote boards, and other vacancy-search sources. Read the current rows before every discovery run and use the listed URLs as the coverage checklist. Respect relevance notes; low-relevance sources may be deprioritized, but do not silently replace the inventory with LinkedIn recommendations or a memorized subset.
- `RU-root Companies` — companies with Russian-speaking / ex-USSR / Russian-root international hiring relevance and their current careers URLs. Read the current rows before every discovery run and inspect the listed careers pages in addition to general job boards.

Because these inventories are maintained live in the Sheet, newly added rows become part of the next search automatically without a repository change.

## Discovery sequence

1. Read hidden `Agent Instructions` when the run will write to the tracker.
2. Read `Job Sources` and `RU-root Companies` fresh from `WorkInterviews` before searching.
3. Search the relevant `Job Sources` URLs for Anton's target roles and allowed geography/work model. Treat the Sheet as the coverage checklist; do not rely only on LinkedIn, search-engine results, or recommendation feeds.
4. For every `RU-root Companies` row with a blank `Blocker`, inspect the listed `Careers URL` for relevant open roles. Prefer the official/current careers page over a generic company homepage or LinkedIn fallback when both are known.
5. Before recommending, ingesting, or preparing an application, deduplicate against canonical `Jobs` by Vacancy URL and normalized Company + Position and apply the normal vacancy workflow.
6. Record material broken/stale source URLs when encountered so the inventories can be repaired rather than repeatedly retried.

## Company blocker / rejection cooldown

`RU-root Companies!Blocker` is a company-level stop signal for discovery/outreach.

- A non-empty `Blocker` means: skip the company's careers scan, do not recommend applying, and do not initiate referral/recruiter outreach unless Anton explicitly overrides the blocker.
- A confirmed `Rejected` stage in `Jobs` for a company present in `RU-root Companies` creates a default 90-calendar-day company cooldown from the rejection/last-contact date. Store a concise blocker such as `Rejected YYYY-MM-DD — cooldown until YYYY-MM-DD — <position>`.
- If several confirmed rejections exist, use the latest one and extend the cooldown from that date.
- An explicit user instruction not to pursue a company may create an indefinite blocker; state the reason/date instead of inventing an expiry.
- Do not create a blocker from silence, a generic talent-pool message, an application receipt, or an ambiguous status.
- When the cooldown has expired, verify the latest `Jobs` evidence before clearing the blocker. Clear/override immediately if Anton explicitly instructs it.
- When a new confirmed rejection is recorded in `Jobs`, update the matching `RU-root Companies` blocker in the same workflow when that company is present in the corporate inventory.

The blocker is company-level by design: its purpose is to avoid wasting effort by immediately knocking on another door at an employer that has just rejected Anton.