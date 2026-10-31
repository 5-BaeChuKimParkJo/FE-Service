# Waiting Auction Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans inline. Steps use checkbox syntax for tracking.

**Goal:** Let sellers edit/cancel waiting auctions with audit history and race protection.
**Architecture:** Focused private Nest controller/service/port+Prisma adapter, shared
transactional Outbox; private Next actions/forms linked from existing seller cards.
**Tech Stack:** Existing Nest/Prisma/PostgreSQL, Next/TypeScript, Vitest/Playwright.
**Spec:** docs/superpowers/specs/2026-10-31-seller-management-design.md

## Global Constraints

- Existing checkouts, no worktrees/local Docker/new dependencies; inline execution.
- Normal verified JWT ownership,404 for other owners/deleted, strict input keys.
- Five edit fields only; version0..2147483647; title5–100, description≤1000,
  price string1000..2147483647, ISO whole-hour dates/future start/duration≥1h.
- Cancel reason codes listing_error/item_unavailable/schedule_change/personal_reason/other;
  other detail1–200, predefined detail absent; preserve existing data and history.
- Visible/future/no bids/currentBid0/currentBiddernull/soldnull/checkoutnull/no purchase;
  DB row lock+clock_timestamp predicate, stale version409; no blind write retries.
- History+Outbox same transaction; cancel status not deletion. Latest20 actions read.
- No financial writes or production integration tests. Isolated PG through existing CI.
- Legacy public PUT/DELETE admin-only; internal completion remains unchanged.

## Review Focus

- Start time crosses while request waits for lock: conditional SQL must reject with409.
- Concurrent/stale form update or cancellation cannot overwrite new state or duplicate audit.
- Alternate old PUT/DELETE or injected fields cannot bypass owner/state/financial restrictions.
- Error response/timeout never leaks private upstream details or silently retries a write.
- History/Outbox failures roll back mutation; canceled samples never reappear publicly.

### Task 1: Atomic private seller management backend

Files under ../node-service:
domain/model/seller-auction-policy.ts+spec; application/model/seller-auction.command.ts,
seller-auction.result.ts, port/out/seller-auction.port.ts, service/seller-auction.service.ts;
adapter/in/web/seller-auction.controller.ts+spec; adapter/out/postgresql/
seller-auction-prisma.adapter.ts+integration.spec, auction-outbox.ts;
existing auction-prisma.adapter.ts delegates unchanged Outbox generation; module/provider,
auction.controller.ts public legacy mutation guards; schema+20261031010000_seller_actions;
scripts/run-payment-integration.mjs includes new isolated suite.

Interfaces: GET returns {auctionUuid,title,description,minimumBid,startAt,endAt,version,
status,editable,history:[{action,reasonCode,reasonDetail,before,after,createdAt}]}.
Service read(memberUuid,auctionUuid) returns result; change(memberUuid,auctionUuid,unknownInput,action)
returns void, controller returns {ok:true}; adapter read returns null for non-owned; mutate consumes validated
UpdateSellerAuctionCommand|CancelSellerAuctionCommand with action/version and returns void.

- [x] Write policy validation/state boundary tests and HTTP private/strict/legacy tests; observe RED.
- [x] Implement model/service/controller and locked adapter with additive schema/history/Outbox.
- [x] Write actual isolated PG integration tests for owner/state/stale/contention/rollback;
      include them in CI runner; local guarded skips are not integration success.
- [x] Run unit/checkers/format/types+build all; commit without push for final review.

### Task 2: Seller management page and safe forms

Files under FE: types/auction/seller-management.ts, libs/sellerManagement.ts+test;
actions/auction-service/seller-management.ts+test; app/(minimalLayout)/mypage/sales/
[auctionUuid]/page.tsx+\_components/SellerAuctionForm.tsx; MySaleCard.tsx;
e2e/seller-management.spec.ts; docs/seller-management.md.

Consumes Task1 routes/result. Pure parser whitelists response and handles exact prices,
KST conversion, version/state/reasons. Actions getSellerAuction(id),
updateSellerAuction(id,input), cancelSellerAuction(id,input) return discriminated safe
results; anonymous/invalid skip upstream calls. Form uses original version, sends only
exact five fields or reason, no optimistic state mutation. Conflict asks reload.

- [x] Boundary/normalization/version/reason and malformed/private/error tests RED first.
- [x] Implement private action and accessible page/form; link owner cards and recent history.
- [x] Local full FE suite/conventions/types/lint/build; actual Next fixture desktop/mobile
      save/cancel/other detail/confirm/stale/no duplicate/readonly/nonowner and screenshots.
- [x] Commit and create one fresh whole-change review for both repos; fix Important/Critical
      once with reproducing RED→GREEN tests and final full checks, no second review.

### Task 3: Publish backend then frontend and verify release

- [ ] Push backend; verify exact full CI unit+isolated PG/Kafka+build/GHCR.
- [ ] Apply additive migration through existing release procedure; exact backend image
      ready/rollout/Argo, then push FE and verify CI/image/runtime.
- [ ] Read-only live desktop/mobile seller page/fields/history/state, buyer404 and old
      seller PUT/DELETE denial (not a successful write); no financial/demo reset writes.
- [ ] Persist proof/rulings and docs commits (skip duplicate image builds), sync GitOps,
      verify clean remote heads and healthy rollout, clean only owned scratch/process.
