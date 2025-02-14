export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const formatDateRange = (dates: Date[]): string => {
  if (dates.length === 1) {
    return dates[0].toLocaleDateString();
  }
  return `from ${dates[0].toLocaleDateString()} to ${dates[
    dates.length - 1
  ].toLocaleDateString()}`;
};
