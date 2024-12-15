/* eslint-disable prettier/prettier */
import { formatDate } from '.';

function getFirstAndLastDayOfMonthFromDate(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth();

  // First day of the month
  const firstDay = new Date(year, month, 1);

  // Last day of the month
  const lastDay = new Date(year, month + 1, 0); // 0 will be the last day of the previous month

  return {
    firstDay: formatDate(firstDay),
    lastDay: formatDate(lastDay),
  };
}

export default getFirstAndLastDayOfMonthFromDate;
