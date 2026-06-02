# Anton Nazarov — Technical Experience Raw Master Notes

## 1. Current Product / Backend / Automation Stack

### Supabase

Supabase — один из core stack-level навыков. Уровень: advanced / senior hands-on / architecture-level.

Я подключал Supabase практически во все современные проекты. Использовал его не как простую hosted database, а как полноценный backend layer для production и MVP-систем: база данных, авторизация, RLS, Edge Functions, realtime, cron, triggers, API, интеграции, self-hosting, GitHub sync и AI-readable backend documentation.

Работал с Supabase в разных конфигурациях:

* managed Supabase;
* self-hosted Supabase в Docker;
* Supabase как backend для WeWeb;
* Supabase как backend для Glide;
* Supabase как backend для Bubble/внешних frontend-layer решений;
* Supabase как backend для рукописных сайтов;
* Supabase + Astro;
* Supabase + console-style/custom apps;
* Supabase + n8n / Make / API automations;
* Supabase + GitHub;
* Supabase + AI/MCP workflows;
* Supabase + OpenAI;
* Supabase + Telegram integrations.

Решал проблемы:

* подключения к Supabase;
* self-hosted конфигурации;
* Docker/self-hosting issues;
* сетевой нагрузки;
* разницы поведения managed и self-hosted Supabase;
* API/debug issues;
* проблем с лимитами ответов на запросы;
* зацикленных event loops;
* триггеров, которые запускали повторные процессы;
* cron jobs, которые не отрабатывали;
* очередей/стеков сообщений;
* Edge Functions, которые работали по event/cron/SQL вызову;
* связи Supabase с внешними сервисами;
* организации доступа для AI-агентов к структуре базы.

Использовал прямой доступ к PostgreSQL внутри Supabase через database clients, например Navigator и аналогичные клиенты. Работал напрямую с SQL, функциями, ключами, индексами, views, triggers, policies, types, enum/reference tables.

Supabase использовался как backend core для:

* operational systems;
* internal tools;
* field applications;
* client portals;
* admin panels;
* Telegram Mini Apps;
* AI-assisted products;
* document/report generation systems;
* assessment platforms;
* inspection/reporting systems;
* booking systems;
* CV/profile generation systems;
* data migration systems;
* social/content automation workflows.

### PostgreSQL

PostgreSQL — strong / core skill.

Работал с PostgreSQL не только на уровне CRUD, а на уровне relational data modeling, functions, triggers, indexes, views, optimization, test-data generation, RLS-related logic and performance troubleshooting.

Что делал:

* проектировал схемы баз данных;
* создавал таблицы, связи, справочники;
* нормализовал данные;
* работал с enum-объектами и fixed-value dictionaries;
* решал проблемы с типами данных;
* писал SQL functions;
* писал triggers;
* создавал views;
* создавал аналитические views;
* использовал joins;
* использовал nested queries;
* сравнивал nested queries vs joins по скорости;
* использовал EXPLAIN;
* оптимизировал запросы;
* добавлял индексы;
* отрабатывал превышение лимитов на ответах;
* тестировал разные варианты запросов;
* готовил аналитические структуры данных;
* работал с JSONB/JSON-style structures, где это было нужно;
* создавал fake/test datasets;
* делал load-testing-like data generation.

Один из сильных кейсов: написал в Supabase community universal functions для программного добавления случайных пользователей. Это нужно для новых продуктов, когда требуется создать шум, пул пользователей, пул тестовых данных, пул заявок, истории и посмотреть, как база ведёт себя при большом количестве данных и пользователей.

Был workflow:

* запрос к randomizer/рандомной генерации имени, фамилии и данных;
* автоматическая регистрация пользователей;
* генерация fake content;
* создание тестовых историй;
* нагрузочная проверка поведения базы;
* проверка логики продукта на volume-like данных.

### Supabase Auth

Supabase Auth — strong.

Что делал:

* email/password auth;
* custom user generation;
* programmatic user creation;
* user metadata;
* role-based auth patterns;
* Telegram/external auth context;
* custom onboarding flows;
* integration with SendPulse for prettier auth-related email messages;
* automated registration of fake/test users;
* auth-related workarounds;
* access checks around authenticated users.

Использовал auth не отдельно от системы, а как часть роли, доступа, RLS, frontend behavior, Telegram validation and backend workflows.

### Supabase RLS

Supabase RLS — advanced.

Делал сложные системы прав доступа:

* role-based access;
* owner-based access;
* access by owner of parent/root reference;
* access by object ownership;
* file ownership access;
* comment access through parent object;
* nested access checks;
* access to related entities, not only current row;
* role/user/entity hierarchy;
* permissions across operational systems;
* policies for multi-role applications.

Пример: если есть комментарий к объекту, доступ должен проверяться не только по самому комментарию, а через доступ к объекту, к которому этот комментарий относится. То есть policy должна учитывать parent entity, root reference, ownership and role logic.

RLS использовался в:

* multi-role operational systems;
* field workflow apps;
* client/admin portals;
* file access;
* comments/tasks;
* private records;
* role-based internal tools;
* Telegram/Supabase-backed systems.

### Supabase Edge Functions

Supabase Edge Functions — advanced / production.

Писал Edge Functions для разных сценариев:

* Edge Functions on triggers;
* Edge Functions through cron;
* Edge Functions called from SQL functions;
* API integration functions;
* OpenAI JSON calls;
* AI image generation flows;
* watcher functions;
* diff functions;
* realtime/action-triggered functions;
* Telegram validation;
* Telegram bot logic;
* webhook-style routing;
* WordPress/WooCommerce integration;
* customer/purchase data exchange;
* form auto-fill through AI;
* backend logic that should not expose secrets to frontend.

Делал Edge Functions, которые висели на триггерах, подключались через cron, вызывались из SQL-функций, работали как backend API layer и как secure gateway.

Отдельный кейс: перенос Telegram validation с клиентской стороны на Edge Functions, потому что server-side validation безопаснее, не раскрывает secret data и bot token.

Также делал на Supabase Edge Functions router: Supabase database + Edge Functions выполняли функцию webhook/backend logic для Telegram bot. Были routing, subfunctions, database-backed logic. По сути, писал Telegram bot logic на Edge Functions.

### Supabase Realtime

Supabase Realtime — yes / strong.

Использовал:

* realtime updates;
* chat message capture;
* subscriptions;
* subscribe на обновления;
* presence logic;
* room/entity-based presence;
* realtime task/chat/field workflows;
* multi-user applications;
* user/entity attachment tracking;
* operational chat flows.

Работал с ситуациями, где нужно было ловить обновления сообщений, присутствующих пользователей, состояние комнаты или сущности, связанные с конкретным объектом или пользователем.

### SQL

SQL — advanced practical.

Использовал SQL как один из основных рабочих языков:

* complex joins;
* nested queries;
* views;
* functions;
* triggers;
* indexes;
* EXPLAIN;
* query optimization;
* performance testing;
* analytical tables/views;
* normalized structures;
* reference tables;
* enums;
* JSON/JSONB where needed;
* type debugging;
* data migration;
* import/export;
* test data generation;
* database structure sync.

