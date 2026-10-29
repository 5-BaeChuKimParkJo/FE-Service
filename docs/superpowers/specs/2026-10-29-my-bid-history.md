# My bid history

The user asked the agent to choose and immediately implement the next useful
feature. Agent choice: improve /mypage/purchases, whose existing rows repeat an
auction per bid and infer a winner from equal amounts. Use the existing checkout
detail authority rather than invent a financial outcome in the history screen.

## Approach and scope

Reuse the authenticated GET my-bids action and existing Next/React UI. Group the
loaded rows on the server, send only a small display projection to the client,
then filter/search locally. This is a bounded frontend feature. A new backend
winner/payment list would require new API/query contracts; per-card checkout
lookups add unnecessary requests. Neither is needed for this history improvement.

- One card per auction UUID, one entry per unique bidder UUID within that auction.
- Show title, server auction status, current price, own maximum bid, bid count,
  latest bid timestamp and expandable newest-first bid records.
- Default sort is latest bid first; allow own maximum bid descending. Stable UUID
  ordering breaks ties. Choose the highest-version auction snapshot when grouping.
- Search title case-insensitively with trimmed input; filter all/active/ended/
  waiting/cancelled. Counts describe loaded distinct auctions and distinct bids.
- Ended means 종료, never infer 낙찰/유찰 from price equality. Unknown states show
  확인 필요. Detail links use existing /auctions/{id}; ended cards explain that
  the server-authorized detail is where winner/payment status is checked.
- Manual refresh updates the server snapshot. Do not imply real-time updates or
  make payment/reconciliation calls on list rendering.
- Preserve the no-activity empty state, distinguish no filter matches and API
  errors, and provide reset/retry. Existing middleware retains auth control.
- Keep keyboard labels, native details, explicit KST times and mobile readability.

No backend/DB/schema/auth/notification/payment changes or new dependencies. No
local Docker. Existing API excludes hidden/cancelled records; this UI cannot
restore them or provide global server pagination. The view summarizes loaded
history, not authoritative account analytics. Invalid dates display unavailable
instead of crashing. API failures must not become a false empty history.

Validate real grouping/filter logic, actual Next+fixture API interaction on desktop
and mobile, and production read-only behavior. No live bids/payments or data reset.
Use existing checkout/main and standing commit/push/deployment authorization.
