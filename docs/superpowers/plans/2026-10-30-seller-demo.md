# Seller Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans inline. Steps use checkbox syntax for tracking.

**Goal:** Let portfolio visitors sign in as a distinct seller and inspect sample listings.
**Architecture:** Existing normal auth server action + configured persona UI;
operator-only Python bootstrap uses normal APIs and Kubernetes-owned Secret/lock.
**Tech Stack:** Existing Next/TypeScript, Python stdlib, Kustomize/Kubernetes.
**Spec:** docs/superpowers/specs/2026-10-30-seller-demo.md

## Global Constraints

- No backend API/auth bypass/dependencies/local Docker; no financial state fabrication.
- Client chooses exact buyer/seller only, server-held credentials, separate identities.
- Fixed SMS guard and loopback API for bootstrap; no credentials/tokens in files/logs.
- At most3 ordinary sample creates; lock + own-list stable-title dedupe; no POST retries.
- Initial actual states evolve naturally, no automatic reset; preserve existing data.

## Review Focus

- Invalid persona/missing/same-account config cannot authenticate as another persona.
- Wrong verification mode or foreign Secret/lock fails before mutation or SMS.
- Partial response loss/repeat/bootstrap concurrency does not duplicate or reset history.
- Samples and copied media belong to the new normal seller; no fabricated financial events.
- Buttons/home/login/role redirects and private props behave on desktop/mobile.

### Task 1: Safe seller bootstrap and configuration

Files in ../cncn_private: scripts/bootstrap_seller_demo.py,
scripts/tests/test_bootstrap_seller_demo.py, .github/workflows/homelab-manifests.yml,
envs/homelab/applications/chalnak/frontend.yaml, .conventions/service-identities.json,
docs/runbooks/seller-demo.md. Reuse existing ApiClient upload implementation.
Produces labelled chalnak-seller-demo-secrets with member-id/password only referenced
by frontend plus private resumability state; stable3 ordinary auctions by seller.

- [x] Write bootstrap protocol/payload/guard/idempotency failure tests, observe missing module RED.
- [x] Implement normal API provisioning, fixed-mode guard, labelled Secret/lock and stable samples.
- [x] Add optional frontend env/identity contract and CI for bootstrap tests.
- [ ] Run Python tests/identity/manifests render; commit immutable review range, no push yet.

### Task 2: Persona sign-in experience

Files: actions/auth-service/sign-in-demo.ts+test; libs/demoSignIn.ts+test;
components/sign-in/DemoSignInButton.tsx, DemoSignInOptions.tsx;
home/sign-in pages, e2e/seller-demo.spec.ts, docs.
Consumes optional server seller env; seller redirects /mypage/sales, buyer callers compatible.

- [x] Add exact persona/no fallback/private response tests and observe RED.
- [x] Implement server action, availability helper/options and guarded button/navigation.
- [x] Run unit/checker/type/lint/build and actual Next desktop/mobile persona fixture tests; screenshots.
- [ ] Commit; one fresh read-only cross-repo review and fix material findings RED→GREEN once.

### Task 3: Provision, publish and verify

- [ ] Run reviewed bootstrap on miniPC; create distinct seller/3 samples via normal APIs,
      verify waiting/active/ended and second invocation creates0/uploads0; no bid/payment.
- [ ] Push FE and GitOps config, verify CI/optional Secret contract/image/rollout/Argo.
- [ ] Live seller login/my-sales three states, buyer different identity/no seller listings,
      repeated sign-in causes no new rows; desktop/mobile and no sensitive output.
- [ ] Persist proof/decisions, commit docs, sync GitOps, exact task scratch cleanup.
