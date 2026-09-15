# KC ZIL — business outcomes debrief

**Date captured:** 2026-09-15  
**Source type:** first-person debrief from Anton Nazarov in ChatGPT conversation  
**Purpose:** capture measurable business and operating outcomes that emerged after reviewing ZIL work through delegated assignments, service operations and cross-functional processes.

## Evidence status

This file records Anton's direct recollection. Treat exact numbers as first-person evidence until independently supported by presentation, reports, GLPI exports, procurement records or other stored documents.

The main value of this debrief is that it converts previously technical-looking work into business outcomes: service speed, reduced demand, staffing economics, business continuity, security risk reduction, procurement efficiency and cross-department process control.

---

## 1. Service transformation: from unavailable support to rapid response

Anton inherited a support model where requests could remain unresolved for very long periods; he recalls some issues remaining open for months or even years, and employees in some cases using personal laptops because assigned workstations remained unusable.

After restructuring support, introducing HelpDesk, remote support and explicit prioritization:

- routine issues were often resolved in approximately **10–15 minutes**;
- the internal SLA target was reduced to approximately **30 minutes** for response / handling of relevant incidents;
- many tasks that previously consumed half a day because a technician had to walk to the user could be solved remotely almost immediately;
- users were asked for feedback after support interactions;
- work was prioritized by urgency and business impact instead of by who found an IT person in the corridor.

This is strong evidence of **service-level improvement, remote-support leverage and measurable operating discipline**.

---

## 2. Demand reduction through training and service analytics

At the start of the transformation, Anton first gathered IT complaints / requests through a Google Form in order to create categories, set priorities and understand demand before formalizing the HelpDesk taxonomy.

Anton recalls monthly request volume initially at roughly **300–600 requests**, later falling toward roughly **100–300**, and eventually stabilizing around approximately **150**.

According to his account, the decline was not simply lower activity. It followed:

- employee training in information security and technical literacy;
- repeated analysis of request types;
- separation of genuine IT incidents from user-training / professional-software questions;
- creation of standardized procedures and knowledge;
- better prioritization and clearer service boundaries.

A notable example was accounting, where ticket analytics showed a high share of issues that were not actual system failures but usage questions. The team continued to support the users while using the data to identify where training could reduce recurring demand.

This is evidence of **using service analytics to reduce avoidable demand rather than merely processing more tickets**.

---

## 3. Rapid workstation replacement and data continuity

Anton deliberately moved users away from treating individual workstations as personal data stores.

The operating model became:

- users authenticated through Active Directory;
- working data was stored on centralized / backed-up network storage rather than local disks;
- standardized endpoints could be swapped quickly when hardware failed;
- users could sign in on a replacement workstation and continue with access to the same data.

This reduced dependency on a specific physical computer, lowered data-loss risk and supported faster recovery from endpoint failure.

The change met resistance because staff were accustomed to personal control of their machines and local data, but the policy was enforced through organizational rules and eventually adopted.

Executive interpretation: **business continuity and data-governance redesign, not workstation administration**.

---

## 4. IT staffing economics and use of fractional expertise

Anton states that the IT payroll increased in nominal terms because the organization gained more real capability, but the team was structured far below the cost of staffing every competency as a full-time market hire.

Approximate monthly figures recalled by Anton:

- Anton as department head: ~RUB **150k** at ZIL; he estimates market cost for equivalent capability at ~RUB **300k**;
- fractional / remote DevOps: ~RUB **35k**, compared with an estimated ~RUB **250k** for a full-time on-site specialist of similar depth;
- first-line / documentation specialist: ~RUB **34k**, compared with an estimated ~RUB **60k** for a full-time equivalent;
- on-site technician / multi-skilled technical staff: roughly **RUB 60k–80k** depending on role;
- installation capability was partly drawn from adjacent organizational units rather than duplicated as permanent IT headcount.

Anton describes the result as a small team covering a four-floor institution of roughly 200 people, including support, infrastructure, licensing, security, physical systems, business applications and modernization.

These market comparisons are **self-reported estimates** and should not be presented as hard savings without stronger support. The safe executive conclusion is that Anton **used fractional and shared specialist capability to obtain deeper expertise without building a fully staffed high-cost internal department**.

