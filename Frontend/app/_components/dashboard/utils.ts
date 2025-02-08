export const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function getMonthName(date: Date): string {
  return months[date.getMonth()];
}

export function getDateRangeParams(dateRange: string): {
  startDate: Date;
  endDate: Date;
} {
  const startDate = new Date();
  const endDate = new Date();

  switch (dateRange) {
    case 'Weekly':
      startDate.setDate(startDate.getDate() - startDate.getDay());
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
      break;
    case 'Monthly':
      startDate.setDate(1);
      endDate.setMonth(endDate.getMonth() + 1, 0);
      break;
    case 'Yearly':
      startDate.setMonth(0, 1);
      endDate.setMonth(11, 31);
      break;
    case 'Last Year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      startDate.setMonth(0, 1);
      endDate.setFullYear(endDate.getFullYear() - 1);
      endDate.setMonth(11, 31);
      break;
  }

  return { startDate, endDate };
}

export function formatChartData(
  dateRange: string,
  startDate: Date,
  endDate: Date,
): { date: string; items: number }[] {
  switch (dateRange) {
    case 'Weekly':
      return daysOfWeek.map(day => ({ date: day, items: 0 }));
    case 'Monthly':
      const daysInMonth = endDate.getDate();
      return Array.from({ length: daysInMonth }, (_, i) => ({
        date: `${i + 1} ${getMonthName(startDate)}`,
        items: 0,
      }));
    case 'Yearly':
    case 'Last Year':
      return months.map(month => ({ date: month, items: 0 }));
    default:
      return [];
  }
}
