import type { CheckoutView } from '@/types/auction/checkout';

export function checkoutFixture(
  overrides: Partial<CheckoutView> = {},
): CheckoutView {
  return {
    enabled: true,
    auctionUuid: 'auction-test-123',
    eligible: true,
    reason: null,
    clientKey: 'test_gck_fake_widget_key',
    purchase: {
      purchaseUuid: 'purchase-test-123',
      buyerUuid: 'buyer-test',
      sellerUuid: 'seller-test',
      amount: '15000',
      orderName: '테스트 경매 상품',
      customerKey: 'random-customer-test',
      status: 'AWAITING_PAYMENT',
      paidAt: null,
      attempt: {
        orderId: 'order_test_123',
        status: 'READY',
        method: null,
        approvedAt: null,
        cancelReason: null,
        errorCode: null,
      },
    },
    ...overrides,
  };
}