Оценивал, что лучше использовать — nested queries или joins — по ситуации и скорости. Проверял через EXPLAIN, сравнивал варианты и оптимизировал.

### REST APIs

REST APIs — strong / core.

Использовал REST в нескольких слоях:

* Supabase REST API over PostgreSQL;
* REST access to tables/views/functions;
* SQL functions exposed as REST endpoints;
* API connections to database with permission checks;
* external REST APIs;
* internal REST-like API services;
* API wrappers around custom logic;
* Postman testing;
* self-hosted vs hosted API debugging.

В Supabase использовал встроенный REST API как полноценный API layer к PostgreSQL, расширял его SQL-функциями, давал доступ к функциям как REST endpoints, проверял права и безопасность доступа.

### Xano

Xano — solid / targeted backend skill.

Использовал Xano в web projects and Bubble-connected projects.

Что делал:

* API endpoints;
* admin API endpoints;
* backend logic;
* dataset generation;
* chart datasets;
* graph visualization data;
* test/assessment response visualization;
* MetaFox-like testing/scoring logic;
* integrations from Bubble;
* backend layer for web apps;
* connected real-time-related projects.

Xano использовался в проектах, где нужна была backend/API логика, генерация данных для визуализации графиков, графов, результатов тестов, employee testing and personality assessment systems.

При этом стратегически чаще предпочитал Supabase + n8n/Supabase Edge Functions как более контролируемый, дешёвый и масштабируемый путь.

### API Integrations

API integrations — very strong / core skill.

Интегрировался с большим количеством внешних сервисов, корпоративных систем, public data APIs, AI APIs, геосервисов, платёжных систем, документов, почтовых служб, карт, погодных и дорожных сервисов.

Категории интеграций:

* email services;
* accounting services;
* legal entity data APIs;
* INN/legal entity lookup;
* cadastral/object-data APIs;
* geocoding;
* reverse geocoding;
* GeoJSON import/export;
* map APIs;
* Yandex Maps;
* Google services;
* Google Sheets;
* Google Docs;
* Google Drive;
* DocsAutomator;
* WordPress;
* WooCommerce;
* Stripe;
* payment plugins/gateways;
* OpenAI API;
* generative AI APIs;
* fal.ai;
* weather/forecast APIs;
* road/traffic services;
* spelling/validation services;
* regional/operator code services;
* mobile operator code services;
* public-data portals;
* Moscow DataMos-like data sources;
* corporate internal systems;
* XML/CSV data exchanges;
* IBM Domino export services;
* 1C integration;
* Telegram APIs;
* Slack;
* GitHub;
* social media APIs/distribution;
* Facebook;
* LinkedIn.

Интегрировался через:

* код;
* Supabase Edge Functions;
* SQL functions;
* n8n;
* Make.com;
* Postman;
* Bubble plugins/connectors;
* WeWeb API connections;
* Glide/API through Make/n8n;
* IBM Domino/XPages custom services.

Писал собственные API wrappers and services, включая программы, которые делали API-обёртку вокруг логики, изначально не имевшей удобного API.

### GeoJSON / Geodata / Maps

Geodata — strong targeted skill.

Опыт:

* GeoJSON both directions;
* geocoding;
* reverse geocoding;
* cadastral/object-data APIs;
* real estate/object APIs;
* Yandex Maps integration;
* public object maps;
* Moscow cultural organization map;
* DataMos/public data integration;
* map-ready JSON generated from IBM Domino;
* geolocation in Glide/mobile apps;
* weather/geodata API integrations;
* user geolocation workflows.

В Дирекции делал специальный GeoJSON для отображения объектов культурных организаций Москвы на Яндекс.Картах, с указанием директоров и публичной информации, раскрываемой по законам Москвы.

### Postman / Debugging

Postman — strong practical.

Использовал для:

* API testing;
* Supabase integration debugging;
* request validation;
* response validation;
* checking self-hosted vs managed differences;
* testing external service behavior;
* finding errors;
* checking auth/headers/tokens/payloads.

## 2. Automation: n8n, Make, Activepieces

### n8n

n8n — strong / core automation and AI orchestration skill.

Использовал n8n для сложных workflow:

* multi-step workflows;
* JavaScript transformations;
* item/group transformations;
* массивы → группы → единый массив;
* группы → массивы;
* payload normalization;
* API requests;
* geoservices;
* GeoJSON;
* geocoding;
* reverse geocoding;
* real-estate/object data APIs;
* Google Sheets integration;
* Google Docs integration;
* Google Drive integration;
* Google Docs/Sheets/Drive → Supabase migration;
* OpenAI integration;
* AI file analysis;
* file summaries;
* metadata extraction;
* Supabase record creation;
* DocsAutomator;
* report/document generation;
* workflow-to-workflow calls;
* reusable sub-workflows;
* webhooks;
* cron/scheduled workflows;
* error workflows;
* debug loops;
* retry loops;
* manual-review routing;
* validation checks;
* self-hosting;
* JSON import/export;
* backups/versioning;
* workflow documentation;
* AI-assisted workflow generation/review.

n8n использовался как modular automation system. Важная особенность: можно вызывать один workflow из другого workflow, что фактически превращает workflow в функцию. Это позволяет строить не один огромный spaghetti workflow, а систему reusable automation modules.

Очень важный опыт — error workflows. В n8n ошибки можно не просто записать и сломать процесс, а полноценно отправить в debug/error loop, вернуть в тот же цикл, перекрасить ошибочный статус в recoverable/regular status and continue processing.

Использовал n8n для OpenAI validation:

* AI возвращал данные в JSON;
* workflow проверял, пригодны ли данные;
* выявлялись demo/hallucinated patterns вроде John Doe / Madison Street;
* использовались frequent fallback-keyword lists;
* данные проверялись через внешние geocoding requests;
* выполнялись repeated requests;
* если AI возвращал каждый раз разный ответ, это считалось вероятной hallucination;
* если на третий раз возвращался тот же результат, он либо принимался, либо отправлялся на ручную проверку;
* низкоуверенные данные routing to manual review.

n8n также удобен как visual process debugger for AI workflows. Он позволяет смотреть, что агент/AI сделал, как данные прошли по шагам, где сломались, где невалидны.

Self-hosted n8n — yes. Использовал и поднимал n8n самостоятельно.

### JavaScript in n8n

Писал JavaScript внутри n8n nodes:

* transforming nested structures;
* grouping items;
* merging arrays;
* preparing payloads;
* normalizing outputs;
* parsing responses;
* custom workflow logic;
* replacing several steps with one script;
* reducing operational cost/complexity.

### Python in n8n

Использовал Python внутри/рядом с n8n, когда нужна была большая стандартизация, библиотеки и более привычная обработка данных.

Python часто практичнее n8n/JavaScript для задач, где нужен standard code, pip libraries, local tooling, structured processing.

Подключал библиотеки:

* Python через pip;
* JavaScript libraries through npm/npx where available and server setup allows it.

### Make.com

Make.com — strong / core automation skill.

Использовал Make практически в каждом проекте, связанном с Glide, потому что у Glide хорошая связка с Make через webhooks.

Что делал в Make:

