# Waiting Auction Management

Approved scope: seller edits/cancels only their waiting auctions; retain cancellation
reason/history and reject requests that race the start of bidding. Implement inline in
the existing repositories, then review, publish and deploy through existing CI/GitOps.

## Approach and author calls

Reuse the existing public/admin full-update endpoint vs add a focused private seller
endpoint: choose the latter. Existing PUT is admin-oriented and accepts fields outside
this scope. Keep its application behavior for internal completion, but restrict public
legacy PUT/DELETE to admins so sellers cannot bypass the new policy. Existing clients
using legacy seller DELETE must switch to cancellation. No new service/dependency.

- GET/PATCH `/auction-service/api/v1/auctions/:uuid/seller` and POST `.../seller/cancel`.
- Verified JWT identity only; non-owned/deleted rows are404. No role supplied by client.
- Read returns five editable fields, version, computed status/editable and latest20
  seller actions (update/cancel, reason code/detail, before/after and timestamp).
- PATCH supplies version and title/description/minimumBid/startAt/endAt only. Strict
  keys; title5–100 trimmed chars, description≤1000, price decimal string1000 through
  2147483647 (existing search consumer int limit). Dates timezone-qualified ISO,
  whole UTC hours, start in future and duration≥1hour, as ordinary creation requires.
- Cancellation requires version and reason code: listing_error, item_unavailable,
  schedule_change, personal_reason, other. Other requires trimmed detail1–200chars;
  predefined reasons have no detail. Persist cancellation as status=cancelled, never
  deletedAt. Preserve all images, ownership, bids, financial records and original values.
  An existing price above this range must be corrected with normal PATCH before cancel;
  do not forge/clamp values in a deletion event or change the search index schema here.
- Writes lock the auction row and recheck visible/not-deleted, future start/end, no bid
  records/current bidder/nonzero current bid, no sold/checkout lock/purchase. Database
  clock and conditional UPDATE protect start-time boundaries after lock contention.
  The existing Kafka batch bid processor must also reject cancelled/hidden/deleted/sold/
  checkout rows under its lock and use exclusive end time evaluated after lock acquisition.
- Version rejects stale forms/double writes with409. No automatic retry after timeout.
- Same transaction saves immutable before/after history and existing Outbox update or
  delete event; cancel removes the item from search through the existing event contract.
- Additive seller-action table migration. Read and write models stay private.
- `/mypage/sales/:uuid` management page; existing cards link to it. Only editable rows
  show edit/cancel forms; all owners can see history and cancellation reasons. Five
  fields, KST whole-hour date inputs, reason select+conditional detail and confirmation.
  Busy lock, accessible labels, fixed errors and full navigation after success/conflict.
- Existing lookup/auth/payment behavior outside these public mutation restrictions is
  unchanged. Images/category/tags/fulfillment editing, admin integration, notifications,
  rescheduling active auctions and new infrastructure are out of scope.

## Verification and release

Policy/HTTP/FE boundary tests first RED→GREEN; meaningful isolated PostgreSQL tests for
ownership, stale versions, cancellation history/Outbox rollback and blocked-request
start-time boundary. They run in CI, never against production/Tailscale databases.
Local full suites, conventions/types/build, desktop/mobile actual Next with fixture,
one fresh whole-change review. Publish backend first; additive migration before new
runtime routes, then FE. Live checks read only: existing seller sample management,
buyer denial, history/noneditable states and image/UI. No real cancellation/bid/payment
or new auction writes are needed to demonstrate release. Record evidence and costs.
