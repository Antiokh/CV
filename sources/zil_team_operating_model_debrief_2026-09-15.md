# KC ZIL — team operating model and delegated delivery debrief

**Date captured:** 2026-09-15  
**Source type:** first-person debrief from Anton Nazarov in ChatGPT conversation  
**Purpose:** capture how the ZIL IT function was staffed, delegated and operated in practice, supplementing `sources/zil.md` and `sources/zil_executive_debrief_2026-09-15.md`.

## Evidence status

This file records Anton's direct recollection. It is first-person evidence, not independent documentary verification. The exact canonical headcount should continue to come from the stronger repository evidence already used in CVs (**5 IT staff + 2 installation engineers** at the documented management scope). The role mix below describes staffing changes, delegation and areas of ownership and should not be interpreted as proof that every named capability was staffed simultaneously at all times.

The debrief is especially useful because it distinguishes **director-level decisions and ownership** from **team execution**. Anton describes a recurring management pattern: he would diagnose a problem, select an approach, start implementation together with the relevant specialist, establish the operating model and then delegate continuing execution to the owner of that function.

---

## 1. Initial support problem and staffing intervention

Anton inherited a support employee who, in his account, was not reliably processing requests and had effectively no meaningful SLA performance.

Anton terminated that arrangement and rebuilt the capability mix rather than replacing the person with a single generic technician. The staffing model included, at different points:

- a documentation / Service Desk / business-systems specialist;
- an on-site endpoint / workplace-technology specialist who also had web/design capability;
- a remote fractional DevOps / infrastructure specialist with deeper systems expertise than the budget would have allowed for a full-time equivalent;
- installation / low-voltage / facilities-technology capability for cabling, CCTV and related physical systems.

The management logic was to use scarce payroll on differentiated specialist capabilities, with limited overlap for resilience, instead of paying for several broad generalists.

This is evidence of:

- personnel decision-making;
- team and capability design;
- use of fractional expertise;
- cost-aware staffing;
- explicit functional ownership;
- delegation and handoff design.

---

## 2. Service management, documentation and SLA model

Working with the documentation / Service Desk specialist, Anton:

- rewrote job descriptions and clarified responsibilities;
- introduced HelpDesk as the system of record for incoming support work;
- documented recurring request types;
- assigned service expectations / SLA targets to request types;
- created a documentation base so routine support did not depend on informal memory;
- used the specialist as first-line HelpDesk owner and for equipment/request records;
- delegated parts of supply/procurement coordination when appropriate.

The executive interpretation is not "installed HelpDesk". It is **replacing person-dependent support with a documented service model: catalogued demand, ownership, SLA, records and repeatable execution**.

---

## 3. Asset inventory, accounting coordination and lifecycle extension

Anton and the documentation / asset specialist conducted a full equipment inventory and separated assets into categories:

- equipment that could no longer be economically restored and should be written off;
- equipment that could be extended with low-cost component replacement;
- equipment that had to be purchased or replaced.

Anton recalls that most equipment had exceeded its normal service / depreciation period. Instead of treating accounting age as an automatic trigger for full replacement, the team worked with accounting records, asset composition and targeted component replacement to extend useful life where economically rational.

Typical physical interventions included replacing the most failure-prone components such as cooling fans and hard drives. The detailed accounting treatment described by Anton (including regrouping components / kits and renewed depreciation treatment) should **not** be converted into a legal or accounting compliance claim in a CV unless supporting accounting documents are added.

What is CV-safe:

- full inventory and reconciliation;
- write-off of unrecoverable assets;
- lifecycle-extension strategy;
- coordination with accounting;
- targeted modernization instead of blanket replacement;
- CAPEX avoidance already captured separately in the executive debrief.

---

## 4. CRM / business-systems research, pilots and adoption testing

Anton delegated substantial field research to the documentation / business-systems specialist while retaining product / selection responsibility.

The process described was:

1. collect operational data and requirements from event and client-facing departments;
2. structure the initial data in Excel;
3. identify several CRM candidates;
4. compare candidate systems together, including options found by both Anton and the specialist;
5. conduct field testing with actual employees;
6. test usability, fit, load / operational limitations and failure modes;
7. eliminate systems that could not meet requirements;
8. use trials / pilots before committing to a vendor.

Anton describes this as substantial market research and R&D around CRM selection.

This is strong evidence for:

- business-process analysis;
- requirements discovery;
- product / vendor research;
- CRM implementation strategy;
- user pilots and adoption testing;
- build/buy/select decisions;
- cross-functional facilitation.

It supports retaining CIO CV language around **business-process redesign and automation** and **CRM / ERP / business-applications implementation, integration and adoption**.

---

## 5. Paid streaming and digital event capability

Anton and the same specialist helped establish a higher-quality paid streaming capability for events.

The debrief includes:

- procurement of dedicated streaming equipment;
- a commercial streaming / ticketing platform relationship;
- Restream;
- HDMI conversion / capture equipment to obtain higher-quality feeds from dome cameras;
- operational use during the COVID period as a new digital event format.

CV-safe executive framing:

> The team launched paid streaming as a new digital event capability during COVID, combining event production, ticketing and online distribution.

The specific hardware belongs in evidence, not executive CV copy unless a specialist role requires it.

---

## 6. Endpoint modernization and delegated field execution

The on-site workplace-technology specialist owned most hands-on endpoint work after Anton defined the modernization approach.

Execution included:

- replacement of failed / worn storage components;
- license checks;
- clean OS reinstall / reimaging across rebuilt workstations;
- application of standardized software, settings and security configuration;
- hands-on work required by the lifecycle-extension program.

Anton occasionally joined difficult work, but describes the specialist as the primary executor. This directly supports the leadership-language rule used in the CVs:

