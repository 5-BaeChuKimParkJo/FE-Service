export type CheckoutAttemptStatus =
  | 'READY'
  | 'CONFIRMING'
  | 'UNKNOWN'
  | 'WAITING_FOR_DEPOSIT'
  | 'DONE'
  | 'CANCELING'
  | 'CANCELED'
  | 'ABORTED'
  | 'EXPIRED';

export type CheckoutView = {
  enabled: boolean;
  auctionUuid: string;
  eligible: boolean;
  reason: string | null;
  clientKey: string | null;
  purchase: null | {
    purchaseUuid: string;
    buyerUuid: string;
    sellerUuid: string;
    amount: string;
    orderName: string;
    customerKey: string;
    status: 'AWAITING_PAYMENT' | 'PAID' | 'CANCELED';
    paidAt: string | null;
    attempt: null | {
      orderId: string;
      status: CheckoutAttemptStatus;
      method: string | null;
      approvedAt: string | null;
      cancelReason: string | null;
      errorCode: string | null;
    };
  };
};

export type CheckoutReturnQuery = Record<string, string | string[] | undefined>;

export type CheckoutConfirmation = {
  orderId: string;
  paymentKey: string;
  amount: string;
};

export type CheckoutResult =
  | { ok: true; view: CheckoutView }
  | {
      ok: false;
      error: {
        code:
          | 'AUTH_REQUIRED'
          | 'FORBIDDEN'
          | 'UNAVAILABLE'
          | 'INVALID_RETURN'
          | 'REQUEST_FAILED';
        message: string;
      };
    };