* webhooks;
* Glide integrations;
* Google Sheets;
* Google Docs;
* Google office integrations;
* Excel-like databases;
* social media distribution;
* Facebook;
* LinkedIn;
* business Facebook pages;
* Slack;
* GitHub;
* email services;
* sending emails;
* mail campaigns;
* API integrations;
* image-generation services;
* generated visual materials;
* scheduled jobs;
* data validation;
* database-based access limitation;
* random background selection for generated images;
* Make-side database usage;
* external database reads/writes;
* routers;
* error handling;
* failed session recovery;
* debug flows;
* workflow-to-workflow calls;
* JSON processing;
* cost optimization.

Make использовался для визуального контент-пайплайна:

* генерация изображений;
* выбор случайного фона;
* получение данных;
* генерация визуалов;
* отправка в социальные сети;
* отправка по каналам;
* расписания;
* проверка данных.

Оптимизировал Make billing:

* уменьшал количество operations;
* заменял 2–3 workflow steps одним script/handler;
* использовал routers осознанно;
* минимизировал лишние “прыжки”;
* отлаживал failed sessions;
* проверял, где Make пожирает лишние операции.

Make в целом использовался как automation/integration layer, но для сложных error loops n8n предпочтительнее, потому что в Make debug/error handling менее гибкий.

### Activepieces

Activepieces — light/evaluated.

Ставил и пробовал как n8n alternative.

Наблюдение:

* меньше готовых решений/plugins, чем у n8n;
* в некоторых местах меньше типичных n8n bugs;
* потенциально полезен как self-hosted automation alternative;
* пока не основной production skill.

## 3. AI / OpenAI / fal.ai / Agentic Workflows

### OpenAI API

OpenAI API — strong / core AI skill.

Использовал для:

* summary generation;
* metadata extraction from files;
* structured JSON response templates;
* automatic field filling;
* file analysis;
* text rewriting/paraphrasing;
* information extraction;
* image description;
* image generation;
* Etsy planner/daily journal generation;
* AI parsing;
* form auto-fill;
* social content analysis;
* tone-of-voice adaptation;
* validation loops;
* hallucination checks;
* Supabase/n8n/Make integrations;
* agentic workflows.

Использовал structured JSON outputs: задаёшь шаблон ответа, AI возвращает JSON, который заполняет нужные поля. Это применялось для:

* документов;
* файлов;
* метаданных;
* резюме;
* социальных сетей;
* автоматизации форм;
* миграции данных;
* анализа контента.

### fal.ai

fal.ai — strong for AI image workflows and prompt engineering.

Использовал как sandbox and production-style experimentation layer:

* image generation;
* mockup generation;
* personal-image based experiments;
* image difference/comparison;
* image description;
* cost optimization;
* prompt testing;
* prompt comparison;
* prompt engineering;
* generation pipeline tuning.

Был большой проект, где prompt engineering around fal.ai был существенной профессиональной частью работы. Подбирались prompts, сравнивались outputs, оптимизировались затраты и качество генерации.

### AI Image Generation APIs

Использовал AI image generation APIs:

* OpenAI image generation;
* fal.ai;
* image generation workflows;
* mockups;
* Etsy-style visual generation;
* prompt pipelines;
* cost optimization;
* output validation;
* debugging generation behavior.

### AI-assisted Data Parsing

AI parsing — strong.

Использовал в нескольких слоях:

* Supabase + n8n + OpenAI;
* Google Drive/Docs/Sheets migration;
* file metadata extraction;
* file summaries;
* content classification;
* LinkedIn parsing;
* Facebook parsing;
* Instagram parsing;
* Telegram parsing;
* analysis of post content;
* social content synchronization;
* different tone-of-voice generation per social network;
* professional profile/resume extraction;
* voice/text interview → profile updates → tailored CV/proposal generation.

Учил/строил agent workflows, которые могут:

* парсить LinkedIn;
* парсить Facebook;
* парсить Instagram;
* парсить Telegram;
* смотреть на content of posts;
* синхронизировать контент умно;
* писать в разных tone of voice для разных соцсетей.

### Agentic Workflows / AI Guardrails

Agentic workflows — very strong / daily use / distinctive.

Использую AI agents ежедневно для:

* coding;
* analytics;
* Supabase backend generation;
* Supabase backend analysis;
* SQL query analysis;
* function analysis;
* database structure analysis;
* table structure updates;
* tailored resume generation;
* client proposals;
* project evaluation;
* cover letters;
* PDF generation;
* profile knowledge updates;
* marketing/client search;
* content adaptation;
* repository maintenance;
* CV/document generation.

Моя агентская система умеет:

* получать voice/text interview;
* дополнять список того, что агент обо мне знает;
* обновлять profile/project knowledge;
* генерировать tailored CV;
* генерировать предложения клиентам;
* готовить cover letters;
* создавать PDF files;
* анализировать вакансии/проекты;
* обновлять repository data.

Использую guardrails:

* repository-level instructions;
* Markdown knowledge base;
* file structure;
* rules;
* pattern libraries;
* reusable functions;
* documentation;
* project context;
* AI-readable Supabase backend structure.

Планирую/исследую vector database layer:

* Supabase as vector database;
* перевод Markdown/guardrails into vectorized knowledge;
* agent-readable configuration;
* better retrieval for profile/project context;
* use of vectors where headings are not enough.

### Database-to-GitHub Synchronization

Есть custom adapter / workflow для Supabase → GitHub sync:

* выгрузка Supabase functions;
* выгрузка table structures;
* выгрузка data/metadata;
* выгрузка SQL functions;
* обновление данных по cron;
* обновление данных по trigger;
* automatic push to GitHub;
* scoped description of changes;
* AI-readable backend structure;
* GitHub as context layer for AI agents;
* synchronization of SQL functions and Edge Functions.

Идея: AI при работе с Supabase должен знать, какие функции есть внутри SQL, какие Edge Functions есть снаружи, какие структуры таблиц есть, что обновилось, как связаны backend functions.

### AI Detector / Resume Style Calibration

Для CV generation появился отдельный слой: ATS and AI-detector style calibration.

Задача:

* опыт на 20+ страниц;
* под конкретную вакансию нужно 2 страницы;
* не использовать AI глупо;
* но ATS/AI detectors иногда маркируют слишком “идеально” написанный текст как AI-generated.

Встроен feedback loop:

* agent generates tailored CV;
* проверка через automated AI-detection/analysis tool;
* оценка AI percentage;
* human/style calibration;
* переписывание под более естественный тон;
* сохранение фактической точности.

Формулировать это публично лучше не как “обход детекторов”, а как human review, style calibration, natural writing and fit-specific adaptation.

## 4. Python / CLI / Desktop / Telegram / Local Automation

### Python

Python — strong practical automation skill.

Используется для:

* automation;
* CLI tools;
* Telegram API;
* Bot API;
* local business tools;
* accounting automation;
* email parsing;
* invoice generation;
* document workflows;
* GUI applications;
* licensing systems;
* executable packaging;
* binary builds;
* backups;
* data imports/exports;
* AI-assisted workflows;
* local databases;
* scripts called from Bash;
* Telegram update readers;
* currency updater;
* agentic workflows.

Python использую не как “deep Python backend framework engineer”, а как practical automation and tool-building language.

### Telegram Python Utility / User API

