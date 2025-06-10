'use client';

import { motion } from 'framer-motion';
import {
  useCreateAuctionStore,
  ProductCondition,
} from '@/stores/use-create-auction-store';

export function ProductConditionSelector() {
  const { productCondition, errors, setProductCondition } =
    useCreateAuctionStore();

  const productConditions: {
    value: ProductCondition;
    label: string;
    description: string;
  }[] = [
    {
      value: 'unopened',
      label: '미개봉 상품',
      description: '포장을 뜯지 않은 새 상품',
    },
    {
      value: 'new',
      label: '새상품',
      description: '개봉 후 사용하지 않은 새 상품',
    },
    {
      value: 'used',
      label: '중고 상품',
      description: '한 번이라도 사용한 상품',
    },
  ];

  return (
    <section className='space-y-4'>
      <div className='flex items-center justify-between'>
        <label
          className={`text-sm font-mono ${
            productCondition ? 'text-primary-100' : 'text-gray-400'
          }`}
        >
          상품 상태
        </label>
        {errors.productCondition && (
          <p className='text-xs text-red-500' role='alert'>
            {errors.productCondition}
          </p>
        )}
      </div>

      <div className='grid grid-cols-3 gap-3'>
        {productConditions.map((condition, index) => (
          <motion.button
            key={condition.value}
            type='button'
            onClick={() => setProductCondition(condition.value)}
            className={`w-full p-4 text-left border-2 border-gray-300 rounded-xl transition-all duration-200 ${
              productCondition === condition.value
                ? 'border-primary-100 bg-primary-50/30'
                : errors.productCondition
                  ? 'border-red-500'
                  : 'border-gray-300 hover:border-gray-400'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileTap={{ scale: 0.98 }}
          >
            <div>
              <p
                className={`font-medium text-sm ${
                  productCondition === condition.value
                    ? 'text-primary-200'
                    : 'text-gray-900'
                }`}
              >
                {condition.label}
              </p>
              <p className='text-xs text-gray-600 mt-1'>
                {condition.description}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
