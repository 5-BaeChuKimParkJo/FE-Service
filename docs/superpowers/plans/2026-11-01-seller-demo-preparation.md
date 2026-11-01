# Seller Demo Preparation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans inline. Steps use checkbox syntax for tracking.

**Goal:** Prepare or reuse one editable seller demo with an explicit visitor button.
**Architecture:** New seller-only Nest controller/service uses existing demo creation,
new seller-waiting transaction mode; Next availability panel/action/button; optional GitOps config.
**Tech Stack:** Existing Nest/Prisma/PostgreSQL, Next/TypeScript, Vitest/Playwright.
**Spec:** docs/superpowers/specs/2026-11-01-seller-demo-preparation-design.md

## Global Constraints

- Existing checkouts/main publishing authority, no worktrees/local Docker/new dependencies.
- JWT normal user/member equals configured seller UUID; strict {} request, no credentials/config props.
- Reuse owned editable demo under lock and fresh DB clock, including renamed provenance children.
- New title [DEMO] 판매자 수정·취소 체험,1000/current0, source-owned validated media,
  UTC floor(now)+2h start/end+24h, no financial/view/history copying or original resets.
- Advisory serialized prepares; generated-row1minute cooldown includes deleted/cancelled;
  reuse bypasses cooldown. Same transaction auction+existing Outbox; no blind retries.
- Missing/invalid config hides availability; API errors stay errors; normal/admin modes unchanged.
- CI isolated PostgreSQL only; live at most1 new normal demo and second-click reuse;
  preserve originals and financial history, no live bid/payment/edit/cancel/reset.

## Review Focus

- Concurrent requests/response loss produce one waiting resource, not two auctions/events.
- Reuse cannot return started/hidden/cancelled/deleted/bid/checkout/purchase-protected rows,
  including lock waits across start and title changes.
- Config/JWT/body spoofing or template ownership changes cannot create for another seller.
- Cooldown cannot be bypassed by cancelling/deleting a newly prepared row; ordinary modes still work.
- UI false availability, hydration double clicks, malformed UUIDs or unknown results cannot
  leak credentials, retry writes automatically or navigate to an untrusted destination.

### Task 1: Backend and runtime configuration

Under ../node-service: application/service/seller-demo.service.ts+spec;
adapter/in/web/seller-demo.controller.ts+spec; new mode in demo-auction-creation.command.ts,
creation.result.ts and auction-repository.port.type.ts; auction.module.ts factory;
adapter/out/postgresql/auction-prisma.adapter.ts and waiting-seller-demo.query.ts;
new seller-demo-prisma.integration.spec.ts included scripts/run-payment-integration.mjs.
Under ../cncn_private: auction-service.yaml optional seller UUID Secret ref and owned
template literal, reviewed service-identities.json and operator runbook.

Interfaces: GET seller-demo->{available:boolean}; POST {}->{auctionUuid,status:'created'|'reused'}.
SellerDemoService.available(user):boolean; prepare(user,body,now?):Promise<result>.
Demo context mode seller-waiting; reuse result {status:'reused',auctionUuid}; cooldown
{status:'skipped-cooldown'}. Existing created/active/busy interfaces remain compatible.

- [x] Service/auth/strict HTTP boundary tests RED, implement minimum behavior.
- [x] Add locked reuse/DB clock/cooldown and source recheck; actual isolated PG tests for
      concurrency/provenance/protected state/rollback/ordinary modes and CI runner.
- [x] Run full backend unit/checker/naming/architecture/format/builds, GitOps identities/render.
- [x] Commit immutable backend/config review ranges without push.

### Task 2: Preparation panel/action/button

FE files: types/auction/seller-demo.ts; actions/auction-service/seller-demo.ts+test;
app/(minimalLayout)/mypage/sales/\_components/SellerDemoPreparation.tsx (server),
PrepareSellerDemoButton.tsx (client); existing my-sales page panel only after valid list;
e2e/seller-demo-preparation.spec.ts and docs/seller-demo-preparation.md.
Consume Task1 exact paths/results. Availability failures display retry state; ordinary
users get availablefalse. Server action has no client inputs and projects only UUID/status.
Button no automatic retry, ref+hydration guard; full navigation to own management page.

- [x] Action auth/false/error/private/malformed/create/reuse/cooldown tests RED first.
- [x] Implement server panel and guarded client button; preserve native list navigation.
- [x] Full FE unit/checker/type/clean lint/build; actual production Next fixture desktop/mobile
      create/reuse/rapid click/error/cooldown/ordinary user and original list regression; inspect captures.
- [ ] Commit and one fresh read-only cross-repo review; fix Important/Critical once RED→GREEN
      plus required full checks; document Minor and all rulings, no extra reviewer.

### Task 3: Publish and demonstrate

- [ ] Push config/backend, verify exact CI isolated PG/Kafka/build/GHCR and optional env,
      backend image Ready/rollout/Argo; then push FE and verify CI/new exact image.
- [ ] Live seller button creates at most1 waiting demo, second click reuses same UUID;
      desktop/mobile management form editable, original3 rows/history preserved,
      buyer absent button/direct403 and no financial/upload posts or resets.
- [ ] Persist evidence/choices, docs commits skipping duplicate builds, clean synced
      remote heads/healthy images; stop owned preview and delete only task scratch.