Один из проектов — Telegram utility for user-side automation.

Смысл:

* сохранять dumps переписок/чатов;
* читать chats/dialogues;
* парсить данные;
* анализировать диалоги;
* автоматизировать Telegram через user Telegram account;
* CLI/MCP-like mode;
* работать через Telegram API, а не только Bot API;
* использовать AI для последующего анализа данных.

Почему не только Bot API: боты стали менее эффективными, поэтому использовался Telegram API от лица пользователя, user-authorized workflows.

Также использовал Telegram Bot API:

* отправка себе backups;
* notifications;
* лайки/reactions на комментарии/публикации в Telegram-группах;
* data parsing;
* group interaction automation.

### Serbian Paušal Accounting Automation

Python-проект для автоматизации бухгалтерской отчётности в Сербии для paušal.

Что делал:

* автоматически забирал с почты уведомления о поступлениях;
* определял incoming payments;
* автоматически подписывал/готовил документы;
* создавал документы;
* вносил необходимые данные;
* отправлял email replies;
* генерировал invoices;
* генерировал requests на перевод с одной валюты в другую;
* вёл KPO journal в local database;
* складывал документацию по папкам;
* хранил incoming payment notifications;
* хранил bank notifications;
* хранил correspondence with banks by payment;
* готовил архив для налоговой системы Сербии.

Это полноценный local operations automation/back-office automation case.

### CV/Profile GUI App

Написал GUI для редактирования опыта работы и профессионального профиля.

Причина:

* опыта много;
* вручную редактировать тяжело;
* нужна визуализация;
* нужно видеть десятилетия разного опыта;
* нужно поддерживать structured profile data;
* далее эти данные используются для tailored CV/proposals.

Всего есть несколько проектов с visual interface / GUI, не только scripts.

### Licensing System

Для Python Telegram CLI utility написал:

* license validation;
* license generation;
* machine-bound licensing;
* software protection logic.

Есть pipeline для:

* compilation to Windows .exe;
* Linux binary builds;
* client-ready executable generation.

То есть Python используется не только как scripting language, но и как foundation for packaged client applications.

### Bash + Python Orchestration

Использовал Bash scripts для:

* backups;
* database creation/update;
* imports;
* exports;
* calling Python scripts;
* reading Telegram updates;
* scheduled/local processes;
* database update automation.

### Currency Rate Bot

Был Python bot/script, который:

* читал Telegram;
* находил актуальные exchange rates;
* обновлял database.

Позже переписан как Edge Function/cache function:

* по cron идёт в Telegram;
* считывает последние курсы валют;
* обновляет database.

### rslive.ru / Astro / DokuWiki / PHP Automation

Инструкции по Сербии на rslive.ru:

* Astro-based project;
* automated data/content workflows;
* database-backed/structured knowledge;
* guardrails;
* generation settings;
* custom plugins written with AI;
* earlier DokuWiki/PHP workflows.

Раньше аналогичные вещи делались для DokuWiki на PHP.

## 5. Make/OpenAI/DocsAutomator/fal.ai Details

### DocsAutomator

DocsAutomator — solid / targeted.

Использовал для document/PDF generation.

Логика:

* есть template document inside DocsAutomator;
* template содержит replacement fields/placeholders;
* отправляется JSON;
* DocsAutomator заполняет fields;
* возвращает PDF or chosen output format;
* можно генерировать reports, forms, documents, sometimes images/charts depending on setup.

Использовался в report/document generation workflows, особенно в связке n8n / Supabase / Glide / inspection/reporting systems.

### OpenAI Document Metadata

Один типичный workflow:

* файл отправляется OpenAI;
* задаётся response schema/template;
* OpenAI возвращает JSON;
* заполняются fields:

  * summary;
  * metadata;
  * что внутри файла;
  * type/category;
  * extracted details;
* данные записываются в Supabase;
* создаётся descriptive database for files.

## 6. WeWeb

### WeWeb General

WeWeb — expert / core skill / one of the strongest modern technical skills.

Работаю с WeWeb около 4 лет, практически с раннего этапа платформы.

Изначально WeWeb понравился после Bubble:

* более контролируемый frontend;
* API-first логика;
* лучше для serious frontend;
* лучше для pixel-perfect UI;
* лучше для CSS-oriented thinking;
* лучше для designer-level implementation;
* функциональнее Glide;
* более predictable, чем Bubble;
* лучше отделяется frontend/backend;
* подходит для Supabase/Xano style architecture.

Использовал WeWeb как:

* frontend builder;
* UI design tool;
* live prototyping tool;
* client-visible interface iteration environment;
* production frontend;
* admin panel layer;
* client portal layer;
* Telegram Mini App layer;
* self-hosted app layer;
* custom component platform;
* reusable UI system layer.

### WeWeb Design / UI

В WeWeb не только разрабатывал, но и дизайнил.

Есть designer background. Делал интерфейсы сам, внутри WeWeb. Часто было быстрее сразу делать дизайн/варианты в WeWeb, чем сначала в Figma, потом переносить.

Пример: MetaFox. Делал около 8 вариантов шкалы оценки / input matrix interface. Было быстрее:

* копировать components;
* модифицировать components;
* сразу использовать live interface;
* показывать клиенту working/live prototype.

Переносил из Figma:

* brandbook;
* UI Kit;
* colors;
* buttons;
* reusable elements;
* client design language.

Создавал:

* reusable components;
* buttons;
* UI patterns;
* interface variants;
* pixel-perfect screens;
* data-entry interfaces;
* assessment matrices;
* client portals;
* admin UI;
* mobile-first UIs.

### WeWeb + Backend

Работал с WeWeb +:

* Xano;
* Supabase;
* external APIs;
* external auth;
* API tokens;
* Supabase Edge Functions;
* REST endpoints;
* realtime;
* Telegram;
* custom libraries;
* custom components;
* GitHub.

Делал сложные приложения, где WeWeb вызывает:

* Supabase functions;
* Supabase Edge Functions;
* API endpoints;
* external services;
* auth providers;
* backend workflows.

### WeWeb Custom Components

Custom WeWeb components — expert.

Когда встроенный AI в WeWeb стал плохо работать и ломать уже разработанные решения, начал работать через VS Code, Codex, Claude/Cursor-style agents.

Сделал:

* starter kit для WeWeb components;
* guardrails;
* rules for AI agents;
* analysis of WeWeb/ViRux component starter examples;
* reusable component library;
* GitHub-backed component workflow;
* testing workflows;
* AI-assisted component development;
* component modification pipeline.

Провёл аналитический разбор WeWeb components and their config format:

* какие settings можно делать;
* как делать sections;
* collapsible sections;
* conditional visibility;
* multilingual settings;
* config/data bindings;
* how WeWeb interprets Vue component configs.

Компоненты были максимально advanced:

* sections;
* collapsible settings;
* conditional hidden settings;
* multilingual fields;
* advanced configuration;
* reusable mode;
* GitHub storage.

### Vue.js Components in WeWeb

Часто брал Vue.js components and repackaged/adapted them into WeWeb:

* подключал Vue components;
* проверял bindings;
* исправлял config issues;
* решал проблемы с settings not passed correctly;
* адаптировал data model к WeWeb;
* оборачивал components for WeWeb usage.

