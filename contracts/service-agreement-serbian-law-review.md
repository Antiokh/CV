# Serbian-law review notes for the service agreement

This document records the reasoning behind the September 2026 amendments to `service-agreement.md`. It is explanatory only and is not incorporated into the Agreement unless an SOW expressly says so.

## 1. Principal subject: web-portal services, not standalone software development

The Agreement was renamed from **Software Development and Business Systems Services Agreement** to **Web Portal Maintenance, Configuration and Optimization Services Agreement**.

The operative text now states that the principal subject of the Services is maintenance, configuration, administration, integration, support and optimization of the Client's web portal and related web-facing business systems.

The Agreement still expressly permits implementation, scripting, automation, coding, development, deployment and replacement of software components when those activities are reasonably necessary to perform the principal Services.

The commercial/legal distinction is deliberate:

- development is not removed from the contract;
- source code, custom Deliverables, development environments, repositories and handover remain fully regulated;
- development can be substantial in a particular SOW;
- but development is normally described as a method used to maintain, configure, integrate or optimize the web portal rather than as the standalone principal subject of the framework Agreement.

This matches the intended business positioning of **Anton Nazarov PR Veb Portali Beograd - Stari Grad** while preserving the contractual protections needed when technical work includes code.

Serbia's official Classification of Activities distinguishes **62.01 Computer programming** from **63.12 Web portals**. The 63.12 category concerns operation of web portals and websites acting as internet portals, while 62.01 covers programming activities. The Agreement therefore should not falsely describe programming as falling inside the statutory definition of 63.12. Instead, it truthfully defines the principal contracted service and separately recognizes that programming can be used in performing it.

Under the Serbian Companies Act, an entrepreneur may perform activities that are not prohibited by law and for which applicable conditions are satisfied. The registered activity remains the predominant activity; the contract title alone does not determine the actual nature of the business or tax treatment.

References:

- APR / Statistical Office, Classification of Activities: https://apr.gov.rs/upload/Portals/0/zakoni%20uredbe%20pravilnici/Uredbe/Uredba%20o%20klasifikaciji%20delatnosti.pdf
- Serbian Companies Act published by APR, including the rule applicable to entrepreneurs permitting lawful activities subject to prescribed conditions: https://apr.gov.rs/upload/Portals/0/zakoni%20uredbe%20pravilnici/Zakoni/2025/Zakon_o_privrednim_dru_tvima.pdf

## 2. SOW structure now reinforces the principal service

Exhibit A now requires each project to identify:

- the web portal or related web-facing system;
- the principal service category: maintenance, configuration, administration, integration, support or optimization;
- the actual system/process boundary;
- any implementation, scripting, automation, coding or development included as necessary technical work.

This prevents the framework Agreement from saying one thing while an SOW silently turns the engagement into an undefined general software-development project.

It also preserves flexibility. If a particular commercial engagement genuinely has standalone development as its principal subject, the SOW may expressly say so. That should be a conscious exception rather than the framework default.

## 3. Acceptance: keep deemed acceptance, but tie it to an express inspection request

The earlier draft deemed a Deliverable accepted merely when the review period expired without a valid rejection. That formulation was vulnerable to an argument based on the general rule that silence is not ordinarily acceptance.

The revised Sections 2.2, 6.1 and 6.3 require Contractor to:

1. deliver the identified version;
2. expressly invite Client to inspect it and accept or reject it;
3. give the agreed review period;
4. allow a documented justified reason where inspection genuinely cannot be completed in time.

This is materially stronger under the Serbian **Law on Obligations (Zakon o obligacionim odnosima)**. Article 614 provides that the customer must inspect completed work as soon as reasonably possible and notify defects without delay. More importantly, Article 614(2) states that where the customer does not respond, without justified reason, to the contractor's invitation to inspect and receive the completed work, the work is considered accepted.

The contract therefore preserves deemed acceptance but structures it around an actual invitation to inspect and receive the work instead of relying on silence in the abstract.

Reference:

- Zakon o obligacionim odnosima, Article 614: https://www.paragraf.rs/propisi_download/zakon_o_obligacionim_odnosima.pdf

## 4. Intellectual property: Section 7 expressly overrides the default rule for commissioned software

Serbian copyright law contains a contractor-unfriendly default specifically for commissioned computer programs.

Article 95 of the **Law on Copyright and Related Rights** states that, when a computer program is created under a commissioned-work agreement, the client obtains all exploitation rights unless the contract provides otherwise.

The Agreement already contained a commercially preferable structure:

- rights in a custom Deliverable transfer only after payment of the relevant Deliverable or milestone;
- Background Materials stay with Contractor;
- Third-Party Materials remain subject to their own licences;
- Client receives the licence necessary to operate and continue the paid Deliverable;
- moral/personal rights are treated separately.

The revision now makes the intention explicit: Section 7 governs the allocation of economic rights in custom Deliverables, including computer programs and source code, and applies instead of a different default allocation for commissioned software to the maximum extent permitted by law.

This matters because merely saying "rights transfer after payment" is less precise when Serbian law already supplies a special default for commissioned software. The new sentence makes the contractual derogation deliberate.

Reference:

- Zakon o autorskom i srodnim pravima, Article 95: https://www.paragraf.rs/propisi_download/zakon_o_autorskom_i_srodnim_pravima.pdf

## 5. Liability cap: keep it, do not create unnecessary unlimited carve-outs

