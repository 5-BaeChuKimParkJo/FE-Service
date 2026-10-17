# Winner Checkout Implementation Plan

**Goal:** Implement customer winner-only Toss TEST checkout against the supplied backend contract.
**Spec:** `../node-service-auction-details/docs/superpowers/specs/2026-10-17-winner-payments.md`
**Architecture:** Authenticated server actions use the existing cookie/Authorization instance. Server pages only read. Client events prepare and reconcile; success hydration invokes a server confirmation action. Only a prepared READY snapshot can mount v2 order-page widgets.
**Execution:** Implement inline in this existing shared FE worktree. No subagents, dependency installation, sparse checkout changes, commits, push, deployment, or real provider requests.

## Tasks

- [x] Test and implement exact CheckoutView types, decimal-to-safe-number validation, redirect parsing and conservative checkout state helpers.
- [x] Test and implement GET, prepare, confirm and reconcile server actions under `/auction-service/api/v1`, using existing authentication. Confirm compares redirect order/amount to a fresh server snapshot before forwarding the exact body. Fail closed on missing auth, invalid views or non-test configuration.
- [x] Add ended-detail winner entry and checkout/success/fail pages. Initial render performs GET only; prepare is explicit. Pending/uncertain results require reconcile before retry. Render server-confirmed payment status only.
- [x] Test and implement v2 SDK lifecycle: `widgets`, snapshot `setAmount`, methods, agreement, then explicit payment. Handle script/render failures, repeated navigation, cancellation, timeouts and request uncertainty.
- [x] Run all unit tests, typecheck, build, scoped lint and local fake-provider browser checks at mobile/desktop sizes. Review the diff and record results.

## Review Focus

- Decimal overflow, exponent, fraction, duplicate redirect parameters and mismatched order/amount must never reach payment or confirmation.
- UNKNOWN, CONFIRMING, WAITING_FOR_DEPOSIT, CANCELING and DONE without local PAID must never offer another charge.
- Failure URLs, lost responses, returning via browser back, SDK rejection and stale prepared snapshots require a fresh authoritative status before another request.
- Disabled configuration, live/legacy keys, logged-out users and forbidden views never mount the SDK or reveal an entry.
- SDK readiness requires both rendered widgets and required agreement; teardown and late promises must not leave a stale payable widget.

## Progress

- Initial worktree clean on `codex/winner-payments`; contract read. Existing node_modules junction created to the user-specified dependency directory. Initial Vitest run hit a sandbox write restriction in the shared Vite cache; use a nonbundled config loader or scoped escalation for verification.
- Completed 2026-10-18: 33 unit tests, typecheck, lint and Next production build pass.
- Browser tests use a fake provider and fake v2 widget, never real financial calls.
- Fixed existing shared Button `asChild` rendering and pinned numeric KST formatting after browser tests exposed Slot and hydration errors.
- No deployment, production database migration or real-key Toss smoke test performed.