### WeWeb Component Library

Сделал/использовал components:

* Leaflet map;
* advanced Leaflet map;
* QR code generator;
* QR code scanner;
* barcode generator;
* Code 128/barcode formats;
* chart generators;
* custom icon/font generator;
* scalable icon fonts;
* reusable UI components;
* Telegram handler;
* map components;
* data components.

#### Leaflet Map Component

Сильный cartographic component based on Leaflet.

Использовался для:

* maps;
* geodata;
* objects;
* markers;
* visualization;
* business apps.

#### QR / Barcode

Делал:

* QR code components;
* QR scanner/generator;
* barcode components;
* Code 128;
* mini-codes;
* modern barcode formats;
* tested libraries;
* repacked into WeWeb components.

#### Icon Font Generator

Сделал для WeWeb community custom font/icon generator:

* можно использовать icons as scalable fonts;
* one upload → use everywhere;
* better compression;
* faster UI;
* easier selection;
* not random from sets;
* practical reusable icon system.

WeWeb later made their own solution, but it still had issues with dynamic libraries, so my solution remained relevant.

### WeWeb Self-Hosting

Делал self-hosted WeWeb apps.

Столкнулся с routing issue: dynamic routes/page identifiers worked on WeWeb cloud hosting but did not work correctly on self-hosted hosting.

Проблема:

* cloud hosting автоматически открывает нужную страницу;
* self-hosting не работал так же;
* dynamic route / URL identifier issue;
* self-hosted route resolution broken.

Поднимал вопрос в WeWeb community/support. WeWeb сначала отказались поддерживать, ссылаясь на paid support for self-hosting, но public promise was that platform should work similarly on own server and cloud. После долгой борьбы они признали проблему и выпустили официальные инструкции для:

* Cloudflare;
* self-hosting;
* nginx;
* Apache;
* popular server engines.

Это даёт rare skill: WeWeb self-hosting, dynamic routing, deployment debugging.

### Telegram + WeWeb + Supabase

Был проект, плотно интегрированный с Telegram.

Цель: WeWeb app should behave like internal Telegram app / Telegram Mini App.

Использовал:

* Telegram library;
* Telegram init data;
* user validation;
* cryptographic validation;
* JavaScript implementation;
* Supabase Edge Functions;
* backend validation;
* secure secret handling;
* database-backed bot logic;
* webhook-style routing;
* Edge Function router.

Проблема: долго не было корректной реализации Telegram validation на JavaScript по документации Telegram. После многих попыток AI наконец выдал working solution, который вернул valid. Потом решение было переписано на Supabase Edge Functions для безопасности.

Почему server-side:

* secret data should not be in frontend;
* Bot token exposure is unsafe;
* frontend requests can be inspected;
* backend Edge Functions keep secrets safe.

В Edge Functions сделал router:

* Supabase DB + Edge Functions работали как Telegram webhook/backend;
* routing;
* subfunctions;
* database logic;
* Telegram bot-style behavior;
* secure calls.

### WeWeb Realtime / Multi-user

Работал с:

* multi-user mode;
* realtime integrations;
* chat/message workflows;
* presence-like logic;
* dynamic updates.

### WeWeb Knowledge Base / Pattern Library

Для интересных проектов сохраняю решения:

* функции;
* patterns;
* decisions;
* workarounds;
* docs;
* reusable snippets;
* implementation notes.

Раньше это было вручную в Notion as working library. Сейчас — Markdown files, AI instructions, guardrails, pattern libraries, function libraries, repo-based knowledge.

### WeWeb Community / Recognition

Активный участник WeWeb community.

* задавал сложные platform-level questions;
* многие pieces of documentation рождались from my questions;
* recognized as “WeWebable” / power user;
* получил WeWeb merch/gift for active participation;
* сделал community-useful tools;
* один из top professionals in WeWeb ecosystem.

### WeWeb Mentoring / Consulting

Были клиенты, которые нанимали на WeWeb mentoring/training:

* British client: MetaFox начался как learning/consulting session;
* Canadian client: started with training, then moved into development;
* American client: trained but did not continue project;
* American client: pilot system for commercial flight rental;
* total about 4 consulting/training clients.

Сопровождал как mentor:

* объяснял how WeWeb works;
* показывал architecture;
* объяснял API-first thinking;
* показывал where they make mistakes;
* UX/scalability review;
* backend boundaries;
* structure and maintainability.

Часто клиенты думают, что дешевле научиться, но без насмотренности они делают дольше, хуже по UX and with scalability mistakes.

## 7. Bubble

Bubble — solid-to-strong practical + teaching + migration-aware.

### Bubble Background

Учился в Zerocoder Bubble. Некоторое время Bubble был основным приоритетом в low-code development.

Потом стало понятно, что Bubble быстро упирается в ограничения:

* frontend workflow and backend workflow are not well synchronized;
* asynchronous behavior creates unpredictable UI;
* progress bars can jump left/right because backend and frontend do not update together;
* platform does not follow standard CSS/web thinking;
* z-index issues;
* transparency issues;
* reusable elements behave like isolated islands;
* overlays/backgrounds do not always cover whole screen;
* VH/VW/fixed positioning may not behave as expected;
* custom CSS/JS workarounds needed;
* responsiveness is non-standard;
* plugin dependency risk;
* plugin code is opaque;
* abandoned plugins can break projects;
* many plugins for the same task, hard to choose;
* dropdown width/layout issues require JS/plugin hacks;
* workflows are simple and lack proper loops/branching/error handling;
* database is slow and non-standard;
* data model imitates relationality but is hidden/opaque;
* privacy/access rules are unusual and complex;
* export is painful;
* cost model became unpredictable after pricing changes;
* Lighthouse/performance optimization is hard due to Bubble scripts.

### Bubble Projects / Tasks

Делал:

* marketplace-like interface;
* employee testing / assessment system;
* statistics of user responses;
* questionnaire/brief prototypes;
* backend workflows;
* frontend workflows;
* database rules;
* access/privacy rules;
* field-level conditional visibility;
* plugins;
* payment gateway plugins;
* acquiring/payment plugins;
* custom CSS/JS fixes;
* API integrations.

Пример Educate Online:

* system counted statistics of user answers;
* frontend progress indicator jumped due to backend/frontend async mismatch;
* had to work around Bubble-specific limitations.

### Bubble CSS/JS Workarounds

Использовал:

* manual CSS injection plugins;
* JavaScript overrides;
* z-index fixes;
* transparency fixes;
* overlay workarounds;
* dropdown width hacks;
* reusable element communication hacks;
* custom scripts to force layout behavior.

Есть strong CSS skill, который помогал воевать с Bubble’s non-standard no-code layer.

### Bubble Plugins / Payments

Работал с plugins, including payment/acquiring contexts:

* Russian bank acquiring/payment gateways;
* Tinkoff/Т-Банк-like;
* Qiwi;
* Sber-like;
* paid plugins;
* plugin dependency risks;
* no access to source code;
* risk if plugin author abandons project.

### Bubble Teaching

Преподавал Bubble в OTUS. Делали training program.

Объяснял:

* platform logic;
* workflows;
* UI;
* limitations;
* practical implementation.