- **I** for lifecycle strategy, standards and prioritization;
- **my team** for endpoint rebuild and rollout.

---

## 7. Automated endpoint configuration and personal-data controls

Together with the remote DevOps specialist and on-site technician, the team automated rollout of:

- software;
- settings;
- security policies;
- access to remote / information resources;
- protection controls;
- personal-data handling controls.

For higher-risk public computers, the team introduced kiosk-like / session-reset behavior so user data was removed after a session rather than remaining on a public endpoint.

This is evidence of:

- endpoint governance;
- configuration standardization;
- automated rollout;
- privacy-by-operations controls;
- security policy enforcement.

---

## 8. Remote DevOps model and infrastructure reconstruction

Anton deliberately used a remote fractional DevOps specialist because the organization needed deeper infrastructure expertise than it could economically obtain from a generic on-site technician.

Anton and the on-site team provided secure remote access to the technology environment, while duties were split clearly:

- physical / hands-on execution remained with the on-site specialist;
- remote systems, infrastructure and configuration work belonged to the DevOps specialist;
- work was coordinated through tickets and team communication channels.

The DevOps/infrastructure work described includes:

- reconfiguration of network storage;
- access segmentation so users saw only appropriate resources;
- rebuild / improvement of shared drives;
- domain-system changes;
- mail integration changes;
- password-security monitoring;
- monitoring of stale / obsolete accounts;
- synchronization between HR and IT so user accounts could be disabled automatically when employees left;
- server and storage migration;
- software upgrades / clean reinstall where required.

This is particularly strong CIO evidence because it shows **identity lifecycle, joiner/mover/leaver controls, least-privilege access, infrastructure modernization and a deliberate remote-specialist operating model**.

---

## 9. Server / storage recovery and migration

Anton recalls a storage / server hardware failure that required replacement of drives and a broader migration / rebuild.

The DevOps specialist, on-site specialist and Anton worked together when necessary, with most technical execution delegated to the specialists.

The work included:

- replacement of server drives;
- migration to new storage arrays / disks;
- software upgrades;
- clean reinstall of some server software where necessary.

CV-safe framing is business continuity / infrastructure recovery rather than detailed disk replacement.

---

## 10. CCTV, physical security and access control

The installation / physical-infrastructure specialist handled facilities technology such as:

- air-conditioning related work;
- cabling and cable diagnostics;
- equipment servicing;
- CCTV installation / modernization.

Anton and the team redesigned / rebuilt CCTV coverage, added cameras and configured server-side retention. Anton recalls a target / achieved retention period of approximately one month and notes that recordings were used to investigate recurring theft incidents.

The team also restored / improved the card-based access-control system:

- personal cards were reissued;
- policy required employees to use their own cards rather than letting others in on their credentials;
- access events were integrated with working-time / HR processes.

This supports CIO evidence in:

- physical security;
- access governance;
- auditability;
- integration of access-control and HR systems;
- incident investigation capability.

Avoid converting the statement "everything was according to law" into a compliance claim without supporting documents.

---

## 11. License and contract lifecycle management through GLPI

Anton, the on-site specialist and documentation specialist reviewed licenses, keys and certificates and registered them in GLPI.

The team configured reminders so renewal / procurement work could begin approximately **three months before expiration**.

This turned licensing from a reactive problem into a lifecycle process linked to procurement lead time.

The same GLPI / ITSM operating pattern was then offered / extended beyond IT to:

- legal work;
- technical / organizational production teams, including sound and lighting technicians;
- other internal service functions already captured elsewhere in the repository.

This is strong evidence of **service-management pattern reuse beyond IT**, not merely license inventory.

---

## 12. Website and design capability inside the lean team

The on-site specialist also had design / layout / website capability and partially substituted for a dedicated design-production function.

Anton involved that specialist in:

- visual templates;
- website work;
- evaluation of new-site concepts;
- expert feedback on design directions.

Anton notes that one of the specialist's concepts influenced the direction ultimately chosen, although the final decision was not Anton's alone.

This supports the broader ZIL pattern of using a small multi-skilled team and involving technical staff in digital-product / public-experience work where appropriate.

---

## 13. Management pattern evidenced by this debrief

The strongest leadership pattern is:

1. diagnose a broken or uncontrolled area;
2. decide whether the capability should be internal, fractional, centralized or vendor-provided;
3. assign a clear owner with the right specialist depth;
4. work with the owner through initial design / rollout;
5. document the process and make demand visible;
6. automate repetitive controls where possible;
7. delegate steady-state execution;
8. retain director-level accountability for economics, risk, priorities and cross-functional adoption.

This supports a stronger CIO / Technology Director narrative than a list of technical tasks.

A concise framing for future CV work:

> Rebuilt the IT function around specialist ownership rather than generic support: combined on-site service and endpoint capability with fractional DevOps, documentation / ITSM and physical-infrastructure roles; introduced measurable service levels, automated identity and license lifecycle controls, and delegated recurring execution while retaining accountability for risk, economics and transformation.

---

## CV implications

Use this evidence selectively. High-value CIO signals are:

- personnel changes and capability design;
- fractional DevOps as a cost / expertise trade-off;
- HelpDesk + service catalogue + SLA;
- business-process and CRM research / pilot / adoption work;
- identity lifecycle automation tied to HR offboarding;
- endpoint security and public-computer privacy controls;
- license / certificate lifecycle automation tied to procurement lead times;
- physical-security and access-control integration;
- reuse of ITSM patterns across non-IT service functions;
- delegation: director defines system and standards, specialists execute.

Low-level hardware specifics should remain in evidence unless a vacancy explicitly requires technical operations depth.
