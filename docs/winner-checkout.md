# Winner Checkout

Only the authenticated winning bidder can pay the final winning amount.
The auction service owns payment state and frozen prices; the customer UI
never trusts a success URL, member header or SDK promise as payment proof.

## Configuration
Keep the existing application environment. API_URL points the Next server at
Kong; customer requests use /auction-service/api/v1. No new NEXT_PUBLIC Toss
secret or build-time Toss key is needed: an authorized checkout response returns
only the public test client key. Configure test keys on Auction Service only.

Backend release/setup: node-service/docs/winner-payments.md.
Release its schema migration and payment APIs before this customer FE.

## Verification
From this frontend checkout:
```powershell
node node_modules/vitest/vitest.mjs run
node node_modules/typescript/bin/tsc --noEmit
node node_modules/next/dist/bin/next build
```

Fake-provider browser tests need two terminals. After a successful build:
```powershell
# Terminal 1: temporary test-only application server
$env:API_URL='http://127.0.0.1:34420'
node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 4317
```
```powershell
# Terminal 2: the test runner owns the mock API on 34420
$env:E2E_BASE_URL='http://127.0.0.1:4317'
node node_modules/@playwright/test/cli.js test e2e/winner-checkout.spec.ts --workers=1 --retries=0 --max-failures=1
```
The SDK is intercepted and external browser requests are blocked. These tests
do not charge money or validate actual merchant keys. Stop the temporary server
after the test; it is not a deployment.

## Results (2026-10-18)
- 33 unit tests passed; typecheck, lint and production Next build passed.
- 11 desktop/mobile browser scenarios passed against the production build.
- Covered explicit prepare, agreement readiness, server-confirmed success,
  refresh, cancel pending, unknown response recovery, SDK/failure handling,
  forged amounts, winner-only receipt entry and authenticated GET-only SSR.
- Fixed shared Button Slot single-child rendering and deterministic numeric KST
  dates after browser verification found runtime/hydration regressions.

No production deployment, database migration or real-key Toss test performed.
The local dependency junction initially lacked root ESLint plugin resolution;
using the existing eslint-config-next dependency directory through NODE_PATH
allowed the final lint/build to complete without package or lockfile changes.
