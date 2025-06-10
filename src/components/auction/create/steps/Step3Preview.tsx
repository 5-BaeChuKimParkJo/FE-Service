'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Package, DollarSign } from 'lucide-react';
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
    duration,
    productCondition,
    isDirectDeal,
    directDealLocation,
    getCreateAuctionCommand,
    setIsSubmitting,
  } = useCreateAuctionStore();

  // 카테고리 데이터 가져오기
  const { data: categories = [] } = useCategories();

  const productConditions = {
    unopened: '미개봉 상품',
    new: '새상품',
    used: '중고 상품',
    '': '선택 안됨',
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
        {/* 상품 정보 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='border rounded-xl bg-white p-6 space-y-5'
        >
          <div className='flex items-center space-x-2 pb-3 border-b'>
            <Package className='w-5 h-5 text-primary-100' />
            <h3 className='text-lg font-semibold text-gray-900'>상품 정보</h3>
          </div>

          <div className='space-y-4'>
            {/* 제목 */}
            <div>
              <p className='text-sm font-medium text-gray-500 mb-1'>상품명</p>
              <p className='pl-2 text-lg font-medium text-gray-900'>{title}</p>
            </div>

            {/* 카테고리 */}
            <div>
              <p className='text-sm font-medium text-gray-500 mb-2'>카테고리</p>
              <div className='flex items-center space-x-3'>
                {selectedCategory ? (
                  <>
                    <div className='w-8 h-8 rounded-lg bg-primary-100/ flex items-center justify-center'>
                      {selectedCategory.imageUrl ? (
                        <Image
                          src={selectedCategory.imageUrl}
                          alt={selectedCategory.name}
                          width={24}
                          height={24}
                          className='object-cover rounded'
                        />
                      ) : (
                        <span className=' text-lg'>📦</span>
                      )}
                    </div>
                    <span className='font-medium text-gray-900'>
                      {selectedCategory.name}
                    </span>
                  </>
                ) : (
                  <span className='text-gray-400'>
                    카테고리가 선택되지 않았습니다
                  </span>
                )}
              </div>
            </div>

            {/* 상품 상태 */}
            <div>
              <p className='text-sm font-medium text-gray-500 mb-1'>
                상품 상태
              </p>
              <p className='pl-2 font-medium text-gray-900'>
                {
                  productConditions[
                    productCondition as keyof typeof productConditions
                  ]
                }
              </p>
            </div>

            <div>
              <p className='text-sm font-medium text-gray-500 mb-2'>
                상품 설명
              </p>
              <div className='border-gray-300 border rounded-lg p-3'>
                <p className='text-gray-900 whitespace-pre-wrap text-sm leading-relaxed'>
                  {description}
                </p>
              </div>
            </div>

            <div>
              <p className='text-sm font-medium text-gray-500 mb-2'>
                상품 이미지
              </p>
              <div className='pl-1 grid grid-cols-4 gap-3'>
                {images.map((image, index) => (
                  <div
                    key={image.key}
                    className='relative aspect-square rounded-lg overflow-hidden border'
                  >
                    <Image
                      src={image.url || '/api/placeholder/100/100'}
                      alt={`상품 이미지 ${index + 1}`}
                      fill
                      className='object-cover'
                    />
                    {index === 0 && (
                      <div className='absolute top-1 left-1 bg-primary-100 text-white text-xs px-1.5 py-0.5 rounded'>
                        대표
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='border rounded-xl bg-white p-6 space-y-5'
        >
          <div className='flex items-center space-x-2 pb-3 border-b'>
            <DollarSign className='w-5 h-5 text-primary-100' />
            <h3 className='text-lg font-semibold text-gray-900'>경매 설정</h3>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <p className='text-sm font-medium text-gray-500'>최소 입찰가</p>
              <div className='border-primary-100/10 border rounded-lg p-4'>
                <p className='text-2xl text-gray-900'>
                  {parseInt(minimumBid).toLocaleString()}원
                </p>
              </div>
            </div>

            <div className='space-y-2'>
              <p className='text-sm font-medium text-gray-500'>경매 시간</p>

              <div className='space-y-2'>
                <div className=' rounded-lg p-3 border border-gray-200'>
                  <p className='text-xs text-gray-500 mb-1'>총 경매 시간</p>
                  <p className='pl-2 text-lg  text-gray-900 '>{duration}시간</p>
                </div>

                {startAt && (
                  <div className='border border-gray-200 rounded-lg p-3'>
                    <p className='text-xs text-gray-500 mb-2'>시작 시간</p>
                    <p className='pl-2 text-lg text-gray-900'>
                      {startAt.toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                      })}
                    </p>
                  </div>
                )}
                {endAt && (
                  <div className='border border-gray-200 rounded-lg p-3'>
                    <p className='text-xs text-gray-500 mb-2'>종료 시간</p>
                    <p className='pl-2 text-lg text-gray-900'>
                      {endAt.toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='border rounded-xl bg-white p-6 space-y-5'
        >
          <div className='flex items-center space-x-2 pb-3 border-b'>
            <MapPin className='w-5 h-5 text-primary-100' />
            <h3 className='text-lg font-semibold text-gray-900'>거래 방식</h3>
          </div>

          <div className='space-y-3'>
            <div className='flex items-center space-x-3 p-3  rounded-lg'>
              <div className='w-2 h-2  rounded-full'></div>
              <span className='font-medium text-gray-900'>택배 거래 </span>
            </div>
            {isDirectDeal && (
              <div className='flex items-center space-x-3 p-3  rounded-lg'>
                <div className='w-2 h-2 bg-primary-100 rounded-full'></div>
                <span className='font-medium text-gray-900'>
                  직거래 가능 ({directDealLocation})
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
          className='border border-amber-200 bg-amber-50 rounded-xl p-6'
        >
          <h4 className='font-semibold text-amber-800 mb-3 flex items-center space-x-2'>
            <span className='text-lg'>⚠️</span>
            <span>경매 등록 전 확인사항</span>
          </h4>
          <ul className='text-sm text-amber-700 space-y-2'>
            <li className='flex items-start space-x-2'>
              <span className='text-amber-500 mt-1'>•</span>
              <span>경매 등록 후 상품 정보 수정이 제한됩니다.</span>
            </li>
            <li className='flex items-start space-x-2'>
              <span className='text-amber-500 mt-1'>•</span>
              <span>허위 상품이나 금지 품목은 제재 대상입니다.</span>
            </li>
            <li className='flex items-start space-x-2'>
              <span className='text-amber-500 mt-1'>•</span>
              <span>낙찰 후 거래를 성실히 완료해야 합니다.</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
