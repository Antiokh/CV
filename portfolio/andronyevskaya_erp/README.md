# Self-Hosted ERP for Property Tech Support - Operations and Asset Management Platform

## Overview

This project is a self-hosted ERP system for property technical support, built to coordinate field executors, managers, and administrators around equipment, tasks, sites, and internal communication.

The product combines WeWeb, Supabase, Telegram, QR-based asset access, and role-based operational workflows into a single system that can run both in browser and mobile contexts, including Telegram Mini App login.

---

## My Role

Developer, DevOps, Project Manager

---

## What the System Does

- Let executors scan QR codes to open equipment cards in the field
- Show assigned tasks, task details, and asset context
- Allow task completion with status updates and internal communication
- Send task events and operational alerts to Telegram via Supabase
- Let managers assign, review, and verify work
- Let administrators manage hierarchies, sites, assets, and role access
- Support password-free login through Telegram Mini App flows
- Operate as a full web app and mobile-ready internal system

---

## Key Features

### QR-Based Equipment Access
Executors can scan QR codes on physical equipment and open the relevant card directly, reducing friction between field work and system usage.

---

### Three-Role Operations Model
The system is split into Executor, Manager, and Administrator modules, each with its own permissions, responsibilities, and UI surface.

---

### Real-Time Task Workflow
Field staff can view tasks, complete work, and exchange operational information through an internal real-time chat tied to the workflow itself.

---

### Telegram-Centered Notifications
Task updates, alerts, and credential-related flows are routed through Telegram using Supabase-powered messaging and webhook logic.

---

### Telegram Mini App Authentication
The product supports password-free login and mobile-friendly access through Telegram Mini App patterns, making onboarding and daily use simpler for operational teams.

---

### Self-Hosted Edge Architecture
The backend was designed around self-hosted Supabase and Edge Functions, including deployment and runtime considerations for restricted or offline-sensitive environments.

---

## Tech Stack

- **Frontend:** WeWeb
- **Backend:** Supabase
- **Auth / Messaging:** Telegram Mini App, Telegram Bot API
- **Backend Logic:** Supabase Edge Functions
- **Infrastructure:** Self-hosted deployment

---

## Challenges

### Role-Based Operational Complexity
The system had to support three different operational roles with distinct permissions, actions, and visibility rules across tasks, sites, and assets.

---

### Bridging Physical Assets and Digital Workflow
QR-based entry points had to connect real equipment in the field with digital cards, task execution, and follow-up communication without adding friction for executors.

---

### Telegram-Driven Access and Notifications
Using Telegram as both a login surface and an operational notification channel added product convenience, but also introduced non-trivial auth, webhook, and delivery design work.

---

### Self-Hosted Reliability
Because the project was built for self-hosted Supabase and Edge Functions, the architecture had to account for runtime constraints, deployment reliability, and offline-safe dependency handling.

---

## Result

A working internal ERP platform for property technical support, combining asset access, task execution, role-based management, Telegram workflows, and self-hosted infrastructure in one operational system.

The result is more than a task board. It is a structured field-operations platform designed around physical assets, internal service processes, and real-world support workflows.

---

## Key Takeaway

This project demonstrates the ability to build and operate an internal ERP-style platform end to end: product structure, role model, frontend delivery, backend logic, Telegram integration, and self-hosted deployment.

---

## Additional Notes

Upwork portfolio reference: https://www.upwork.com/freelancers/antiokh?p=1980802861284208640

Internal codebase reference: `D:\Git\andronyevskaya`

---

## Screenshots

_Add screenshots here_
