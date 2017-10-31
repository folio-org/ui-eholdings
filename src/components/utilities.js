export function formatISODateWithoutTime(dateString, intl) {
  if (dateString == null) {
    return '';
  }
  let [year, month, day] = dateString.split('-');
  let dateObj = new Date();
  dateObj.setFullYear(year);
  dateObj.setMonth(parseInt(month, 10) - 1);
  dateObj.setDate(day);
  return intl.formatDate(dateObj);
}
export function isBookPublicationType(publicationType) {
  let publicationTypeLookup = publicationType.toLowerCase();

  let bookPublicationTypes = [
    'audio book',
    'book',
    'book series',
    'streaming audio',
    'streaming video'
  ];

  return bookPublicationTypes.includes(publicationTypeLookup);
}
