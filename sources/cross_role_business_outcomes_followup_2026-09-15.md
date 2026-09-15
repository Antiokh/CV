# Cross-role business outcomes follow-up

**Date captured:** 2026-09-15  
**Source type:** first-person debrief from Anton Nazarov in ChatGPT conversation  
**Purpose:** preserve additional business-outcome evidence surfaced after the first cross-role debrief. This file supplements `cross_role_business_outcomes_debrief_2026-09-15.md` and the ZIL debrief files.

## Evidence status

Facts below are Anton's direct recollection unless otherwise noted. Exact monetary, usage and scale figures are first-person evidence and should be used in CVs only where Anton is comfortable defending them in interview. Provenance stays in `sources/`; public CV text must contain only the relevant fact and result, not source-language such as `documented`, `according to evidence`, etc.

---

## 1. ZIL — stopping a purchased CRM and switching platforms

ZIL purchased / committed approximately **RUB 90k** to Bitrix24 during CRM experimentation. After testing, Anton concluded that the system was too complex for the institution's users and adoption context.

Rather than continue investing because money had already been spent, the team stopped the Bitrix24 path and moved toward **Pyrus** for process / workflow use.

Executive interpretation:

- willingness to stop a sunk-cost technology choice;
- adoption and organizational fit treated as decision criteria, not only feature completeness;
- technology-investment de-risking through testing and willingness to change direction after purchase.

Do not frame this as `saved RUB 90k`; the money was already spent. The value is avoiding further investment in a poor-fit platform.

---

## 2. Directorate / MosRazvitie — reporting architecture details

Anton clarifies that report generation was performed **server-side**.

The old approximately **5-hour** case referred specifically to one large **events report**, not to every report in the system. Before the redesign, this large report was realistically generated about **once per day**.

After the redesign:

- the system generated approximately **200–300 reports per working day** according to system logs;
- institutions could generate the same reports with visibility restricted to their own organization;
- the Directorate could answer urgent requests using current centralized data rather than running a separate manual collection from institutions;
- the system supported both centralized management and self-service institutional reporting.

CV-safe interpretation:

> Turned MosRazvitie into a high-throughput self-service reporting platform: a major events report that previously took about five hours and was effectively run once a day was redesigned into server-side reporting, while the platform handled roughly 200–300 report runs per working day across the Directorate and institutions.

Do not imply that every one of the 200–300 reports previously required five hours.

---

## 3. Directorate / MosRazvitie — urgent management requests and funding relevance

Anton states that practically any urgent request concerning **equipment or events** could be answered from MosRazvitie rather than by asking institutions to compile new data manually.

The system was used for planning and management decisions. In particular, **event volume / number of events influenced funding and planning**.

This strengthens the executive interpretation from `reporting system` to **management information infrastructure supporting sector-wide planning and resource allocation**.

CV-safe phrasing should avoid claiming that Anton personally allocated funding; his system supplied the information used in those decisions.

---

## 4. Directorate / MosRazvitie — event lifecycle

Anton confirms that event records could pass through a practical lifecycle in the platform:

**plan -> approval -> assignment of responsible staff -> event delivery -> report / attendance**.

This supports describing MosRazvitie as having ERP-like operational workflow for part of the sector's activity rather than being only a static reporting database.

---

## 5. Moscow Social Development Agency — greenfield scale

Anton recalls that the greenfield office / IT rollout covered approximately **100 workstations / users**.

There was no single formal go-live deadline; the mandate was effectively **ASAP** for a newly created organization.

The team built / enabled the operating IT environment under that urgency: workplace rollout, network, domain, policies, software, office equipment and support capability.

CV-safe executive interpretation:

> Helped stand up the IT function and workplace environment for approximately 100 users in a newly created organization, building the core infrastructure, identity, endpoint and support model from near-zero under an ASAP operating mandate.

---

## 6. NeedleBit — Xano project and complete backend replacement

Anton clarifies that the previously discussed Xano case is separate from other projects.

The system **did reach production** on Xano. Later, using Anton's architectural documentation, the client was able to replace **the entire Xano backend** with an agentically developed alternative.

Executive significance:

- architecture and documentation reduced dependency on the original platform and on Anton personally;
- production logic was understandable enough to be reimplemented later;
- demonstrates handoff quality, portability and reduction of vendor / key-person lock-in even when the original platform choice was not Anton's preferred one.

This is a strong CTO proof case.

---

## 7. NeedleBit — Glide to WeWeb decision

Anton moved / advised clients away from Glide primarily because of **customization limits**.

The move to WeWeb enabled product capabilities that were difficult or impractical in Glide, including:

- map-based interfaces;
- themes;
- more convenient / controllable authentication flows;
- a proper desktop-oriented visual experience.

Executive interpretation: **platform choice based on product ceiling and future UX requirements, not framework preference**.

---

## 8. NeedleBit — durable Supabase backend

In one client project, Anton recommended and designed a Supabase backend instead of Airtable.

The frontend was later completely rewritten, while the Supabase backend remained in use. Anton states that the backend has now been operating for approximately **three years**.

This is strong evidence for:

- separation of frontend and backend concerns;
- architecture designed for replacement / evolution of the presentation layer;
- durable data / backend design;
- reduced replatforming cost.

Potential CV phrasing:

> Designed a Supabase backend that remained in production for roughly three years and survived a complete frontend rewrite without requiring the core data layer to be replaced.

---

## 9. NeedleBit — rescue pattern

Anton confirms that in at least one rescue engagement, a product previously built unsuccessfully by external developers was **rewritten** rather than patched incrementally.

The specific project, cost and recovery timeline are not currently recalled clearly enough for a quantified CV claim.

Keep this as evidence of **turnaround / rebuild judgment**, but do not add invented details.

---

## High-value CV implications from this follow-up

1. **MosRazvitie:** sector-wide management platform, 200–300 logged report runs per working day, one major events report reduced from ~5 hours / once daily bottleneck to server-side high-throughput reporting; data informed planning and funding decisions.
2. **ZIL CRM:** willingness to stop a poor-fit technology after ~RUB 90k sunk cost and move to a more adoptable workflow platform.
3. **Agency:** greenfield IT launch for roughly 100 users under an ASAP mandate.
4. **Xano:** production system later had its entire backend replaced from Anton's documentation, demonstrating portability and handoff quality.
5. **Supabase:** backend survived a complete frontend rewrite and has continued operating for ~3 years.
6. **Glide -> WeWeb:** platform migration driven by product customization ceiling and enabled richer map, theme, authentication and desktop UX capabilities.
