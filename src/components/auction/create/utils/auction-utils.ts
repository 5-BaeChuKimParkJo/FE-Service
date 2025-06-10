/**
 * 경매 관련 유틸리티 함수들
 */

/**
 * 최소 시작 시간 계산 (현재 시간의 다음 정시)
 */
export const getMinDateTime = (): Date => {
  const now = new Date();
  const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
  nextHour.setMinutes(0, 0, 0);
  return nextHour;
};

/**
 * 경매 기간 옵션들
 */
export const durationOptions = [
  { hours: 1, label: '1시간' },
  { hours: 3, label: '3시간' },
  { hours: 6, label: '6시간' },
  { hours: 12, label: '12시간' },
  { hours: 24, label: '1일' },
  { hours: 72, label: '3일' },
  { hours: 168, label: '1주일' },
  { hours: 0, label: '직접입력' },
];

/**
 * 숫자만 추출하는 헬퍼 함수
 */
export const extractNumbers = (value: string): string => {
  return value.replace(/[^0-9]/g, '');
};

/**
 * 경매 종료 시간 계산
 */
export const calculateEndTime = (startAt: Date, duration: number): Date => {
  return new Date(startAt.getTime() + duration * 60 * 60 * 1000);
};
