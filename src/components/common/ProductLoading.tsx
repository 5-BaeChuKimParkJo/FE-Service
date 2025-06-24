'use client';
import { useState, useEffect } from 'react';
import { Package, Image, Tag, Upload } from 'lucide-react';

const icons = [Package, Image, Tag, Upload];

const iconNames = [
  '상품 정보 처리 중...',
  '이미지 업로드 중...',
  '태그 처리 중...',
  '상품 등록 완료 중...',
];

export function ProductLoading({
  size = 48,
  interval = 1000,
  text = '로딩 중...',
}: {
  size?: number;
  interval?: number;
  text?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % icons.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  const Icon = icons[index];
  const label = iconNames[index] || text;

  return (
    <div className='flex flex-col items-center justify-center gap-4 py-8'>
      <Icon className='animate-bounce text-primary' size={size} />
      <span className='text-lg font-semibold text-gray-700 animate-pulse'>
        {label}
      </span>
    </div>
  );
}
