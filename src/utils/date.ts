import { formatInTimeZone } from 'date-fns-tz';
import { ko } from 'date-fns/locale';

export function formatDate(dateString: string): string {
  // 한국 시간으로 변환
  return formatInTimeZone(
    new Date(dateString),
    'Asia/Seoul',
    'yyyy년 M월 d일 a h:mm',
    {
      locale: ko,
    },
  );
}

// 한국 시간으로 변환이 필요한 경우
export function formatDateKST(dateString: string): string {
  return formatInTimeZone(
    new Date(dateString),
    'Asia/Seoul',
    'yyyy년 M월 d일 a h:mm',
    {
      locale: ko,
    },
  );
}

// UTC 시간을 그대로 표시 (더 명확한 버전)
export function formatDateUTC(dateString: string): string {
  return formatInTimeZone(
    new Date(dateString),
    'UTC',
    'yyyy년 M월 d일 a h:mm',
    {
      locale: ko,
    },
  );
}

export function formatChatDate(date: Date | null) {
  if (!date) return '';
  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();
  if (isToday) {
    return date
      .toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      .replace(/:/g, ':');
  }
  if (isYesterday) {
    return '어제';
  }
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export function formatChatDateDivider(date: Date) {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${days[date.getDay()]}요일`;
}

export function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const targetDate = new Date(dateString);
  const diffInMs = now.getTime() - targetDate.getTime();

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  } else if (diffInDays < 30) {
    return `${diffInDays}일 전`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths}달 전`;
  } else {
    return `${diffInYears}년 전`;
  }
}
