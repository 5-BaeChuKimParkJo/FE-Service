'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Tag } from 'lucide-react';
import Image from 'next/image';
import { useCreateAuctionStore } from '@/stores/use-create-auction-store';
import { useCategories } from '@/hooks/useCategories';
import { findCategoryById } from '@/utils/category';

export function Step3Preview() {
  const {
    title,
    description,
    categoryId,
    images,
    minimumBid,
    startAt,
    endAt,
    productCondition,
    isDirectDeal,
    directDealLocation,
    getCreateAuctionCommand,
    setIsSubmitting,
  } = useCreateAuctionStore();

  // 카테고리 데이터 가져오기
  const { data: categories = [] } = useCategories();

  const productConditions = {
    unopened: '미개봉',
    new: '새상품',
    used: '중고',
  };

  const selectedCategory = findCategoryById(categories, categoryId);

  const handleSubmit = React.useCallback(async () => {
    const command = getCreateAuctionCommand();
    if (!command) {
      alert('입력 정보를 확인해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 여기서 실제 API 호출
      console.log('Submitting auction:', command);

      // TODO: 실제 API 호출 구현
      // await createAuction(command);

      alert('경매가 성공적으로 등록되었습니다!');
      // 성공 후 페이지 이동
      window.location.href = '/';
    } catch (error) {
      console.error('Auction creation failed:', error);
      alert('경매 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }, [getCreateAuctionCommand, setIsSubmitting]);

  // Step3 컴포넌트에 handleSubmit 함수를 노출
  React.useEffect(() => {
    const element = document.querySelector('[data-step="3"]') as HTMLElement & {
      handleSubmit?: () => void;
    };
    if (element) {
      element.handleSubmit = handleSubmit;
    }
  }, [handleSubmit]);

  return (
    <div className='flex-1 overflow-y-auto p-4 pb-20' data-step='3'>
      <div className='max-w-2xl mx-auto space-y-6'>
        {/* 미리보기 제목 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center'
        >
          <h2 className='text-xl font-bold text-gray-900 mb-2'>
            경매 등록 미리보기
          </h2>
          <p className='text-sm text-gray-600'>
            정보를 확인하고 경매를 등록해주세요
          </p>
        </motion.div>

        {/* 상품 정보 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='bg-white rounded-lg border border-gray-200 p-6 space-y-4'
        >
          <h3 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
            <Tag className='w-5 h-5' />
            상품 정보
          </h3>

          {/* 대표 이미지 */}
          {images.length > 0 && (
            <div className='aspect-square w-full max-w-xs mx-auto rounded-lg overflow-hidden border border-gray-200 relative'>
              <Image
                src={images[0].url || '/api/placeholder/300/300'}
                alt='대표 이미지'
                fill
                className='object-cover'
              />
            </div>
          )}

          {/* 기본 정보 */}
          <div className='space-y-3'>
            <div>
              <p className='text-sm font-medium text-gray-700'>제목</p>
              <p className='text-lg text-gray-900'>{title}</p>
            </div>

            <div>
              <p className='text-sm font-medium text-gray-700'>카테고리</p>
              <div className='flex items-center gap-2'>
                {selectedCategory && (
                  <>
                    <div className='w-5 h-5 rounded overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0'>
                      {selectedCategory.imageUrl ? (
                        <Image
                          src={selectedCategory.imageUrl}
                          alt={selectedCategory.name}
                          width={20}
                          height={20}
                          className='object-cover'
                        />
                      ) : (
                        <span className='text-sm'>📦</span>
                      )}
                    </div>
                    <span className='text-gray-900'>
                      {selectedCategory.name}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div>
              <p className='text-sm font-medium text-gray-700'>상품 상태</p>
              <p className='text-gray-900'>
                {productConditions[productCondition]}
              </p>
            </div>

            <div>
              <p className='text-sm font-medium text-gray-700'>상품 설명</p>
              <p className='text-gray-900 whitespace-pre-wrap'>{description}</p>
            </div>

            <div>
              <p className='text-sm font-medium text-gray-700'>이미지</p>
              <div className='flex gap-2 overflow-x-auto'>
                {images.map((image, index) => (
                  <div
                    key={image.key}
                    className='relative flex-shrink-0 w-20 h-20'
                  >
                    <Image
                      src={image.url || '/api/placeholder/80/80'}
                      alt={`이미지 ${index + 1}`}
                      width={80}
                      height={80}
                      className='object-cover rounded border border-gray-200'
                    />
                    {index === 0 && (
                      <div className='absolute -top-1 -right-1 bg-purple-600 text-white text-xs px-1 rounded'>
                        대표
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 경매 설정 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='bg-white rounded-lg border border-gray-200 p-6 space-y-4'
        >
          <h3 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
            <Clock className='w-5 h-5' />
            경매 설정
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <p className='text-sm font-medium text-gray-700'>최소 입찰가</p>
              <p className='text-xl font-bold text-purple-600'>
                {parseInt(minimumBid).toLocaleString()}원
              </p>
            </div>

            <div>
              <p className='text-sm font-medium text-gray-700'>경매 시간</p>
              <div className='space-y-1'>
                {startAt && (
                  <p className='text-sm text-gray-900'>
                    시작: {startAt.toLocaleString('ko-KR')}
                  </p>
                )}
                {endAt && (
                  <p className='text-sm text-gray-900'>
                    종료: {endAt.toLocaleString('ko-KR')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 거래 방식 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='bg-white rounded-lg border border-gray-200 p-6 space-y-4'
        >
          <h3 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
            <MapPin className='w-5 h-5' />
            거래 방식
          </h3>

          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-green-500 rounded-full'></div>
              <span className='text-gray-900'>택배 거래</span>
            </div>
            {isDirectDeal && (
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <span className='text-gray-900'>
                  직거래 ({directDealLocation})
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* 주의사항 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'
        >
          <h4 className='font-medium text-yellow-800 mb-2'>주의사항</h4>
          <ul className='text-sm text-yellow-700 space-y-1'>
            <li>• 경매 등록 후 상품 정보 수정이 제한됩니다.</li>
            <li>• 허위 상품이나 금지 품목은 제재 대상입니다.</li>
            <li>• 낙찰 후 거래를 완료해야 합니다.</li>
          </ul>
        </motion.div>

        {/* 등록 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className='pt-4'
        >
          <button
            onClick={handleSubmit}
            className='w-full bg-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            경매 등록하기
          </button>
        </motion.div>
      </div>
    </div>
  );
}
