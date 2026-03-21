# AIS MosRazvitie - Government Cultural Operations System

## Overview

AIS MosRazvitie was an industry information system used by the Directorate of Cultural Centers of Moscow to collect, manage, moderate, analyze, and export operational data from subordinate cultural institutions.

The platform served libraries, cultural centers, and directorate staff, supporting the core reporting and analytics workflow of the organization. It was not a narrow internal tool, but a central system for managing institution data, event data, address data, questionnaires, reports, and external data exchange.

The main challenge of the project was evolving a legacy IBM Domino-based system into a more structured, scalable, and secure platform while preserving day-to-day usability for a large number of operational users.

---

## What the System Does

- Store and manage institution, address, event, and activity records
- Support data entry by subordinate organizations and moderation by directorate staff
- Track event lifecycle and reporting status
- Generate filtered exports and formal reports
- Provide questionnaires and structured data collection forms
- Support service actions on groups of records
- Run background agents for status updates, unlocks, and cleanup
- Exchange approved data with external systems over HTTP/XML

---

## Key Features

### Multi-Entity Data Model
The system was built around multiple linked card types rather than a single registry, including institutions, addresses, events, club formations, questionnaires, and reporting templates.

---

### Reporting and Export Engine
Users could generate structured exports and reports based on templates, views, filters, and query parameters, with output prepared for tools such as Excel, Word, and PDF.

---

### Operational Workflows
The platform supported real administrative workflows: planning events, updating future schedules, filling post-event reports, blocking edits during critical stages, and moderating records before downstream use.

---

### Admin and Service Actions
The system included service operations for batch actions on records, as well as server agents for unlocking records, updating statuses, cleaning up outdated files, and maintaining data consistency.

---

### External Data Exchange
Approved records could be published for external consumption through HTTP/XML endpoints, including change tracking and support for external parsing based on published XML schemas.

---

### Web-Based Access
The platform exposed a web interface for distributed operational use across many institutions, making centralized reporting and data quality control possible at scale.

---

## Tech Stack

- **Platform:** IBM Domino / Notes
- **Architecture:** Card-based data model, views, templates, forms, agents
- **Integrations:** HTTP, XML, external data exchange endpoints
- **Output:** Excel, Word, PDF exports
- **UI:** Web-based interface for distributed users

---

## Challenges

### Legacy Architecture Constraints
The original system was already in active use, but its early design did not account well for scale, access control, security, or clear structural separation of entities and logic.

---

### Large Operational Scope
The platform supported many organizations and a broad set of workflows, which made data modeling, permissions, lifecycle rules, and consistency much more complex than in a typical internal CRUD system.

---

### Reporting Complexity
Reporting was not a simple export button. The system needed configurable templates, filtered data sources, parameterized queries, and output structures suitable for formal reporting.

---

### Data Governance and Moderation
Information entered by institutions had to be validated, moderated, and sometimes blocked from further edits depending on operational stage and reporting requirements.

---

### Security and Scalability Improvements
One of the major drivers for the new version was the need to improve security, reduce unsafe exposure of data, introduce clearer rights separation, and support a growing volume of information and users.

---

## Result

A central operational and reporting system that supported the daily work of the Directorate of Cultural Centers of Moscow and its subordinate institutions.

The platform enabled distributed data entry, centralized moderation, structured reporting, workflow control, and external publication of approved data, turning fragmented institutional information into a manageable system for analytics and governance.

---

## Key Takeaway

This project demonstrates the ability to work on large operational systems with messy real-world constraints: legacy architecture, complex workflows, formal reporting requirements, access-control concerns, and the need to balance day-to-day usability with long-term system structure.

---

## Additional Notes

Project documentation folder: [`АИС. Проектная документация`](./АИС.%20Проектная%20документация)

This case study is based on project documentation and resume context. A deeper internal write-up can be added later if needed.

---

## Screenshots

_Add screenshots here_
