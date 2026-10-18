import { beforeEach, describe, expect, it, vi } from 'vitest';

const { put, revalidatePath } = vi.hoisted(() => ({
  put: vi.fn(),
  revalidatePath: vi.fn(),
}));
vi.mock('@/actions/instance', () => ({ instance: { put } }));
vi.mock('next/cache', () => ({ revalidatePath }));
import { updateMemberInfo } from './update-member-info';

describe('profile updates', () => {
  beforeEach(() => vi.resetAllMocks());

  it('refreshes previously visited profile and home views after a successful image update', async () => {
    put.mockResolvedValue(undefined);
    await updateMemberInfo({ profileImageKey: 'member/user/images/new.png' });
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
  });

  it('does not invalidate views when the update fails', async () => {
    put.mockRejectedValue(new Error('upload unavailable'));
    await expect(updateMemberInfo({ profileImageKey: 'new.png' })).rejects.toThrow();
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