---

## 5. IT reputation and organizational trust

Anton states that after the service transformation the IT function became perceived internally as one of the organization's most effective departments.

This created a secondary organizational effect: IT's visible efficiency sometimes highlighted slower performance elsewhere, but the credibility gained through reliable delivery made it easier to expand IT-led process change into other departments.

This reinforces the previously captured causal chain:

`service reliability -> transparency -> trust -> mandate for cross-department transformation`

---

## 6. Reuse of ITSM for event operations and cross-department coordination

Anton extended the GLPI / structured-request pattern beyond support.

For events, the team created a process where one submitted event request could automatically generate the required work / resource requests for relevant internal departments and specialists.

The resulting operating model included:

- a common event request rather than separate phone / email conversations;
- assignment of required specialists and equipment;
- equipment reservation;
- request status and statistics;
- a shared event grid / schedule across departments.

Before this, departments often worked through phone calls, email or separate spreadsheets that were not shared consistently between managers, so relationships between events, resources and departmental work were frequently lost.

This is strong evidence of **business-process automation and cross-functional operating-model redesign**, not only HelpDesk reuse.

---

## 7. Lifecycle strategy proved superior to mandated replacement purchase

Anton recalls that after the team extended older computers through targeted component upgrades, a top-down purchase of several new low-cost computers was still imposed.

The purchased machines delivered worse practical performance than the upgraded older workstations and came with Linux, making them unsuitable for some office applications that required Windows.

The team repurposed them for public-library internet access, where Linux and kiosk-like use were appropriate. This both salvaged the procurement decision and reduced malware / persistence risk on public machines.

The episode reinforces two executive patterns:

- lifecycle / fit-for-purpose decisions can outperform blanket "new is better" procurement;
- poor-fit purchases can be repurposed instead of written off as sunk cost.

---

## 8. Asset reconstruction and accounting effect

Anton recalls that much of the workstation fleet had fully depreciated accounting value. Working with accounting, the team rebuilt computers from existing components and treated the reassembled sets as newly created asset configurations with renewed accounting value / depreciation treatment.

Anton describes the economic effect as creating usable asset value internally from hardware whose prior accounting value had effectively fallen to zero.

This is potentially strong evidence of **asset lifecycle and accounting coordination**, but the exact accounting treatment and legal characterization should not be claimed in a CV without supporting accounting documentation.

CV-safe framing remains:

- extended useful life of fully depreciated equipment;
- coordinated technical reconstruction with accounting treatment;
- avoided unnecessary replacement CAPEX.

---

## 9. Procurement scope and total-cost decisions

Anton estimates that roughly **RUB 7–8m** of IT-related procurement may have passed through his responsibility, but he is not certain enough of the figure for it to be treated as verified.

His responsibility covered the full cycle:

- supplier search;
- technical requirements;
- procurement process / 223-FZ coordination;
- receipt / acceptance;
- team installation / implementation;
- final accountability for the result.

Concrete example: a procurement contained a tool priced at roughly RUB 20k when an alternative might have cost around RUB 5k. Anton chose not to split the procurement because the additional tender / procurement cycle would have consumed roughly a week of the procurement department's work and created greater organizational cost than the unit-price difference.

Anton estimates that this kind of total-cost decision saved at least roughly **RUB 100k** in organizational effort in that case, but this is a retrospective estimate, not documented accounting savings.

The CV-safe executive signal is **full-cycle procurement ownership and total-cost decision-making rather than lowest-unit-price optimization**.

---

## 10. CRM implementation and organizational resistance

The CRM research / pilot effort ultimately led to partial implementation of **Bitrix24**.

Anton recalls that several alternatives were evaluated and that selection / rollout was complicated by leadership reversals and internal resistance from a department that controlled partner contacts and feared losing organizational leverage if those contacts became institutional data rather than personal knowledge.

This is strong evidence that CRM adoption was not primarily a technical problem. It involved:

- stakeholder incentives;
- ownership of customer / partner data;
- resistance to transparency;
- executive sponsorship instability;
- partial adoption despite organizational resistance.

