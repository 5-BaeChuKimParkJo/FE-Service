'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateAuctionStore } from '@/stores/use-create-auction-store';
import { uploadImages } from '@/actions/image-service/upload-images';
import { convertStoreDataToApiRequest } from '@/utils/auction';
import { createAuction } from '@/actions/auction-service/create-auction';

export function useAuctionSubmit() {
  const { getCreateAuctionCommand, setIsSubmitting, images, tagIds, reset } =
    useCreateAuctionStore();
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

      const uploadedKeys = await uploadImages(files);

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
      if (result && result.auctionUuid) {
        setIsSuccess(true);
        setCreatedAuctionUuid(result.auctionUuid);
        setAuctionTitle(storeData.title);
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
  }, [getCreateAuctionCommand, setIsSubmitting, images, tagIds]);

  const resetSubmitState = useCallback(() => {
    setIsSuccess(false);
    setCreatedAuctionUuid(null);
    setAuctionTitle(null);
    setThumbnailUrl(null);
  }, []);

  const goToAuctionDetail = useCallback(() => {
    if (createdAuctionUuid) {
      resetSubmitState();
      router.replace(`/auctions/${createdAuctionUuid}`); // replace 사용하여 히스토리 교체
      // 페이지 이동 후 스토어 초기화
      setTimeout(() => {
        reset();
      }, 0);
    }
  }, [createdAuctionUuid, router, resetSubmitState, reset]);

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
