'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateAuctionStore } from '@/stores/use-create-auction-store';
import { uploadImages } from '@/actions/image-service/upload-images';
import { convertStoreDataToApiRequest } from '@/utils/auction';
import { createAuction } from '@/actions/auction-service/create-auction';

export function useAuctionSubmit() {
  const {
    getCreateAuctionCommand,
    setIsSubmitting,
    images,
    tags,
    setTagIds,
    tagIds,
  } = useCreateAuctionStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdAuctionUuid, setCreatedAuctionUuid] = useState<string | null>(
    null,
  );
  const [auctionTitle, setAuctionTitle] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    const storeData = getCreateAuctionCommand();
    if (!storeData) {
      alert('입력 정보를 확인해주세요.');
      return;
    }

    if (storeData.productCondition === '') {
      alert('상품 상태를 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);

    try {
      const files = images
        .map((img) => img.file)
        .filter((file): file is File => file !== undefined);

      if (files.length === 0) {
        throw new Error('업로드할 이미지가 없습니다.');
      }

      // 1. 이미지 업로드
      const uploadedKeys = await uploadImages(files);

      // 3. 경매 등록
      const apiRequest = convertStoreDataToApiRequest(
        {
          ...storeData,
          productCondition: storeData.productCondition as
            | 'unopened'
            | 'new'
            | 'used',
          tagIds,
        },
        uploadedKeys,
      );

      const result = await createAuction(apiRequest);
      // result: { auctionUuid, ... }
      if (result && result.auctionUuid) {
        setIsSuccess(true);
        setCreatedAuctionUuid(result.auctionUuid);
        setAuctionTitle(storeData.title);
        // 썸네일 url 추출 (images 배열에서 첫 번째 url)
        const thumb = images[0]?.url || null;
        setThumbnailUrl(thumb);
      } else {
        throw new Error('경매 등록 결과가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('Auction creation failed:', error);
      alert(
        error instanceof Error
          ? error.message
          : '경매 등록에 실패했습니다. 다시 시도해주세요.',
      );
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  }, [getCreateAuctionCommand, setIsSubmitting, images, tags, setTagIds]);

  const goToAuctionDetail = useCallback(() => {
    if (createdAuctionUuid) {
      router.replace(`/auctions/${createdAuctionUuid}`);
      resetSubmitState();
    }
  }, [createdAuctionUuid, router]);

  const resetSubmitState = useCallback(() => {
    setIsSuccess(false);
    setCreatedAuctionUuid(null);
    setAuctionTitle(null);
    setThumbnailUrl(null);
  }, []);

  return {
    handleSubmit,
    isLoading,
    isSuccess,
    createdAuctionUuid,
    auctionTitle,
    thumbnailUrl,
    goToAuctionDetail,
    resetSubmitState,
  };
}
