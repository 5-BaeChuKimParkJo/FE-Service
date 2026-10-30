# Seller demo mode

User approved separate buyer/seller demo login, samples showing waiting/active/ended,
and duplicate prevention. Reuse existing normal account/auction APIs; no new backend
API, auth bypass, financial state changes, local Docker or dependencies.

Extend signInDemo(mode='buyer') with exact buyer|seller validation. Buyer uses existing
server credentials; seller uses DEMO_SELLER_MEMBER_ID/PASSWORD and must be a different
member ID. Never accept client credentials or fall back to the other persona. Both
normal signIn paths set existing cookies and return {ok:true}, no private values.
Home and sign-in offer configured personas, preserve existing buyer labels/callers;
seller navigates to /mypage/sales. Button guards readiness/pending/double clicks and
uses document navigation after successful account change. Shared accounts disclosed.

GitOps adds optional seller Secret references and reviewed identity contract, no
Secret/credentials committed. Operator-only bootstrap script in cncn_private runs
on miniPC against loopback Kong NodePort, explicitly verifies effective fixed SMS
mode before registration (never sends real SMS), creates a distinct random ordinary
seller via existing verification/signup/login, keeps generated credentials only in
Kubernetes Secret/stdin memory, and never rotates existing credentials/passwords.

Bootstrap has a Kubernetes lock, labelled-owned Secret, stable sample titles scoped
to authenticated /auctions/mine, and no POST retry. Re-run skips existing samples.
Recover ambiguous signup/create by normal login/own list on next invocation. Reuse
configured public [DEMO] template metadata, copy its image through normal seller
presigned upload to preserve image ownership. Create at most3 samples with ordinary
whole-hour schedules (waiting+2..26h, active currenthour..+24h, ended-48..-24h), normal
1000 minimum and Outbox path, no bids/payments/views/ranking fabrication. Existing
rows/images/bids/payments are not reset or removed; login creates nothing.

Samples represent actual server time after preparation, so naturally change state;
there is no permanent three-state fixture, automatic reset or replenishment for
these seller samples. Public buyer's existing replenishment remains unchanged.
Killed operator may leave lock; runbook requires checking no bootstrap is running
before manual lock removal. Unreferenced image after an interrupted upload can
remain; no existing object cleanup. No public creation/provision endpoint.

Verify FE unit/type/lint/build, persona browser fixture with three seller samples
and buyer isolation; Python pure/protocol tests including lock/ownership/failed
mode/secret/idempotency/partial failures, GitOps render/identity tests. One fresh
read-only review before main pushes/live bootstrap. Use actual normal signup,
provision3 samples, rerun0 writes, deploy optional references/new FE image and live
desktop/mobile seller vs buyer check without live bids/payments. Canonical existing
checkouts and commit/push/deploy authorization apply, no worktrees.
