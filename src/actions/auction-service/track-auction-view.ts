'use server';

import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { instance } from '@/actions/instance';

const VISITOR_COOKIE = 'auctionVisitorUuid';
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function trackAuctionView(auctionUuid: string): Promise<void> {
  try {
    const cookieStore = await cookies();
    let visitorUuid: string | undefined;

    if (!cookieStore.get('accessToken')?.value) {
      const storedVisitor = cookieStore.get(VISITOR_COOKIE)?.value;
      visitorUuid =
        storedVisitor && UUID_PATTERN.test(storedVisitor)
          ? storedVisitor
          : randomUUID();

      if (visitorUuid !== storedVisitor) {
        cookieStore.set(VISITOR_COOKIE, visitorUuid, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.COOKIE_SECURE !== 'false',
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        });
      }
    }

    // The backend resolves authenticated identity from the bearer token.
    await instance.post(
      `/auction-service/api/v1/auctions/${encodeURIComponent(auctionUuid)}/views`,
      visitorUuid ? { visitorUuid } : {},
    );
  } catch {
    // View collection is best effort and must not interrupt the detail page.
  }
}
