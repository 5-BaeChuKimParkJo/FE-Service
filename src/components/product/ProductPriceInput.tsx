import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui';
import { formatCurrency, numberToKorean } from '@/utils/format';

interface ProductPriceInputProps {
  value: string;
  onChange: (v: string) => void;
  error?: string;
  label?: string;
  min?: number;
}

export function ProductPriceInput({
  value,
  onChange,
  error,
  label = '가격',
  min = 1000,
}: ProductPriceInputProps) {
  const [touched, setTouched] = useState(false);

  // 숫자만 추출, 0으로 시작하는 경우 제거
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/[^0-9]/g, '');
    if (v.length > 1 && v.startsWith('0')) v = v.replace(/^0+/, '');
    onChange(v);
  };

  // 한글 단위 표기
  const koreanAmount = numberToKorean(value);
  const priceNum = parseFloat(value.replace(/,/g, '')) || 0;
  const isValid = priceNum >= min;
  const showValidationError = touched && value.length > 0 && !isValid;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='space-y-3'
    >
      <Input
        id='product-price'
        label={label}
        type='numeric'
        inputMode='numeric'
        value={formatCurrency(value)}
        onChange={handleChange}
        onBlur={() => setTouched(true)}
        fontWeight='medium'
        aria-describedby={koreanAmount ? 'korean-amount' : undefined}
        aria-invalid={!!error || showValidationError}
      />
      {koreanAmount && (
        <div className='px-1'>
          <p id='korean-amount' className='text-sm text-gray-500 font-medium'>
            {koreanAmount}
          </p>
        </div>
      )}
      {error && (
        <p className='text-sm text-red-500 px-1' role='alert'>
          {error}
        </p>
      )}
      {showValidationError && !error && (
        <p className='text-sm text-red-500 px-1' role='alert'>
          {min.toLocaleString()}원 이상 입력해주세요
        </p>
      )}
    </motion.section>
  );
}
