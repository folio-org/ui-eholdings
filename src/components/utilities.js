let publicationTypes = {
  all: { display: 'All', isBook: false },
  audiobook: { display: 'Audiobook', isBook: true },
  book: { display: 'Book', isBook: true },
  bookseries: { display: 'Book Series', isBook: true },
  database: { display: 'Database', isBook: false },
  journal: { display: 'Journal', isBook: false },
  newsletter: { display: 'Newsletter', isBook: false },
  newspaper: { display: 'Newspaper', isBook: false },
  proceedings: { display: 'Proceedings', isBook: false },
  report: { display: 'Report', isBook: false },
  streamingaudio: { display: 'Streaming Audio', isBook: true },
  streamingvideo: { display: 'Streaming Video', isBook: true },
  thesisdissertation: { display: 'Thesis & Dissertation', isBook: false },
  website: { display: 'Website', isBook: false },
  unspecified: { display: 'Unspecified', isBook: false },
};
export function formatPublicationType(publicationType) {
  let publicationTypeKey = publicationType.toLowerCase();
  if (publicationType && Object.prototype.hasOwnProperty.call(publicationTypes, publicationTypeKey)) {
    return publicationTypes[publicationTypeKey].display;
  } else {
    return publicationType;
  }
}
export function isBookPublicationType(publicationType) {
  let publicationTypeKey = publicationType.toLowerCase();

  if (publicationType && Object.prototype.hasOwnProperty.call(publicationTypes, publicationTypeKey)) {
    return publicationTypes[publicationTypeKey].isBook;
  } else {
    return false;
  }
}
export function formatISODateWithoutTime(dateString, intl) {
  if ((dateString == null) || (dateString.trim() === '')) {
    return '';
  }
  let [year, month, day] = dateString.split('-');
  let dateObj = new Date();
  dateObj.setFullYear(year);
  dateObj.setMonth(parseInt(month, 10) - 1);
  dateObj.setDate(day);
  return intl.formatDate(dateObj);
}
export function formatYear(dateString) {
  if ((dateString == null) || (dateString.trim() === '')) {
    return '';
  }
  let [year] = dateString.split('-');
  return year;
}
