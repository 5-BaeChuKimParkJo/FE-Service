import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as thumbnails from './get-chatroom-thumbnails';

const { post } = vi.hoisted(() => ({ post: vi.fn() }));
vi.mock('@/actions/instance', () => ({ instance: { post } }));

describe('getChatroomThumbnails', () => {
  beforeEach(() => vi.clearAllMocks());

  it('uses the existing catalog endpoint and returns its thumbnail contract', async () => {
    const result = [{ id: 'auction', thumbnailUrl: '/thumbnail.webp' }];
    post.mockResolvedValue(result);
    expect('getChatroomThumbnails' in thumbnails).toBe(true);
    await expect(
      thumbnails.getChatroomThumbnails(['auction']),
    ).resolves.toEqual(result);
    expect(post).toHaveBeenCalledWith(
      '/catalog-query-service/api/v1/thumnails',
      { ids: ['auction'] },
    );
  });
});
