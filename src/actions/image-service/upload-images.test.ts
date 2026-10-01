import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getPresignedUrls, uploadFileToS3, post } = vi.hoisted(() => ({
  getPresignedUrls: vi.fn(),
  uploadFileToS3: vi.fn(),
  post: vi.fn().mockResolvedValue({ key: 'direct-upload-key' }),
}));

vi.mock('./get-presigned-urls', () => ({ getPresignedUrls }));
vi.mock('./upload-to-s3', () => ({ uploadFileToS3 }));
vi.mock('@/actions/instance', () => ({ instance: { post } }));

import { uploadImages } from './upload-images';

describe('uploadImages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uploads each image through its MinIO presigned POST and returns object keys', async () => {
    const files = [
      new File(['first'], 'first.webp', { type: 'image/webp' }),
      new File(['second'], 'second.png', { type: 'image/png' }),
    ];
    getPresignedUrls.mockResolvedValue([
      { uploadUrl: 'http://minio.local/bucket', fields: { key: 'first-key' }, key: 'first-key' },
      { uploadUrl: 'http://minio.local/bucket', fields: { key: 'second-key' }, key: 'second-key' },
    ]);

    await expect(uploadImages(files)).resolves.toEqual(['first-key', 'second-key']);
    expect(getPresignedUrls).toHaveBeenCalledWith([
      { fileName: 'first.webp', contentType: 'image/webp' },
      { fileName: 'second.png', contentType: 'image/png' },
    ]);
    expect(uploadFileToS3).toHaveBeenNthCalledWith(
      1,
      files[0],
      'http://minio.local/bucket',
      { key: 'first-key' },
    );
    expect(uploadFileToS3).toHaveBeenNthCalledWith(
      2,
      files[1],
      'http://minio.local/bucket',
      { key: 'second-key' },
    );
  });
});
