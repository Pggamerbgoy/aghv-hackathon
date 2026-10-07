# AHGV BUILDVERSE 2026 · Problem Statement PS-02
## Build & Validation Agent Engine (Industry Track)

[![Selection Weightage](https://img.shields.io/badge/Selection%20Weightage-20%25-blue.svg)](https://buildverse.in)
[![Completeness](https://img.shields.io/badge/Status-80%2B%25%20Complete%20Working%20Version-emerald.svg)](https://github.com)
[![Architecture](https://img.shields.io/badge/Architecture-Deterministic%20Static%20%2B%20Targeted%20AI-purple.svg)](https://github.com)
[![Security](https://img.shields.io/badge/Secret%20Redaction-Gitleaks%20Enterprise%20Standard-red.svg)](https://github.com)

---

## 1. Executive Summary & Problem Overview

Student builders often accumulate disconnected assets: a half-written README, pitch decks, PRDs, and a GitHub repository. Reviewers, innovation mentors, and hackathon juries face the challenge of determining what is genuinely implemented versus what is merely claimed.

The **Build & Validation Agent** is an autonomous, evidence-first execution and validation layer. It:
1. Performs **authorized, read-only static repository analysis** without cloning entire repos or sending code dumps to an LLM.
2. Extracts discrete, verifiable claims from **PDF, DOCX, PPTX, TXT, and Markdown** documents.
3. Cross-verifies claims against repository code artifacts and builds a **4-Tier Evidence Ledger** (`Verified`, `Partially Verified`, `Not Verified`, `Insufficient Evidence`) with concrete line/file citations.
4. Formulates a **19-Section Structured Validation Report** with a strict visual separation between **FACT / VERIFIED EVIDENCE** and **AI ANALYSIS / RECOMMENDATION**.
5. Derives a **5-Phase Dependency-Aware Execution Roadmap** addressing real missing components.
6. Returns **machine-consumable JSON** directly ready for the host platform's innovation and execution modules.

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│             Next.js 14 Frontend Dashboard                   │
│       (Intake Form, Live Polling, Evidence Ledger,          │
│        19-Section Report Viewer, 5-Phase Roadmap)           │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON (Bearer Auth)
┌──────────────────────────────▼──────────────────────────────┐
│        Build & Validation Agent API Gateway (Port 4000)     │
│   ┌────────────────┐ ┌────────────────┐ ┌────────────────┐  │
│   │ Auth Guard     │ │ Rate Limiting  │ │ Zod Validation │  │
│   └────────────────┘ └────────────────┘ └────────────────┘  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Asynchronous Event Loop
┌──────────────────────────────▼──────────────────────────────┐
│                   Orchestration Engine                       │
│  ┌───────────────────────────┐  ┌─────────────────────────┐ │
│  │ Repository Intelligence   │  │ Document Intelligence   │ │
│  │ (GitHub Trees API, AST,   │  │ (officeparser: PDF,     │ │
│  │  Routes, Test Suite)      │  │  DOCX, PPTX, TXT, MD)   │ │
│  └─────────────┬─────────────┘  └────────────┬────────────┘ │
│                │                             │              │
│                └──────────────┬──────────────┘              │
│                               ▼                             │
│         ┌─────────────────────────────────────────┐         │
│         │   Gitleaks-Grade Secret Redaction       │         │
│         │   & Prompt Injection XML Boundaries     │         │
│         └─────────────────────┬───────────────────┘         │
│                               ▼                             │
│         ┌─────────────────────────────────────────┐         │
│         │   Cross-Verification & Evidence Ledger  │         │
│         │   (Verified / Partial / Not Verified)   │         │
│         └─────────────────────┬───────────────────┘         │
│                               ▼                             │
│         ┌─────────────────────────────────────────┐         │
│         │   19-Section Report + Phased Roadmap    │         │
│         └─────────────────────┬───────────────────┘         │
│                               ▼                             │
│         ┌─────────────────────────────────────────┐         │
│         │  Firebase Firestore & Host Platform JSON │         │
│         └─────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

* **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Lucide Icons.
* **Backend API**: Node.js 18+, Express.js, TypeScript.
* **Database & Auth**: Firebase Firestore & Firebase Admin SDK (with in-memory dev fallback).
* **GitHub Connector**: `@octokit/rest` utilizing the **GitHub Trees API** (single-call file hierarchy, zero local clone).
* **Document Parser**: `officeparser` (Single engine for PDF, DOCX, PPTX, TXT, MD).
* **AI Reasoning Layer**: `@google/generative-ai` (Gemini 1.5/2.5 Flash) with rigid XML prompt injection defense.
* **Job Queue**: Resilient Dual-Mode asynchronous worker queue.

---

## 4. API Specification (7 Mandatory Endpoints)

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `POST` | `/projects/analyze` | Initiates full pipeline asynchronously; returns `jobId` & `projectId` immediately. | `202 Accepted` |
| `POST` | `/projects/validate` | Evaluates submitted idea fields (problem, solution, market, feasibility). | `202 Accepted` |
| `POST` | `/repositories/analyze` | Static inspection of authorized GitHub repo. | `202 Accepted` |
| `POST` | `/documents/analyze` | Ingests documents and extracts discrete verifiable claims. | `202 Accepted` |
| `POST` | `/projects/roadmap` | Generates 5-phase execution plan. | `202 Accepted` |
| `GET` | `/projects/:id/status` | Polled by client: returns `{ stage, progress (0-100), status, error }`. | `200 OK` |
| `GET` | `/projects/:id/report` | Returns the complete 19-section validation report JSON. | `200 OK` |
| `GET` | `/health` | Service health monitor for production readiness. | `200 OK` |

---

## 5. Security & Secret Redaction Mandate

Per PS-02 Section 7.1 & 11, leaking a single credential is a disqualifying defect.
Our engine runs in-memory regex sanitization **before** any string touches an LLM, a database, a log, or the UI:
* OpenAI / Anthropic / Google AI keys (`sk-proj-*`, `AIza*`)
* AWS Access Keys & Secrets (`AKIA*`)
* GitHub Personal Access & Fine-Grained Tokens (`ghp_*`)
* Private Cryptographic Keys (`-----BEGIN PRIVATE KEY-----`)
* Database connection strings with embedded passwords (`mongodb+srv://`, `postgres://`)
* Generic token assignments (`api_key = "..."`, `password = "..."`)

### Prompt Injection Defense
Repository files and PRD documents are untrusted input. All third-party content is encapsulated in strict XML boundaries:
```xml
<untrusted_content source="github" path="README.md">
... user content ...
</untrusted_content>
```
Models operate under system guardrails prohibiting the execution of instructions embedded in these blocks.

---

## 6. AI Cost Optimization Strategy (High Priority)

| Pipeline Step | Optimization Strategy | Token Cost | USD Cost |
| :--- | :--- | :--- | :--- |
| **File Discovery** | GitHub Trees API (Zero clone, zero LLM) | 0 tokens | $0.00 |
| **Static Routes & Deps** | Deterministic AST & regex parsers | 0 tokens | $0.00 |
| **Claim Extraction** | Extracted text from PRD / README | ~3,500 tokens | ~$0.003 |
| **Evidence Matching** | Targeted claim-to-code diff | ~5,000 tokens | ~$0.005 |
| **19-Section Synthesis**| Consolidated final synthesis call | ~8,000 tokens | ~$0.008 |
| **Total Per Run** | — | **<17,000 tokens** | **~$0.01 – $0.02** |

---

## 7. Setup & Run Instructions

### 1. Prerequisites
* Node.js 18+ (tested on Node 24)
* npm 10+

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
Backend will start on `http://localhost:4000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will start on `http://localhost:3000`.

### 4. Running Verification Test
To run an automated end-to-end pipeline test against a live GitHub repository (`Pggamerbgoy/longfun`):
```bash
cd backend
node test_analyze.js
```