### Bubble Positioning

Я могу делать Bubble projects, но не люблю Bubble как strategic architecture choice.

Сейчас предлагаю:

* либо сразу делать на WeWeb/Supabase;
* либо migration from Bubble to WeWeb/Supabase;
* либо Bubble audit/rescue if client already invested.

Bubble should be positioned as:

* Bubble-capable;
* Bubble limitation-aware;
* Bubble rescue/migration;
* Bubble teaching;
* not Bubble-first identity.

## 8. Glide

Glide — strong practical / production / long-term support / troubleshooting.

### Glide General

Glide была первой платформой, которую внедрил в modern low-code practice.

Написал много проектов:

* booking systems;
* order booking;
* tour booking;
* agent tour booking;
* networking app;
* virtual business cards;
* profile cards;
* multilingual website/app;
* Russian/Serbian/English site;
* field inspection apps;
* inspector workflows;
* client route sheets;
* geolocation apps;
* mobile-first internal apps;
* custom dashboards.

### Glide Localization

Переизобрёл localization system in Glide.

У меня были одни из немногих multilingual Glide apps на рынке:

* Russian;
* Serbian;
* English;
* custom localization logic;
* experimental functions;
* clever usage of columns/API calls;
* some exploited experimental free functions later disabled by Glide because they could be monetized.

### Glide + Exit Lead / Inspection Platform

Проект для американской компании, inspectors collecting room/premises data.

Система:

* inspectors collect data on premises;
* integration with planning/drawing system where room schemes could be drawn by finger;
* import data from lead/mold measuring device/pistol;
* route sheet for client;
* mark inspection results;
* attach expertise/research results;
* n8n automatically matched measurement results to room/apartment/premises;
* internal Glide app;
* later WeWeb client-facing app;
* Supabase backend;
* DocsAutomator/n8n report generation.

### Glide Custom UI

Делал custom icon/dashboard-like interfaces, что было unusual/innovative for Glide. До сих пор мало кто так делает.

### Glide Integrations

Glide integrated with:

* Supabase;
* Google Sheets;
* Make.com;
* n8n;
* DocsAutomator;
* external APIs;
* weather APIs;
* geolocation;
* API calls through Make;
* generated files/reports;
* Google office ecosystem.

Делал app that online-requested weather/geolocation/user data and connected to external services.

### Glide Troubleshooting / Mentoring

Меня нанимали:

* fixing bugs in Glide;
* fixing broken parts;
* troubleshooting visibility rules;
* conditions;
* explaining why something works/doesn’t;
* supporting several projects;
* training clients on Glide.

Не сертифицирован, но practical expert-level. Мог бы сертифицироваться, если бы было нужно.

### Glide Pages / New Format

Переносил приложение на new Pages format.

Но сейчас Glide не предпочитаю:

* быстро становится дорогим;
* client moved $10 → $50 → $100 within ~3 months;
* not efficient for larger projects;
* good for trying yourself, prototypes, small internal tools;
* not practical for serious large systems.

### Glide Platform Limitations

Glide limitations:

* visibility rules bugs;
* broken/non-working conditions;
* platform changes breaking working logic;
* bugs existing for years;
* expensive scaling;
* limited control;
* slow loading sometimes;
* not preferred for bigger systems.

Current view: Glide is useful for quick internal/mobile apps, but not main stack for complex long-term systems.

## 9. Other Low-code / Frontend / Design Tools

### FlutterFlow

FlutterFlow — light/evaluated/interested.

Experience:

* self projects;
* test projects;
* evaluated as alternative to WeWeb;
* at one point it was a choice between WeWeb and FlutterFlow;
* currently could often choose FlutterFlow for mobile-first cases;
* no recent commercial orders;
* would be happy to switch if relevant.

Not headline skill unless project/vacancy specifically asks for FlutterFlow.

### Adalo

Adalo — light/evaluated.

Tried it, but it quickly showed itself as not suitable for serious work. More toy/prototype than production.

### Softr

Softr — light/evaluated.

Tried/evaluated, no serious projects. In platform comparisons WeWeb or FlutterFlow usually wins.

### Webstudio

Webstudio — early user / evaluated.

Experience:

* used from early days;
* had website on it;
* considered lifetime subscription;
* free publication on custom domain via Vercel was useful;
* later they removed/changed that;
* old projects unpublished;
* Docker/self-host version did not work;
* still unpredictable;
* hidden settings;
* weaker than Webflow visually and practically;
* not production-ready enough.

### Webflow

Webflow — solid targeted skill.

Did advanced project with horizontal scroll:

* client brought a task others refused;
* vertical scrolling moved page horizontally;
* custom JavaScript;
* animations;
* non-standard interaction;
* advanced CSS;
* solved “impossible” task.

Webflow also has no-code quirks and sometimes resets/changes unexpected things, but it is usable for certain custom frontend/creative tasks.

### Directual

Directual — light/evaluated.

Made test app. Platform logic too non-standard, low confidence in future popularity. Not preferred.

### AppMaster

AppMaster — light/evaluated.

Made test app. All-in-one system, non-standard logic, not preferred, low market confidence.

### Tilda

Tilda — solid targeted website skill.

Did:

* websites;
* third-party service integrations;
* design;
* custom blocks;
* Zero Block;
* marketing/site work.

Useful for websites, not for serious systems architecture.

### Figma

Figma — strong practical / design/prototyping/teaching.

Experience:

* several trainings in Figma;
* self-designed projects;
* helped ex-wife learn design;
* clickable prototypes;
* prototypes functioning like websites;
* animations;
* design variations for clients;
* UI reconstruction;
* copied complex shader/3D-game-like UI from screenshots;
* buttons with shadows/highlights;
* AI-in-Figma teaching;
* taught use of AI in Figma;
* used in school/teaching context;
* used for UI Kit, brandbooks, client variations.

Figma remains good editor, but often I now design directly in WeWeb because:

* palette/components can be created directly in WeWeb;
* avoids double work;
* Figma → WeWeb transfer improved but is not perfect;
* theme switching in Figma can be complex.

### Adobe XD

Adobe XD — learning/emerging.

Learning it now due to:

* cloud service/pricing uncertainty around Figma;
* design background in Photoshop/Illustrator;
* need for alternative design workflow;
* currently can do necessary basics.

### Photoshop / Illustrator / After Effects

Design background includes:

* Photoshop — significant experience;
* Illustrator — some experience;
* After Effects — light/basic experience.

## 10. JavaScript / TypeScript / CSS / Node / PHP

### JavaScript

JavaScript — strong / main programming language.

Using since XPages era:

* Dojo;
* jQuery;
* XPages;
* browser logic;
* WeWeb;
* Vue.js;
* custom components;
* n8n scripts;
* API requests;
* DOM/CSS workarounds;
* Node.js ecosystem;
* automation scripts;
* JSON transformations;
* frontend logic;
* backend-adjacent tooling.

JavaScript was core from IBM Domino/XPages to current WeWeb/Supabase/automation stack.

### CSS

CSS — expert-level practical.

Can do almost anything with CSS:

