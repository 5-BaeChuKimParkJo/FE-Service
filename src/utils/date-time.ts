export const formatDateTime = (date: Date): string => {
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const isValidDate = (date: Date): boolean => {
  const now = new Date();
  const compareDate = new Date(date);
  compareDate.setSeconds(0, 0);
  now.setSeconds(0, 0);
  return compareDate >= now;
};

export const generateDateOptions = () => {
  const options = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 8; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    let label = '';
    if (i === 0) {
      label = '오늘';
    } else if (i === 1) {
      label = '내일';
    } else {
      label = `${i}일 후`;
    }

    const dateString = date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
    });

    options.push({
      date,
      label: `${label} (${dateString})`,
      value: i,
    });
  }

  return options;
};

export const calculateDaysFromToday = (selectedDate: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = new Date(selectedDate);
  selected.setHours(0, 0, 0, 0);

  const diffTime = selected.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, Math.min(7, diffDays));
};

export const isHourDisabled = (hour: number, selectedDate: Date): boolean => {
  const checkDate = new Date(selectedDate);
  checkDate.setHours(hour, 0, 0, 0);

  const now = new Date();
  now.setMinutes(0, 0, 0);

  return checkDate <= now;
};

export const dateLabelMap: Record<'hour', string> = {
  hour: ':00',
};
