# AHGV BUILDVERSE 2026 (PS-02) — Approved Resources & Dependencies List

> **Compliance Status**: 100% compliant with PS-02 Section 13 (Tech Stack) & Section 15 (Zero-Plagiarism Mandate). All libraries are official, production-ready, open-source packages to be integrated natively into our custom TypeScript / Node.js codebase.

---

## 1. Backend Core & API Libraries (Node.js & TypeScript)

| Package Name | npm Install Command | Purpose in PS-02 | Why This Specific Library |
| :--- | :--- | :--- | :--- |
| **`@octokit/rest`** | `npm i @octokit/rest` | **Repository Intelligence (GitHub API)** | Uses the **GitHub Trees API** (`getTree({ recursive: true })`) to fetch the complete file hierarchy in a single API call (<200ms) with zero local cloning and zero LLM tokens. |
| **`officeparser`** | `npm i officeparser` | **Document Intelligence (Multi-format)** | Unified parser supporting **PDF, DOCX, PPTX, TXT, MD, and CSV** in a single async function (`parseOfficeAsync`). Eliminates the need for 5 separate parsing libraries. |
| **`zod`** | `npm i zod` | **API & AI Schema Validation** | Validates all 7 REST endpoint payloads and enforces strict typing on the **19-Section JSON Report** and **Evidence Ledger**. |
| **`@google/genai`** | `npm i @google/genai` | **Targeted AI Reasoning Layer** | Uses Gemini 2.5 / 1.5 Flash for claim extraction and 19-section synthesis with native structured JSON output. Keeps total token cost under **$0.01 per analysis**. |
| **`firebase-admin`** | `npm i firebase-admin` | **Database & Auth Enforcement** | Verifies incoming client Firebase ID tokens (`verifyIdToken`) and handles Firestore reads/writes (`projects`, `evidence`, `reports`, `roadmaps`, `jobs`). |
| **`@babel/parser` & `@babel/traverse`** | `npm i @babel/parser @babel/traverse` | **Deterministic AST Parsing** | Extracts Express, Next.js, and FastAPI routes and exported controllers deterministically without sending code to an LLM. |
| **`sloc`** | `npm i sloc` | **Codebase Metrics** | Deterministically computes total Lines of Code, comment density, and source distribution across languages. |
| **`express` & `cors`** | `npm i express cors helmet` | **REST API Gateway** | Implements the 7 required endpoints with rate limiting, helmet security headers, and CORS protection. |
| **`multer`** | `npm i multer` | **Multipart File Uploads** | Safely handles document uploads (PDF, DOCX, PPTX) in-memory or in temporary storage for analysis. |
| **`p-queue`** | `npm i p-queue` | **Async Job Orchestration** | Lightweight in-memory worker queue to manage background jobs and stage progress without requiring a heavy Redis setup for the MVP. |

---

## 2. Frontend Libraries (Next.js 14 + Tailwind CSS)

| Package Name | npm Install Command | Purpose in PS-02 |
| :--- | :--- | :--- |
| **`next`**, **`react`**, **`react-dom`** | `npx create-next-app@latest` | Core Next.js 14 App Router framework. |
| **`tailwindcss`** | Configured via Next.js | Modern styling, responsive layouts, and strict color tokens for verification badges. |
| **`lucide-react`** | `npm i lucide-react` | Icons for verification statuses (`CheckCircle2`, `AlertTriangle`, `XCircle`, `ShieldCheck`, `FileCode`). |
| **`@radix-ui/react-*`** | `npm i @radix-ui/react-tabs @radix-ui/react-progress @radix-ui/react-dialog` | Headless, accessible primitives for the multi-tab 19-section report viewer and progress bar. |
| **`swr`** | `npm i swr` | Client-side polling hook to query `GET /projects/:id/status` every 2 seconds until completion. |
| **`mermaid`** | `npm i mermaid` | Renders dynamic architecture and dependency flowcharts on the frontend. |
| **`firebase`** | `npm i firebase` | Client-side Firebase Authentication (Google OAuth & Email login) to issue ID tokens. |

---

## 3. Security & Secret Redaction Patterns (Zero-Leakage Standard)

Direct regex patterns inspired by the open-source **Gitleaks** ruleset, compiled into our custom in-memory `secretRedactor.ts`:

* **OpenAI API Key**: `/sk-(?:proj-|live-)?[a-zA-Z0-9_\-]{32,}/g`
* **Google / Firebase Key**: `/AIza[0-9A-Za-z\-_]{35}/g`
* **AWS Access Key ID**: `/AKIA[0-9A-Z]{16}/g`
* **GitHub Personal Access Token**: `/gh[pousr]_[A-Za-z0-9_]{36,255}/g`
* **Private Cryptographic Keys**: `/-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g`
* **Database Connection Strings**: `/(?:postgres|mysql|mongodb|redis):\/\/[^\s'"]+/g`
* **Generic Credential Assignments**: `/(?:api_key|apikey|secret|token|password|auth_token)\s*[:=]\s*['"][a-zA-Z0-9_\-\.\$\/]{8,}['"]/gi`

---

## 4. Open-Source Architectural Reference Projects (Patterns Only)

These repositories serve strictly as conceptual blueprints for algorithms and data structures (zero copy-pasting of foreign code):

1. **[ikonushok/project-readiness-auditor](https://github.com/ikonushok/project-readiness-auditor)**
   * *Reference Concept*: Logic for comparing documentation claims against actual code artifacts and generating structured audit reports.
2. **[SergeyGer/duedil-agent](https://github.com/SergeyGer/duedil-agent)**
   * *Reference Concept*: Prompt architecture for breaking down pitch decks/PRDs into discrete, testable metrics and claims.
3. **[brandondocusen/CntxtJS](https://github.com/brandondocusen/CntxtJS)**
   * *Reference Concept*: Method for mapping JavaScript/TypeScript import-export trees without reading full source files.
4. **[pahen/madge](https://github.com/pahen/madge)**
   * *Reference Concept*: Algorithmic detection of circular dependencies and module relationships.
5. **[zricethezav/gitleaks](https://github.com/gitleaks/gitleaks)**
   * *Reference Concept*: Enterprise secret detection rule specifications and high-entropy token detection.

---

## 5. Official API & Technical Documentation References

* **GitHub Git Database API (Trees)**: [GitHub REST API — Git Trees Documentation](https://docs.github.com/en/rest/git/trees)
* **Google Gemini API**: [Google Generative AI Node.js SDK](https://ai.google.dev/gemini-api/docs/structured-output)
* **Firebase Admin SDK**: [Firebase Admin Node.js Setup](https://firebase.google.com/docs/admin/setup)
* **Next.js App Router**: [Next.js Documentation](https://nextjs.org/docs/app)
* **officeparser**: [officeparser Documentation on npm](https://www.npmjs.com/package/officeparser)
