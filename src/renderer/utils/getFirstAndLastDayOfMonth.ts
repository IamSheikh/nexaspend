/* eslint-disable prettier/prettier */

import formatDate from './formatDate';

export default function getFirstAndLastDayOfMonth() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // First day of the month
  const firstDay = new Date(year, month, 1);

  // Last day of the month
  const lastDay = new Date(year, month + 1, 0); // 0 will be the last day of the previous month

  return {
    firstDay: formatDate(firstDay),
    lastDay: formatDate(lastDay),
  };
}
