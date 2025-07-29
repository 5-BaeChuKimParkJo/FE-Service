export function formatCurrency(value: string | number): string {
  const num = String(value).replace(/[^0-9]/g, '');
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatPrice(value: string | number): string {
  const num = Number(value);
  return new Intl.NumberFormat('ko-KR').format(num) + '원';
}

export function numberToKorean(number: string | number): string {
  const inputNumber = Number(number);

  if (inputNumber <= 0) {
    return '';
  }

  const unitWords = ['', '만 ', '억 ', '조 ', '경 '];
  const splitUnit = 10000;
  const splitCount = unitWords.length;
  const resultArray: number[] = [];
  let resultString = '';

  for (let i = 0; i < splitCount; i++) {
    const unitResult = Math.floor(
      (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i),
    );
    if (unitResult > 0) {
      resultArray[i] = unitResult;
    }
  }

  for (let i = 0; i < resultArray.length; i++) {
    if (!resultArray[i]) continue;
    resultString = String(resultArray[i]) + unitWords[i] + resultString;
  }

  return resultString ? resultString + '원' : '';
}

export function formatCurrencyWithKorean(value: string | number): {
  formatted: string;
  korean: string;
} {
  const formatted = formatCurrency(value);
  const korean = numberToKorean(value);

  return {
    formatted,
    korean,
  };
}

export function formatNumber(number: number): string {
  return new Intl.NumberFormat('ko-KR').format(number);
}
