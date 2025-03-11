export const formatDateToString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDatesBetween = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

export const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const getMonthRange = (year, month) => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  return { startDate, endDate };
};

// 날짜를 한국어 포맷으로 변환
export const formatDateString = (date, options = {}) => {
    return date.toLocaleDateString('ko-KR', {
      year: options.year || undefined,
      month: options.month || undefined,
      day: options.day || undefined,
      weekday: options.weekday || undefined,
    });
  };

