export default function formatISODateWithoutTime(dateString, intl) {
  let [year, month, day] = dateString.split('-');
  let dateObj = new Date();
  dateObj.setFullYear(year);
  dateObj.setMonth(parseInt(month, 10) - 1);
  dateObj.setDate(day);
  return intl.formatDate(dateObj);
}