This is useful CTO / CIO evidence for **change management and business-system adoption under political resistance**.

---

## 11. License management: from outages to planned procurement

Before centralized license tracking, the organization could discover that a license had expired only after work stopped.

After the team registered licenses, keys and certificates in GLPI with renewal dates and reminders, renewal work could begin approximately three months before expiration.

Anton confirms the executive outcome as:

> licensing moved from emergency interruption to a planned procurement cycle.

This is strong CV-safe evidence.

---

## 12. Identity lifecycle: large stale-account exposure removed

Anton recalls finding **more than 160 email accounts / accounts associated with former employees** that remained active after those employees had left, often with old passwords.

The team subsequently introduced controls including stale-account monitoring and HR-to-IT synchronization so accounts could be disabled as part of employee offboarding.

This is strong evidence of:

- security-risk discovery;
- joiner / mover / leaver governance;
- identity lifecycle automation;
- removal of inherited access exposure.

The exact `160+` figure is first-person recollection and should be verified if documentary evidence becomes available, but it is suitable as user-confirmed evidence for targeted CV work if Anton is comfortable defending it in interview.

---

## 13. CCTV and incident investigation

Anton recalls at least approximately **three theft incidents** where the rebuilt CCTV / retention capability was used in real investigations.

The organization provided recordings / images to police investigators and in some cases property was recovered.

This converts the CCTV work from installation into a business / security outcome:

- incident evidence became available when theft occurred;
- investigations could be supported;
- physical-loss risk became more manageable.

---

## 14. Access control and working-time data

The access-card system was restored and personal cards were reissued, with policy changes intended to prevent employees from admitting others on their own credentials.

Access events were linked to HR / working-time processes and gave management additional attendance / access data.

Anton notes that this area was politically / legally sensitive because overtime was not always paid, so the existence of data should not be turned into a broad compliance or HR-efficiency claim without more context.

CV-safe framing: **restored access-control governance and connected physical access data with HR processes for better auditability**.

---

## 15. Paid streaming

Anton owned the technical enablement of paid event streaming during COVID, but commercial revenue / ticket sales belonged to another department and Anton did not receive reliable financial results.

Therefore the CV should claim **launch of a monetizable digital event channel / capability**, not revenue growth from streaming.

---

## 16. Website modernization

The new website was part of repositioning ZIL from the image of an aging public institution toward a modern cultural center with stronger youth appeal.

Anton and the team benchmarked modern cultural-center websites, including international examples, and worked on design / product concepts accordingly.

No reliable traffic or conversion metrics were recalled in this debrief. The value is therefore **brand / audience-positioning and digital-experience modernization**, not a quantified acquisition result.

---

## Highest-value new business outcomes for CV use

The strongest newly surfaced outcomes are:

1. **Support speed:** routine issues often reduced from half-day / highly delayed handling to ~10–15 minutes, with a ~30-minute internal SLA target.
2. **Demand reduction:** request volume recalled as falling from ~300–600 toward ~150 as training, standardization and service analytics reduced avoidable tickets.
3. **Business continuity:** centralized user data and standardized endpoints enabled rapid workstation replacement without losing user access to working data.
4. **Cross-department automation:** one event request triggered coordinated work, equipment reservation and shared scheduling across multiple internal services.
5. **License continuity:** renewals moved from surprise expirations / stoppages to a planned procurement cycle.
6. **Identity-risk reduction:** more than 160 stale former-employee accounts / mailboxes were discovered and the offboarding process was automated.
7. **Security outcome:** CCTV evidence supported approximately three theft investigations and property recovery in some cases.
8. **Change management:** CRM adoption reached Bitrix24 despite internal resistance rooted in ownership of partner-contact information.
9. **Staffing economics:** fractional / shared specialist model provided senior capability far below the cost of a fully staffed equivalent team, though exact market-savings claims need stronger support.

The next evidence pass should focus on:

- department-by-department digital transformation;
- decisions that leadership initially resisted but later accepted;
- examples where Anton deliberately stopped, killed or redirected projects because the economics or operating model were wrong;
- measurable outcomes of the event-request / cross-department workflow;
- any budget, headcount or time savings created outside IT itself.
