# RSLive - Evidence-Oriented Serbia Relocation Encyclopedia

## Overview

RSLive, also published as **«Инструкция по Сербии»**, is a public knowledge system for people relocating to and living in Serbia.

The project is deliberately split into two layers:

- [`Antiokh/rslive_content`](https://github.com/Antiokh/rslive_content) - the public source of truth for articles, editorial rules, semantic indexing, and content history;
- `Antiokh/rslive.ru` - the private Astro/Starlight engine, components, structured-data integrations, build logic, and deployment automation.

**Role:** Creator, product owner, systems architect, developer, and editor  
**Live:** https://rslive.ru/  
**Public source:** https://github.com/Antiokh/rslive_content

## What the System Does

RSLive turns relocation knowledge into a maintained, versioned information system rather than a loose collection of blog posts.

The editorial model explicitly separates:

- Serbian law and regulations;
- official instructions from authorities;
- established administrative procedure;
- local or office-specific practice;
- user experience;
- editorial estimates and recommendations.

Articles use structured frontmatter, canonical URLs, source-check dates, internal links, and a semantic `CONTENT_INDEX.yml` that acts as a map of pages and related topics.

## Architecture and Delivery

The content and runtime repositories have different responsibilities and are synchronized through GitHub workflows.

```text
rslive_content
  -> versioned MDX articles and editorial rules
  -> semantic content index
  -> repository sync workflow
rslive.ru
  -> Astro 6 / Starlight static application
  -> custom MDX components and structured-data integrations
  -> build and search audits
  -> Cloudflare Pages deployment
```

The runtime includes PWA support, generated navigation, custom MDX components, Supabase and Sanity integrations, generated social images, and AI-facing output such as `llms.txt`.

Content changes are made in the public repository, while engine changes stay isolated in the runtime repository. This prevents content editing from becoming coupled to framework internals and gives each layer a clear source of truth.

## Key Engineering and Product Decisions

### Evidence hierarchy instead of undifferentiated advice

Legal and procedural claims have an explicit source priority, with Serbian laws and official government sources above secondary sources and user experience. The editorial rules also require uncertainty to remain visible when reliable evidence is missing.

### Content as governed data

The repository treats routes, metadata, cross-links, source freshness, and content structure as maintained system state. `CONTENT_INDEX.yml` provides a machine-readable semantic map for navigation and related-content work.

### Content/runtime separation

The public editorial repository and private application repository are intentionally separated. The runtime keeps a synchronized mirror of the content but is not the normal editing surface.

### Deployment as part of editorial workflow

Repository automation connects content changes to the engine build and Cloudflare Pages status, so publication is observable from the source commit instead of being a manual copy-and-paste process.

## Challenges

- Keeping high-stakes legal and administrative information traceable without pretending that law, official instructions, office practice, and personal experience are the same kind of evidence.
- Maintaining a large cross-linked knowledge base while routes, procedures, fees, and source material change over time.
- Letting content evolve independently from the application engine without creating two competing sources of truth.
- Preserving a practical human-facing editorial style while making the corpus structured enough for automated checks, search, navigation, and agent-assisted maintenance.

## Result

RSLive is a working public encyclopedia with a repository-driven editorial and publishing model.

The project demonstrates more than website implementation: it combines information architecture, provenance rules, content governance, static-site engineering, CI/CD, structured data, and long-term maintenance of a changing real-world domain.

## Key Takeaway

This project is a compact example of the same pattern I use in business systems: take fragmented knowledge and informal practice, define sources of truth and responsibility boundaries, turn them into explicit structures and workflows, and make the result maintainable by both people and automation.

## Links

- [Live encyclopedia](https://rslive.ru/)
- [Public content repository](https://github.com/Antiokh/rslive_content)
- [Content repository README](https://github.com/Antiokh/rslive_content/blob/main/README.md)
