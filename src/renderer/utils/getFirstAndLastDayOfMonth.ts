/* eslint-disable prettier/prettier */
function formatDate(date: any) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getFirstAndLastDayOfMonth() {
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

export default getFirstAndLastDayOfMonth;