* pixel-perfect interfaces;
* complex visual constructions;
* weird/non-standard tasks;
* overlays;
* shadows;
* responsive fixes;
* animations;
* horizontal scroll;
* platform-specific fixes;
* Bubble CSS hacks;
* Webflow interactions;
* WeWeb design;
* interface reconstruction;
* training on non-standard CSS challenges.

CSS is one of the strongest technical/design skills. Used to make “unsolvable” UI tasks solvable.

### HTML

HTML — strong.

Used across:

* early websites;
* IBM Domino/XPages;
* Bubble/WeWeb/Webflow/Tilda;
* custom web projects;
* templates;
* frontend implementation.

### Vue.js

Vue.js — solid, mostly through WeWeb/custom components.

Experience:

* Vue-based components;
* WeWeb component ecosystem;
* adapting Vue components;
* config/data binding;
* component packaging;
* reusable UI;
* external library wrapping.

Not necessarily pure Vue SPA lead unless needed, but strong in Vue component adaptation and WeWeb custom component context.

### React

React — light/touched.

React touched, but main frontend experience is Vue/WeWeb/CSS/JavaScript.

### TypeScript

TypeScript — practical / increasingly used.

Using TypeScript variations now. Often with AI-assisted code generation and human review:

* AI gives fast output;
* I control correctness;
* debug/integrate/review;
* use in modern component/tooling contexts.

Can write TypeScript, but not best positioned as deep TypeScript-only engineer unless task fits.

### Node.js

Node.js — solid practical.

Used for:

* build tooling;
* Astro;
* libraries;
* npm/npx ecosystem;
* automation;
* JavaScript/TypeScript tooling;
* custom scripts;
* package-based workflows.

Increasingly using Node.js instead of Python for some tasks because more relevant libraries exist. Node can be faster/more modular in some cases, but has quirks with package/resource access and internet dependency.

### PHP

PHP — long-term practical, not main language.

Worked with PHP since around 2004.

Experience:

* simple websites;
* PHP utilities;
* DokuWiki plugins;
* Composer;
* debugging PHP dependencies/runtime bugs;
* AI-assisted plugin development;
* Linux-side image generator;
* generator from SVG files and request to required images;
* WordPress/DokuWiki contexts.

Can build PHP projects with AI assistance and debugging control, but PHP is not main identity.

## 11. Early Technical Foundation: Private Servers / Linux / MySQL / Bash

Technical immersion started before formal enterprise work, around 2004–2005, with private Lineage and World of Warcraft servers.

Experience:

* Linux;
* Ubuntu;
* Bash scripts;
* MySQL;
* database update imports;
* backups;
* Dropbox/cloud backup integration;
* PHP server status utilities;
* modifying existing PHP code;
* modifying private server codebases;
* possible C++/C# server code modification;
* community contributions;
* World of Warcraft server community.

There was intensive early experience with:

* SQL;
* MySQL;
* Bash scripting;
* Linux administration;
* manual backups;
* update imports;
* server monitoring;
* PHP tools;
* modifying ready-made code.

This is important because the technical foundation predates AI and predates low-code. It was manual server administration, scripts, database work, and community code.

### Bash / Linux

Bash — solid historical + practical.

Used for:

* MySQL update imports;
* backups;
* copying to Dropbox;
* server maintenance;
* later database exports/imports;
* calling Python scripts;
* Telegram update readers;
* local/server automations.

### MySQL

MySQL — solid historical/practical.

Used in private server era and early web/CMS contexts:

* database updates;
* imports;
* backups;
* PHP utilities;
* server status;
* game server databases.

### C++ / C#

C++ / C# — light historical code modification only.

Modified existing private server codebases/community code. Not a current/core skill.

## 12. IBM Domino / Lotus Notes / XPages

IBM Domino / Lotus Notes — expert legacy enterprise / full-stack foundation.

This is one of the biggest parts of my programming background. Technology is old, but the experience is full-stack enterprise: backend, frontend, integrations, reports, server administration, migration, performance, users, training, stakeholders and implementation.

### Domodedovo Airport, 2008

Started work with IBM Domino in 2008 at Domodedovo Airport.

* passed competitive selection from 12 people;
* trained internally;
* became Lotus/Domino developer;
* worked with notifications;
* mailings;
* user data;
* calendar data;
* scripts;
* service applications;
* project documentation;
* user support;
* testing/support collaboration.

First experience with client libraries and external integrations: connecting Java DLL-like/library through Visual Basic / LotusScript style.

Was hired partly because from the beginning I cared about visual quality and made interfaces look good, while functionality grew toward requirements.

### Firm IT / Boss-Referent, 2010–2011

Worked in Firm IT / “Фирма АйТи. Информационные технологии”.

Context:

* Boss-Referent document management system;
* enterprise/government-style document workflow;
* support in Rosreestr context;
* visual interface changes;
* UX improvements.

XPages had just appeared. I studied:

* JavaScript;
* JavaScript in XPages;
* SSJS;
* XPages logic.

Translated Boss-Referent libraries from LotusScript to JavaScript/SSJS manually, without AI. Got it working. Converted 2–3 databases into pure web format for users who did not need full Boss-Referent client, for example:

* parking passes;
* visitors;
* similar small workflow databases.

### Settlement and Savings Bank

Initially supported third-party service for foreign clients:

* English;
* multilingual;
* XPages;
* inherited from previous developer;
* updates and support.

Then worked on automating the bank:

* weekly agile-like schedule;
* weekly plan;
* weekly check;
* weekly report of changes;
* weekly meetings with new departments;
* gathering requirements;
* forming technical scope for next week.

Automated several departments from scratch.

The work revealed gaps in bank operations, especially problems with meeting deadlines. The document/workflow system helped solve this by making processes visible.

By the time the bank closed, there was a full-functioning document workflow system.

Technology:

* IBM Domino;
* Lotus Notes;
* XPages;
* LotusScript;
* JavaScript;
* SSJS;
* XML;
* 1C integration;
* document workflow;
* training;
* rollout;
* process analysis.

### IscTravel

Short but interesting experience.

Used pure Lotus without XPages for web task.

System included:

* template generator;
* website generator;
* email generator;
* integration with fingerprint reader for employee attendance/access;
* internal access/time tracking-like system.

Not long official employment, but technically interesting.

### Synergy Market / Beluga Group

Worked with old tasks and legacy cleanup.

* XPages project bug fixing;
* internal non-XPages databases;
* fixing old bugs;
* clearing backlog left by previous developers/managers;
* strong “came in and cleaned the mess” maintenance experience.

### Directorate of Cultural Centers

This is the strongest IBM Domino transformation case.

Initial state:

* database generated reports/presentations for about 5 hours;
* required dedicated employee;
* export access only for one person;
* separate computer;
* highly manual and inefficient process.

What I did:

* stakeholder research;
* rewrote technical requirements;
* used only data from old system;
* completely changed logic;
* effectively rebuilt system from scratch;
* XPages;
* Java;
* Java agents;
* Apache POI / Excel generation;
* JSON;
* Yandex Maps;
* filters;
* export templates;
* custom table generator;
* report generator;
* field generator;
* web UI;
* user training;
* feedback loops;
* support model.

Cycle:

1. gather data from stakeholders;
2. implement module;
3. import data;
4. present to users/subordinate institutions;
5. gather feedback;
6. announce next module;
7. refine;
8. train again.

