'use server';

import { instance } from '@/actions/instance';
import { ReviewData } from '@/types/review';

export async function sendReviewSellerToBuyer(reviewData: ReviewData) {
  await instance.post('/review-service/api/v1/seller', reviewData);
}
