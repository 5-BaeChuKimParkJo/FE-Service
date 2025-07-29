// 경매 타이머 데이터 타입
export type AuctionTimeData = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalHours: number;
  isMoreThan24Hours: boolean;
  isExpired: boolean;
  isNotStarted: boolean;
  timeToStart?: number;
};

// 경매 시간 계산 함수
export function calculateAuctionTime(
  startAt: string,
  endAt: string,
  now: number,
): AuctionTimeData {
  const startTime = new Date(startAt).getTime();
  const endTime = new Date(endAt).getTime();

  // 경매 종료 확인 (가장 먼저 체크)
  if (now >= endTime) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalHours: 0,
      isMoreThan24Hours: false,
      isExpired: true,
      isNotStarted: false,
    };
  }

  // 경매 시작 전인지 확인
  if (now < startTime) {
    // 시작 시간까지의 남은 시간 계산
    const timeToStart = startTime - now;

    const days = Math.floor(timeToStart / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeToStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((timeToStart % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeToStart % (1000 * 60)) / 1000);
    const totalHours = Math.floor(timeToStart / (1000 * 60 * 60));
    const isMoreThan24Hours = timeToStart > 24 * 60 * 60 * 1000;

    return {
      days,
      hours,
      minutes,
      seconds,
      totalHours,
      isMoreThan24Hours,
      isExpired: false,
      isNotStarted: true,
      timeToStart,
    };
  }

  // 경매 진행 중 - 종료 시간까지의 남은 시간 계산
  const difference = endTime - now;

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  const totalHours = Math.floor(difference / (1000 * 60 * 60));
  const isMoreThan24Hours = difference > 24 * 60 * 60 * 1000;

  return {
    days,
    hours,
    minutes,
    seconds,
    totalHours,
    isMoreThan24Hours,
    isExpired: false,
    isNotStarted: false,
  };
}

// 시간 포맷팅 함수 (2자리)
export function formatTime(time: number): string {
  return time.toString().padStart(2, '0');
}

// 남은 시간 텍스트 생성 함수 (목록용 - 24시간 이상일 때 분까지만)
export function getTimeLeftText(timeData: AuctionTimeData): string {
  if (timeData.isExpired) {
    return '00h 00m 00s';
  }

  if (timeData.isNotStarted) {
    if (timeData.isMoreThan24Hours) {
      return `${formatTime(timeData.days)}d ${formatTime(timeData.hours)}h ${formatTime(timeData.minutes)}m`;
    } else {
      return `${formatTime(timeData.hours)}h ${formatTime(timeData.minutes)}m ${formatTime(timeData.seconds)}s`;
    }
  }

  if (timeData.isMoreThan24Hours) {
    return `${formatTime(timeData.days)}d ${formatTime(timeData.hours)}h ${formatTime(timeData.minutes)}m`;
  } else {
    return `${formatTime(timeData.hours)}h ${formatTime(timeData.minutes)}m ${formatTime(timeData.seconds)}s`;
  }
}

// 상세 페이지용 남은 시간 텍스트 생성 함수 (항상 초까지 표시)
export function getDetailedTimeLeftText(timeData: AuctionTimeData): string {
  if (timeData.isExpired) {
    return '00h 00m 00s';
  }
  return `${formatTime(timeData.days)}d ${formatTime(timeData.hours)}h ${formatTime(timeData.minutes)}m ${formatTime(timeData.seconds)}s`;
}

// 타이머 스타일 클래스 생성 함수
export function getTimerStyles(timeData: AuctionTimeData) {
  if (timeData.isExpired) {
    return {
      containerClass:
        'p-4 w-full border-2 rounded-xl border-gray-400 bg-gray-50',
      titleClass: 'text-sm font-medium mb-2 text-center text-gray-500',
      timeClass: 'text-lg font-bold text-gray-500',
    };
  }

  if (timeData.isNotStarted) {
    return {
      containerClass:
        'p-4 w-full border-2 rounded-xl border-blue-200 bg-blue-50',
      titleClass: 'text-sm font-medium mb-2 text-center text-blue-600',
      timeClass: 'text-lg font-bold text-blue-600',
    };
  }

  // 경매 진행 중
  const isUrgent = timeData.totalHours < 1; // 1시간 미만이면 긴급

  return {
    containerClass: `p-4 w-full border-2 rounded-xl ${
      isUrgent
        ? 'border-red-200 bg-red-50'
        : 'border-primary-200 bg-primary-100/15'
    }`,
    titleClass: `text-sm font-medium mb-2 text-center ${
      isUrgent ? 'text-red-600' : 'text-primary-100'
    }`,
    timeClass: `text-lg font-bold ${isUrgent ? 'text-red-600' : 'text-primary-100'}`,
  };
}
