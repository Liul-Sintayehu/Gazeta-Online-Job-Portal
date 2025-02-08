export enum DateRange {
  TODAY = 1,
  THIS_WEEK,
  THIS_MONTH,
  THIS_YEAR,
  LAST_YEAR,
}

export const DateRangeMapping: Record<DateRange, string> = {
  [DateRange.TODAY]: 'Today',
  [DateRange.THIS_WEEK]: 'This Week',
  [DateRange.THIS_MONTH]: 'This Month',
  [DateRange.THIS_YEAR]: 'This Year',
  [DateRange.LAST_YEAR]: 'Last Year',
};

export const getColorByStatus = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'var(--color-pending)';
    case 'ToDo':
      return 'var(--color-todo)';
    case 'InProgress':
      return 'var(--color-inProgress)';
    case 'Completed':
      return 'var(--color-completed)';
    case 'OnHold':
      return 'var(--color-onHold)';
    default:
      return 'var(--color-muted)';
  }
};

export function getMonthName(date: Date) {
  const formatedDate = new Date(date);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[formatedDate.getMonth()];
}
