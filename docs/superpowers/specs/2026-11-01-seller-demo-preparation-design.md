# Seller Demo Preparation

Approved: a seller-demo preparation button that reuses an editable owned demo or
creates one waiting demo, rejects concurrent duplicates, and preserves all history.
Keep existing repositories/CI/GitOps, implement inline; no new service/dependency,
local Docker, production DB integration tests, resets or financial writes.

## Approach and author choices

Choose the existing normal demo creation use case with a new seller-waiting mode,
rather than a cron/reset pipeline or an independent generator. Existing creation
already checks taxonomy, owned image keys and file existence, then inserts auction
and Outbox together. Reuse its private demoTemplateUuid provenance/advisory lock.
No migration is required. Existing admin manual/automatic active demos are unchanged.

- Verified normal member/user JWT must match DEMO_SELLER_MEMBER_UUID. GET
  /auction-service/api/v1/auctions/seller-demo returns {available:boolean}; POST
  accepts {} only and returns {auctionUuid,status:created|reused}. No client owner,
  template, schedule, price, image or financial fields. Admin/other accounts cannot prepare.
- Configure the account from the existing seller Secret member-uuid optional ref.
  DEMO_SELLER_TEMPLATE_UUID is an explicit existing owned ended demo, following the
  existing public-template UUID configuration pattern. Missing/invalid config disables
  availability. Chosen owned source:2f63392b-028d-418e-850f-de66ab7ef4ad, read normally
  without changing it. A missing/changed/hidden/deleted source fails safely; no fallback
  to another owner's template or images. UI never receives config/credentials.
- New auction: title [DEMO] 판매자 수정·취소 체험, fixed portfolio disclaimer,
  minimum1000/current0, no bidder/sold/checkout/purchase/history copying. Use the source's
  category/tags/condition/owned image references through normal validation, no upload.
  Start at UTC hour floor(now)+2hours (1–2hours ahead), end24hours later. No view/bid/payment fabrication.
- Serialize seller-waiting prepares using the existing template-scoped advisory lock.
  Under the transaction, lock owned candidates and recheck DB clock and all seller
  editability restrictions. Eligible candidates have matching provenance, source UUID,
  or [DEMO] title; provenance still works after renaming. Exclude hidden/cancelled/deleted,
  started/ended, bid records/current bid, sold/checkout/purchase. Return UUID only on reuse.
- If no eligible row exists and a generated child was created within1minute, return
  429 SELLER_DEMO_COOLDOWN. Include cancelled/deleted children in cooldown. Reuse ignores
  cooldown. Normal administrative active-demo behavior is preserved. The cap applies
  only to this button/API, not unrelated ordinary creation or account-wide abuse control.
- New row and ordinary Outbox commit together. Failed/unknown responses never trigger
  automatic retries; a later explicit click reuses the committed resource. No permanent
  request-key guarantee after the resource is subsequently modified/cancelled.
- On my-sales show the panel only when availability is true. A failed availability read
  is an error/reload state, not false success. One shared busy/ref guard, disabled until
  hydration, fixed errors, and full navigation to /mypage/sales/:uuid after success.
  Other users see no button. Existing lists/filters/forms/auth remain intact.

## Verification and release

RED→GREEN service/HTTP/FE boundary tests; actual isolated PG concurrency, reuse after
rename, protected states, cooldown, rollback and ordinary mode regressions through
existing CI (never production DB). Local suites/checkers/clean lint/build, production
Next desktop/mobile fixture and my-sales regression; one fresh static review.
Apply optional config/backend first, verify CI/image/readiness; then FE. Live normal
seller button may create at most one new demo and a second click must reuse it, then
read its management form on desktop/mobile. This is authorized feature preparation,
not a financial test. Preserve original3 auctions and all prior bids/payments/images.
No live edit/cancel/bid/payment/reset. Record exact evidence and constraints.
