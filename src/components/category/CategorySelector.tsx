'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import { CategoryType } from '@/actions/category-service/getCategories';

interface CategorySelectorProps {
  categories: CategoryType[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onClose: () => void;
}

export function CategorySelector({
  categories,
  selectedId,
  onSelect,
  onClose,
}: CategorySelectorProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const scrollY = window.scrollY;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleSelect = (id: number) => {
    onSelect(id);
    setIsVisible(false);

    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className='fixed inset-0 z-50 flex items-end justify-center'>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='absolute inset-0 bg-black/50'
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 300 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 300 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
              duration: 0.3,
            }}
            className='relative bg-white rounded-t-2xl w-full max-w-lg max-h-[80vh] overflow-hidden shadow-xl'
          >
            <div className='flex items-center justify-between p-4 border-b border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900'>
                카테고리 선택
              </h3>
              <button
                onClick={handleClose}
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                aria-label='카테고리 선택 닫기'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='p-4 max-h-[60vh] overflow-y-auto'>
              <div className='grid grid-cols-3 gap-3'>
                {categories.map((category) => (
                  <motion.button
                    key={category.categoryId}
                    onClick={() => handleSelect(category.categoryId)}
                    className={`relative p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-colors ${
                      selectedId === category.categoryId
                        ? 'border-primary-100 bg-primary-100/10 text-primary-900'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className='w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0'>
                      {category.imageUrl ? (
                        <Image
                          src={category.imageUrl}
                          alt={category.name}
                          width={48}
                          height={48}
                          className='object-cover'
                        />
                      ) : (
                        <span className='text-2xl'>📦</span>
                      )}
                    </div>

                    <span className='text-xs font-medium text-center leading-tight'>
                      {category.name}
                    </span>

                    {selectedId === category.categoryId && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className='absolute top-1 right-1 w-4 h-4 bg-primary-100 rounded-full flex items-center justify-center'
                      >
                        <div className='w-1.5 h-1.5 bg-white rounded-full' />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
