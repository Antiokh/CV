# Master Resume Completeness and AI Detector Report

Date: 2026-06-02

Current master resume:

- `details/master_resume_greenhouse.md`

Preserved version:

- `details/versions/master_resume_greenhouse_2026-06-02_full_manager_tech.md`

Raw detector result files:

- `details/master_resume_ai_detector_results_2026-06-02.json`
- `details/master_resume_aidetego_results_2026-06-02.json`

## Completeness Audit

The master resume is now intentionally broad enough for a single HH-style profile where management and technical tracks cannot be separated cleanly.

Added/confirmed for manager/software matching:

- PlanFix
- Odoo
- CRM/ERP implementation
- ServiceDesk / HelpDesk
- GLPI
- asset inventory
- Tawk.to
- Yandex Disk
- Microsoft Office
- LibreOffice
- OpenOffice
- OnlyOffice
- Figma
- knowledge-base documentation

Already covered for technical/hard-skill matching:

- Supabase, PostgreSQL, SQL, RLS, Edge Functions, Realtime
- Xano, REST APIs, Postman, Airtable-to-Supabase migration
- n8n, Make, DocsAutomator, OpenAI API, fal.ai, AI parsing, AI image APIs
- WeWeb, Bubble, Glide, Astro, custom WeWeb/Vue components
- JavaScript, TypeScript, Python, Node.js, Bash, PHP, JSON
- IBM/HCL Domino, Lotus Notes, XPages, LotusScript, Java, Apache POI
- Windows Server, Linux, nginx, Docker, Hyper-V, VMware ESXi
- Active Directory, GPO, GLPI, Zabbix, SoftEther VPN, Synology, Octagram, MS SQL
- Yandex Maps API, DataMos.ru, geocoding/reverse geocoding, INN/legal entity APIs, weather/forecast APIs, Stripe, WordPress/WooCommerce, SendPulse

Notes:

- Koha remains intentionally careful because the source says it existed somewhere in the infrastructure, but exact work is not remembered.
- React remains `light/touched`; Vue.js is the stronger modern frontend framework signal.
- ActivePieces remains `light/evaluated`.

## Detector Sources and Limits

AIDetego:

- URL: https://aidetego.com/analyze
- Mode used: Technical
- Notes: AIDetego says it runs analysis locally in the browser and uses 16 modules. It also explicitly presents results as probability, not proof.

AI Text Detector:

- URL: https://aitextdetector.ai/
- Endpoint used: public WordPress AJAX action `aitd_detect`
- Notes: The site describes a free detector and says no detector is 100% accurate. The endpoint rate-limited/blocked later requests with `403`/`429`.

AiDetector.com:

- URL: https://aidetector.com/
- Attempted frontend API routes from the Nuxt bundle.
- Result: no usable score captured. `api.aidetector.com` returned `404` for discovered routes; the alternate Vercel backend returned `401 Authentication Required`.

## AI Detector Scores by Block

Percent means "AI probability" or "AI-generated score" as reported by that detector. These tools are inconsistent and should be treated as screening signals only.

| Block | AI Text Detector score | AI Text Detector label | AIDetego score |
|---|---:|---|---:|
| Header | 10% | Human Written | not run |
| Summary | 45% | Likely Human | 100% |
| Core Skills | 75% | Likely AI | 49% |
| Technical Stack | blocked: 403 | - | 49% |
| NeedleBit | 25% | Human Written | 96% |
| OTUS | 25% | Human Written | not run |
| New Business Environment | 25% | Human Written | 38% |
| Directorate of Cultural Centers of Moscow | 25% | Human Written | 85% |
| ZIL Cultural Center | blocked: 429 | - | 96% |
| Moscow Social Development Agency | blocked: 429 | - | 65% |
| Beluga Group | blocked: 429 | - | not run |
| Settlement and Savings Bank | blocked: 429 | - | 69% |
| I.T. Information Technology | blocked: 429 | - | 38% |
| Freelance / Private Practice | blocked: 429 | - | not run |
| Domodedovo Airport | blocked: 429 | - | not run |
| Education | 25% | Human Written | not run |
| Professional Development | 25% | Human Written | not run |
| Languages | 10% | Human Written | not run |
| Additional Experience | 25% | Human Written | not run |

## Interpretation

The master resume is complete enough as a broad source document, but the highest-risk AI-looking blocks are:

- Summary: AIDetego 100%
- NeedleBit: AIDetego 96%
- ZIL Cultural Center: AIDetego 96%
- Directorate: AIDetego 85%
- Core Skills: AI Text Detector 75%

The likely cause is not hidden Unicode. The files were checked for zero-width and directional control characters, and no suspicious characters were found. The higher scores are more likely caused by:

- polished resume phrasing
- list-heavy structure
- uniform bullet rhythm
- broad abstract nouns such as architecture, delivery, governance, workflow, implementation
- compact high-density technology lists

## Recommended Next Version

Do not delete the current version. For the next version, keep the same facts but rewrite high-risk blocks with more lived-in specificity:

- make the Summary less generic and less balanced
- break the Core Skills into more irregular human phrasing
- add one concrete awkward-but-real detail per high-risk role
- reduce repeated verbs like `Designed`, `Built`, `Managed`, `Integrated`
- vary bullet length and structure
- keep technology density in Technical Stack, because ATS needs it, but do not over-polish surrounding prose
