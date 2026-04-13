# Product Requirements Document (PRD)

**Product:** PortfolioV2 — Personal portfolio and professional presence  
**Owner:** Nay Myo Khant  
**Document version:** 1.0  
**Last updated:** 2026-04-12  

---

## 1. Executive summary

PortfolioV2 is a **marketing and credibility** product: a fast, accessible web experience that presents identity, selected work, and contact paths, with **optional** AI-powered Q&A grounded in approved site content (RAG). Success is measured by clarity of message, performance, maintainability, and safe operation of public APIs.

---

## 2. Goals

### 2.1 Business / personal goals

- Establish a **credible, memorable** professional presence for recruiters, clients, and collaborators.
- Surface **representative projects** with enough depth to demonstrate impact without overwhelming casual visitors.
- Provide **low-friction contact** while resisting abuse (spam, scraping overload).

### 2.2 User goals

| Persona | Primary goals |
|---------|----------------|
| **Recruiter / hiring manager** | Quickly assess fit (skills, experience, work samples); find contact or LinkedIn/GitHub. |
| **Technical peer** | Read case studies; optionally probe details via grounded chat if enabled. |
| **General visitor** | Understand who you are and what you build; smooth experience on mobile. |

### 2.3 Non-goals (explicit)

- Not a full **CMS** for non-technical editors (content is primarily code-backed).
- Not a **multi-tenant** product or authenticated user dashboard.
- RAG is **not** a general internet assistant; answers must stay within **ingested, intentional** knowledge.

---

## 3. Scope

### 3.1 In scope

- **Marketing site:** Home, About, Projects index, per-project case study routes.
- **SEO / discoverability:** `sitemap`, `robots`, web manifest, `llms.txt` for AI crawlers.
- **Contact:** Server route that forwards messages (e.g. Telegram) with validation and rate limits.
- **RAG (optional):** HTTP APIs to ingest text, query vectors, and stream chat grounded in retrieved chunks (Pinecone + Vercel AI SDK).
- **Observability hooks:** Lightweight monitor endpoints (heartbeat / alert) where implemented.
- **Analytics:** Vercel Analytics (or equivalent) for aggregate traffic insight.

### 3.2 Out of scope (current)

- User accounts, roles, or admin UI for content.
- Real-time collaboration or persistent chat history stored in-app (unless added later with clear PRD update).
- Self-hosted vector database; managed Pinecone is the assumed backend for vectors.

---

## 4. Functional requirements

### 4.1 Public pages

| ID | Requirement | Priority |
|----|-------------|----------|
| F-1 | Home explains value proposition, tech breadth, featured work, timeline, and social proof. | P0 |
| F-2 | About expands background and positioning consistently with the rest of the site. | P0 |
| F-3 | Projects page lists case studies with navigation to detail pages. | P0 |
| F-4 | Each case study presents problem, approach, and outcomes in a scannable layout. | P0 |
| F-5 | Layout supports light/dark or theme tokens consistent with design system. | P1 |
| F-6 | Motion respects `prefers-reduced-motion` where animations are used. | P1 |

### 4.2 Contact

| ID | Requirement | Priority |
|----|-------------|----------|
| C-1 | Contact submission validates inputs (length, format) and rejects obvious spam patterns (configurable). | P0 |
| C-2 | Rate limiting by client IP (or equivalent) to reduce abuse. | P0 |
| C-3 | Errors return safe messages; secrets never leak in responses. | P0 |

### 4.3 RAG APIs (when deployed with keys)

| ID | Requirement | Priority |
|----|-------------|----------|
| R-1 | **Ingest:** Accept documents with text and metadata; chunk, embed, upsert to configured index/namespace. | P0 |
| R-2 | **Query:** Semantic search returns ranked chunks with scores and metadata. | P0 |
| R-3 | **Chat:** Streaming response uses retrieved context; configurable models (Groq / OpenAI / Google). | P0 |
| R-4 | Read paths respect rate limits appropriate for public exposure. | P1 |

### 4.4 SEO & AI crawler hints

| ID | Requirement | Priority |
|----|-------------|----------|
| S-1 | Sitemap and robots support canonical indexing strategy. | P1 |
| S-2 | `llms.txt` lists primary URLs and contact hints for LLM-oriented crawlers. | P2 |

---

## 5. Non-functional requirements

| Area | Target / constraint |
|------|----------------------|
| **Performance** | Strong Core Web Vitals on key routes; lazy-load heavy sections where beneficial. |
| **Security** | No secret exposure to client; validate all API inputs (e.g. Zod); least-privilege API keys. |
| **Reliability** | Degrade gracefully if RAG or third-party AI is unavailable (clear errors, no crashes). |
| **Privacy** | Contact and RAG payloads handled only as needed; document data retention in ops runbook. |
| **Maintainability** | Feature-oriented folders (`features/`, `lib/`), typed boundaries, tests on critical API logic. |
| **Cost** | Pinecone + LLM usage monitored; rate limits and `topK` caps to control spend. |

---

## 6. Success metrics

| Metric | How measured | Target |
|--------|----------------|--------|
| **Clarity** | Qualitative review / peer feedback | Visitors describe role and strengths in one sentence after 60s. |
| **Performance** | Lighthouse / Vercel analytics | No regressions on LCP/CLS for home and projects. |
| **Reliability** | Error rates on API routes | Contact + RAG routes: below 1% 5xx under normal traffic. |
| **Abuse resistance** | Contact spam blocked vs. legit | No sustained false positives on manual review. |

---

## 7. Milestones (suggested)

1. **M1 — Core site:** Pages, content, deploy on Vercel, basic SEO.  
2. **M2 — Contact hardening:** Validation, rate limits, monitoring.  
3. **M3 — RAG:** Ingest pipeline, chat UI or documented API consumers, cost guards.  
4. **M4 — Polish:** A11y pass, content refresh, performance budget enforcement.

---

## 8. Open questions

- Should RAG ingestion be **manual** (scripts/curl) only, or is a **protected admin** flow required?
- **Retention:** How long are vectors and logs kept in Pinecone / Vercel?
- **Localization:** English-only for v1, or planned locales?

---

## 9. References

- [Architecture](./architecture.md)
- [ADR index](./adr/README.md)
- Root [README](../README.md) for env vars and curl examples
