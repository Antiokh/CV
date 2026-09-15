# Cross-role business outcomes — second pass

**Date captured:** 2026-09-15  
**Source type:** first-person debrief from Anton Nazarov in ChatGPT conversation, with one external legal-context check for 2014 banking-reporting sanctions  
**Purpose:** preserve additional executive evidence surfaced after the first cross-role debrief.

## Evidence status

Unless explicitly marked as legal context, facts below are Anton's direct recollection. Exact figures should be defended in interview and independently verified where possible before being used as hard audited metrics.

---

## 1. MosRazvitie reporting architecture and throughput

Anton clarified that report generation was **server-side**.

The well-known `5 hours -> seconds/minutes` metric refers to **one large events report**, not to every report in the system.

Before the redesign, the organization could effectively produce about **one such large report per day**. After redesign, the wider reporting layer could support roughly **200–300 reports per working day** across different report types and users because report generation no longer depended on the old bottlenecked workflow.

CV-safe interpretation:

- do not multiply 200–300 daily reports by five hours;
- do state that a previously 5-hour large report became fast enough to support routine self-service reporting at sector scale.

---

## 2. MosRazvitie as sector source of truth and operating system

Institutions themselves used the same system's exports, with organization-level visibility restrictions, as a working source for their own data.

Event workflow stages in the platform included:

1. planning;
2. approval;
3. assignment of responsible people;
4. execution;
5. post-event reporting / attendance.

The platform's data affected **financing and planning** at the management level.

Anton describes the system as having evolved from a reporting portal into an industry-wide operational information platform / ERP-like layer for 100+ institutions, while still retaining strong reporting and statistical functions.

Strong executive signal: **management decisions on financing and planning depended on a governed source of truth rather than ad-hoc requests to institutions**.

---

## 3. Moscow Social Development Agency — launch mode

Anton clarified that there was no fixed formal launch deadline; the mandate was effectively **ASAP**.

The organization was brought online progressively while infrastructure, endpoints, policies, software, networking and support processes were still being built.

Do not claim `launched X users in Y weeks` until headcount / workstation count and timing are recalled or documented.

---

## 4. Settlement and Savings Bank — regulatory risk context

Anton states that before the workflow system, documents could miss deadlines for regulatory reporting / submissions, exposing the bank to financial penalties and making it difficult to identify where delays occurred.

After the system went live:

- documents **no longer got lost** inside the internal workflow;
- ownership and overdue status were traceable;
- the internal courier was no longer needed for routine internal document circulation and remained relevant only for **external** physical delivery;
- the system covered **most back-office staff**, approximately 60 users.

This supports a stronger executive framing:

> Rebuilt document control for most of the bank's back office so regulatory workflows became traceable end to end, internal documents stopped disappearing, and physical courier circulation was largely removed from internal processing.

### External legal context for 2014

A 25 February 2014 Constitutional Court ruling discussing Article 19.7.3 of the Russian Administrative Code states that failure to submit or late / improper submission of reports and other information to the Bank of Russia could carry, at that time, penalties of:

- RUB 2,000–4,000 for individuals;
- RUB 20,000–30,000 for officials or disqualification for up to one year;
- RUB 500,000–700,000 for legal entities.

This is **context only** and does not prove that Anton's bank incurred those exact penalties or that the particular delayed documents fell under that exact provision.

CV implication: describe **regulatory risk reduction**, not `saved RUB 700k`.

External reference used during debrief: Constitutional Court of the Russian Federation, decision No. 4-P dated 25.02.2014, as reproduced by ConsultantPlus.

---

## 5. NeedleBit — rescue / rewrite evidence

Anton clarified that in at least one failed-outsourcing rescue case he **rewrote the system** rather than only patching the previous implementation.

Individual project details still need to be recalled before this becomes a CV bullet, but the signal is stronger than `fixed outsourced work`: **recovery of failed external builds through re-architecture / rewrite**.

---

## 6. NeedleBit — delegated Xano implementation

Anton confirms a case where he defined / delegated a Xano-based implementation layer rather than personally carrying every part of the build.

This can support the leadership-language distinction (`I` for architecture / decision / delegation, `team` for implementation) once the exact project context and business outcome are identified.

---

## 7. Glide -> WeWeb and portability logic

Anton confirms there was at least one real client case moved away from Glide toward WeWeb, and the resulting direction remained in use.

The strategic rationale was broader functionality, lower long-term constraints and less platform dependency.

Need follow-up on the exact Glide constraint (pricing, user model, UI limitations, data / scaling, or another factor) before writing a precise CV claim.

---

## 8. Supabase backend survived frontend replacement

Anton confirms at least one case where the frontend was later rewritten while the Supabase backend he had designed **remained in production and continues to operate**.

This is strong evidence of architecture decoupling and longevity:

> Designed the backend so the client could replace the frontend later without rebuilding the data / service layer.

This is potentially one of the strongest modern architecture outcomes for CTO / Solutions Architect positioning because it demonstrates portability and reduced rewrite cost.

---

## 9. Killing a purchased CRM

Anton confirms a case where the organization **abandoned a CRM after purchase** rather than continuing to invest in a poor-fit system.

This is strategically useful evidence because it shows willingness to stop sunk-cost investment when adoption / operating fit is wrong.

Follow-up needed:

- which organization / CRM;
- how much had already been spent;
- why it failed;
- what replaced it;
- whether the replacement achieved better adoption.

Potential executive pattern: **stopped throwing money at a purchased system once evidence showed it was the wrong operating fit**.

---

## Highest-value additions surfaced in this pass

1. One large MosRazvitie events report went from ~5 hours and effectively one run/day to a reporting architecture that supported routine self-service use.
2. MosRazvitie data directly informed financing and planning.
3. Bank document workflows stopped losing documents and internal courier circulation became unnecessary for routine internal routing.
4. Bank system covered most back-office users (~60) and materially reduced regulatory-process ambiguity.
5. At least one failed outsourced product was recovered by rewrite, not superficial patching.
6. At least one Supabase backend survived a complete frontend replacement and remains operational.
7. Anton has direct evidence of terminating a purchased CRM rather than escalating sunk-cost commitment.
