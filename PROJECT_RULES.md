# AHGV BUILDVERSE 2026 (PS-02) — Strict Scope & Implementation Rules

This project is strictly governed by the official rules defined in [.agents/rules/PS02_REQUIREMENTS_GUARDRAILS.md](file:///.agents/rules/PS02_REQUIREMENTS_GUARDRAILS.md).

### Non-Negotiable Core Tenets:
1. **NO Chatbots**: Multi-step, deterministic, tool-assisted validation agent only.
2. **Mandatory 4-Tier Classification**: Every claim must be `Verified`, `Partially Verified`, `Not Verified`, or `Insufficient Evidence`.
3. **Mandatory Citations**: Every claim must cite the file (`src/auth.ts:L42`), doc section, or line. Unsupported assertions are treated as failure.
4. **Pre-flight Secret Redaction**: Secrets must be scrubbed *before* reaching LLM, DB, logs, or UI.
5. **AI Cost Optimization**: 80% deterministic static analysis (0 LLM tokens for file discovery, trees, routes, dependencies). Targeted calls only (~$0.01/run).
6. **19-Section Report**: Hard visual separation between `FACT / VERIFIED EVIDENCE` and `AI ANALYSIS / RECOMMENDATION`.
7. **5-Phase Concrete Execution Roadmap**: Foundation → Core Product → Integration → Testing → Launch Readiness.
8. **Explicit Limitation Disclosure**: Demo video handling limitations must be explicitly declared in Section 11.
