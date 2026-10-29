# My Bid History Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans inline. Steps use checkbox syntax for tracking.

**Goal:** Make personal bid history usable per auction without guessing winners.
**Architecture:** Pure server grouping/display projection, small client filter/search/history list, existing authenticated action and retry boundary.
**Tech Stack:** Existing Next.js/React/TypeScript, Vitest and Playwright; no dependencies.
**Spec:** docs/superpowers/specs/2026-10-29-my-bid-history.md

## Global Constraints

- Frontend only; preserve API/auth/payment contracts and existing no-store action.
- No winner inference, financial calls during list reads, or live test transactions.
- Existing checkout/main, no local Docker/new dependency.
- Scope is loaded history; no server pagination or live notifications.

## Review Focus

- Repeated bids/duplicate response rows must not repeat auctions or inflate counts.
- Highest auction version and latest bid ordering must not depend on row order.
- Equal current/own price must not imply winner status or bypass checkout authority.
- Empty history, no matches and API failure must have distinct usable states.
- Filters, clear/refresh, disclosures and long titles must work at mobile width.

### Task 1: Implement and verify history

Files: src/libs/bidHistory.ts + test; src/test/bidHistoryFixture.ts;
existing MyPurchasesContent wrapper and new MyBidHistoryList component;
mypage/purchases/page.tsx and error.tsx; e2e/my-bid-history.spec.ts.
Interface: summarizeBidHistory(BidHistory[]) → BidHistoryGroup[] with display-only
fields; selectBidHistory(groups, {query,status,sort}) returns a new ordered array.

- [x] Write grouping/filter/status regression tests and observe failure.
- [x] Implement pure grouping/projection, explicit state labels and client controls.
- [x] Add route error/retry and preserve empty history; remove obsolete amount-based status helper if unused.
- [x] Run all unit/convention/type/lint/build checks; actual Next+API fixture browser
      tests for grouping/search/filter/history, empty and error retry on both sizes.
- [ ] Inspect desktop/mobile screenshots; obtain one independent final review,
      address material findings, then commit.

### Task 2: Publish and verify

- [ ] Push main; verify exact-SHA full CI and image publication.
- [ ] Confirm new frontend image, rollout and Argo health/GitOps commit.
- [ ] Read-only live smoke of customer pages and personal history if authorized
      session available; do not create bids/payments to fill a screen.
- [ ] Save verification/limits, sync GitOps and leave checkouts clean.