This iterative cycle supported adoption across the system.

Performance improvement:

* old reports: up to 5 hours;
* new reports: about 1.5 seconds to 1.5 minutes on average;
* access expanded from one operator to department users;
* system supported 200–300 users calmly;
* optimized Java library/Apache POI generation;
* handled Excel and Apache POI limits.

Excel generation details:

* initially through DOM/objects;
* moved to Java library for speed;
* up to about 40k rows with styling;
* after that streaming mode to append data;
* less styling in streaming mode;
* auto-filtering still possible.

Built advanced templates:

* preconfigured table templates;
* custom table generator;
* user selects tables;
* user selects columns;
* system generates Excel in needed format;
* filters;
* export only needed subset.

Integrated Yandex Maps:

* generated JSON/GeoJSON-like data from Lotus;
* displayed cultural institutions on map;
* Lotus did not natively support this API integration at the time;
* did it directly through XPages instead of relying on Lotus Enterprise Integrator.

Added Tawk.to:

* support operator saw user context;
* page/entity where problem happened;
* user could send link;
* support could fix entity;
* call only if needed;
* parallel support instead of phone-only;
* reduced stress and increased support capacity.

Infrastructure:

* administered Domino/Sametime server;
* migrated server from Windows to Linux/CentOS;
* tested filesystem performance;
* compared Windows vs Linux;
* base worked about 2.5x faster;
* moved servers from Windows to Linux;
* production on physical HP server;
* development/replica on VMware virtual machine;
* database replication;
* nginx reverse proxy;
* caching;
* production/development separation;
* fast response.

The system became extremely fast, usable, supported, with attachments and technical support. It was likely one of the most advanced cultural-sector IT solutions in 2017–2018.

Because of this success, I was promoted upward. It was noticed that I was strong not only technically, but also with people and stakeholders.

### IBM Domino Technologies Used

* IBM Domino;
* Lotus Notes;
* XPages;
* LotusScript;
* SSJS;
* Java;
* Java agents;
* JavaScript;
* Dojo;
* jQuery;
* HTML;
* CSS;
* XML;
* Apache POI;
* Lotus Enterprise Integrator;
* external DLL/library integration;
* OLE/Visual Basic style integrations;
* Domino administration;
* Sametime administration;
* nginx;
* CentOS;
* Linux;
* VMware;
* replication;
* reverse proxy;
* caching;
* JSON/Yandex Maps integration.

### Internal Low-code Before Low-code

In Directorate, built internal low-code-like generators:

* field generator;
* XPages snippet generator;
* generated fields with correct labels/settings;
* added new fields in minutes;
* reduced manual repetitive coding;
* important because urgent tasks sometimes came with one-hour deadlines;
* after cache refresh, fields could be available within 30–60 minutes.

This was low-code thinking before modern low-code platforms became mainstream.

## 13. Strong Current Core Skills

Core technical skills that can be written confidently depending on role:

* Supabase;
* PostgreSQL;
* SQL;
* Supabase Auth;
* Supabase RLS;
* Supabase Edge Functions;
* Supabase Realtime;
* REST APIs;
* API integrations;
* Xano;
* n8n;
* Make.com;
* OpenAI API;
* AI-assisted parsing;
* agentic workflows;
* database-to-GitHub synchronization;
* JavaScript;
* TypeScript practical;
* HTML;
* advanced CSS;
* Vue.js component adaptation;
* WeWeb;
* custom WeWeb components;
* Bubble;
* Glide;
* Python automation;
* Node.js tooling/automation;
* Bash/Linux scripting;
* IBM Domino / Lotus Notes;
* XPages;
* LotusScript;
* SSJS;
* Java in Domino;
* Apache POI;
* PHP practical;
* Figma;
* Webflow targeted;
* Tilda targeted.

## 14. Targeted / Mention Carefully

Targeted skills:

* FlutterFlow — evaluated/light, interested to use;
* Adalo — evaluated only;
* Softr — evaluated only;
* Webstudio — early/evaluated, not preferred;
* Directual — evaluated only;
* AppMaster — evaluated only;
* Adobe XD — learning;
* React — touched/light;
* C++ / C# — historical modification only;
* Activepieces — evaluated;
* Vector DB / Supabase vectors — emerging/planned;
* fal.ai — strong for AI image workflows, but targeted;
* DocsAutomator — targeted for document/report generation;
* Bubble payments plugins — targeted;
* Glide mentoring/fixes — targeted;
* PHP — practical but not headline;
* MySQL — historical/practical, not current core vs PostgreSQL.

## 15. Positioning Interpretation

The overall technical profile is not “no-code developer”.

A more accurate description:

Technology leader / systems architect / full-stack implementation owner with deep hands-on background across enterprise legacy systems, modern Supabase/PostgreSQL backends, WeWeb/Supabase applications, automation platforms, API integrations, AI-assisted delivery, custom components, workflow systems, and operational transformation.

Current modern stack:

* WeWeb;
* Supabase;
* PostgreSQL;
* Edge Functions;
* RLS;
* Realtime;
* n8n;
* Make;
* OpenAI;
* Python/Node automation;
* GitHub/AI agents.

Legacy enterprise foundation:

* IBM Domino;
* Lotus Notes;
* XPages;
* LotusScript;
* Java;
* JavaScript;
* Apache POI;
* workflow/document systems;
* server migration;
* report generation;
* institutional systems.

The strongest pattern:

* enters a messy system;
* understands workflow;
* formalizes data/process logic;
* builds architecture;
* implements frontend/backend/automation;
* integrates services;
* improves performance;
* documents solutions;
* trains users;
* supports adoption;
* turns fragile workflows into maintainable systems.

For technical roles, stack and implementation depth should be visible.

For managerial/executive roles, tools should support the bigger story:

* implementation ownership;
* systems architecture;
* stakeholder alignment;
* platform trade-off judgment;
* legacy modernization;
* adoption;
* governance;
* technical depth without being trapped as “just developer”.

## 16. Strong Resume-Ready Technical Summary

Architecture-led full-stack and automation specialist with deep hands-on experience across Supabase/PostgreSQL, WeWeb, Xano, Bubble, Glide, n8n, Make.com, OpenAI API, Python/Node.js automation, REST APIs, custom components, AI-assisted workflows and legacy IBM Domino enterprise systems. Built production internal tools, client portals, field apps, document/report generation systems, assessment platforms, Telegram-integrated apps, migration workflows and AI-agent-supported delivery pipelines. Strong in backend architecture, RLS/security, SQL optimization, Edge Functions, realtime workflows, API integrations, workflow debugging, custom UI/CSS, platform migration and maintainability trade-offs.

## 17. Strong Resume-Ready Management/Architecture Translation

Technology and implementation leader with a full-stack systems background, able to translate messy operational workflows into governed, maintainable systems. Experience spans legacy enterprise modernization, IT systems architecture, Supabase/PostgreSQL backend design, WeWeb/Supabase full-stack applications, automation workflows, AI-assisted delivery, support model redesign, user training and stakeholder-heavy implementation. Combines hands-on engineering depth with platform trade-off judgment, adoption awareness, documentation discipline and the ability to carry systems from unclear requirements to real operational use.
