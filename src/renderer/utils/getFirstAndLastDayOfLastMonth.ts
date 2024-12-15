/* eslint-disable prettier/prettier */
import formatDate from './formatDate';

export default function getFirstAndLastDayOfLastMonth() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // Current month (0-indexed)

  // First day of the previous month
  const firstDayOfLastMonth = new Date(year, month - 1, 1);

  // Last day of the previous month
  const lastDayOfLastMonth = new Date(year, month, 0); // 0 will give the last day of the previous month

  return {
    firstDay: formatDate(firstDayOfLastMonth),
    lastDay: formatDate(lastDayOfLastMonth),
  };
}