The Agreement keeps the liability cap at the fees actually paid under the applicable SOW and keeps the exclusion of indirect/consequential loss.

It does **not** adopt a broad client-favourable carve-out making every confidentiality, data-security or IP claim automatically unlimited.

Instead, Sections 12.1 and 12.2 now state expressly that the cap and excluded-damages mechanism do not apply to fraud, wilful misconduct, gross negligence or any liability that cannot lawfully be limited or excluded.

This tracks the key Serbian mandatory rule. Article 265 of the Law on Obligations prevents advance exclusion of liability for intent or gross negligence and permits a contractual maximum amount of damages provided the amount is not manifestly disproportionate and no special law provides otherwise.

That is the commercially useful allocation: ordinary contractual negligence remains capped; conduct that Serbian law does not permit the parties to protect in advance remains outside the protection.

Reference:

- Zakon o obligacionim odnosima, Article 265: https://www.paragraf.rs/propisi_download/zakon_o_obligacionim_odnosima.pdf

## 6. Statutory default interest is automatic, not discretionary wording

Section 4.4 previously said overdue sums *may accrue* default interest. That unnecessarily weakened a statutory entitlement.

The revised clause says undisputed overdue amounts **shall accrue statutory default interest from the due date until payment at the rate prescribed by applicable law**.

Article 277 of the Law on Obligations provides that a debtor in delay with a monetary obligation owes default interest in addition to principal. The contract now reflects that structure instead of making the entitlement appear optional.

Reference:

- Zakon o obligacionim odnosima, Article 277: https://www.paragraf.rs/propisi_download/zakon_o_obligacionim_odnosima.pdf

## 7. Independent-contractor wording and the Serbian test of independence

The earlier wording allowed Client to "observe and monitor Contractor's performance" and separately stated normal working communications during 10:00-19:00. Read badly, those provisions could look closer to employer control over an individual's work process than intended.

The amended Agreement separates three concepts:

- Client may inspect progress, results, agreed repositories and compliance with project requirements;
- Contractor independently organizes working time, place, staffing, tools and internal methods, subject to project deadlines, security rules and necessary access to Client systems;
- 10:00-19:00 is a communication window, not Contractor's prescribed working time.

This drafting reduces accidental employment-style language. It does not "solve" the Serbian **test samostalnosti** by contract wording alone. The Serbian Tax Administration expressly warns that artificial contractual language is not decisive where actual conduct shows a different relationship. The real operating model must match the contract.

Reference:

- Serbian Tax Administration, guidance on the test of independence: https://www.purs.gov.rs/upload/media/2025/2/4/366523/Uputstvozaprimenutestasamostalnostipdf2.pdf

## 8. Convenience termination now protects paid/reserved capacity

The framework still permits either Party to terminate an SOW for convenience on 10 Business Days' notice unless the SOW states another commitment.

The revised clause now makes clear that an SOW can contain:

- a minimum commitment period;
- reserved capacity;
- an amount earned upon reservation;
- an amount that remains payable after early convenience termination.

This matters for fixed-price, milestone and capacity-reservation projects. A generic ten-day exit should not silently destroy the economic bargain where Contractor has rejected other work or reserved a defined block of time for Client.

The SOW should state the commercial treatment expressly rather than rely on a punitive or ambiguous cancellation penalty.

## 9. Warranty language was aligned with the new principal subject

The earlier clause said that warranty correction was not "ongoing maintenance". After making maintenance one of the principal service categories, that sentence became internally confusing.

The revised Section 11.5 now distinguishes:

- **warranty** — free correction of qualifying defects in an accepted Deliverable;
- **active paid Services** — recurring maintenance, configuration, administration, integration or optimization where included in an SOW;
- **post-scope support/SLA** — continuing support, reserved capacity, monitoring or response-time obligations that must be separately agreed.

This preserves the original commercial protection against unlimited free post-delivery support without contradicting the Agreement's new principal subject.

## 10. Changes deliberately not made

Several protections in the existing draft remain intentionally intact.

**Development terminology remains throughout the operative clauses.** It is needed for development/export environments, AI-assisted tooling, IP, source repositories, custom Deliverables, warranty, third-party adaptation and handover.

**The liability cap remains meaningful.** Confidentiality, security and IP claims were not made automatically unlimited.

**Deemed acceptance remains.** It was strengthened procedurally rather than deleted.

**Payment-conditioned IP and handover remain.** Client-owned production accounts, data and credentials cannot be held hostage, but Contractor-controlled editable assets and rights remain tied to payment of the relevant Deliverable.

**Third-party platform risk remains outside warranty unless Contractor misimplemented the agreed integration.** This continues to protect Contractor from becoming an insurer for SaaS providers, APIs, regional restrictions, hosting limits and policy changes.

## 11. Practical rule for future SOWs

The framework wording only works if each SOW follows the same hierarchy.

A normal SOW should begin with a service description such as:

> Maintenance, configuration, integration and optimization of the Client's web portal, including implementation and modification of software components where reasonably necessary to perform the stated Services.

Then list concrete technical work and Deliverables underneath it.

Avoid making the first line of a routine SOW simply "development of software X" when the actual commercial engagement is ongoing configuration, integration, maintenance or optimization of a web portal. Conversely, do not disguise a genuinely standalone software-development engagement as maintenance merely for formal appearance. Serbian tax and regulatory analysis depends on substance as well as documents.
