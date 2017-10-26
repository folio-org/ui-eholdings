export function formatContentType(contentType) {
  let contentTypes = {
    all: 'All',
    aggregatedfulltext: 'Aggregated Full Text',
    abstractandindex: 'Abstract and Index',
    ebook: 'E-Book',
    ejournal: 'E-Journal',
    print: 'Print',
    unknown: 'Unknown',
    onlinereference: 'Online Reference'
  };

  let contentTypeKey = contentType.toLowerCase();

  if (contentType && Object.prototype.hasOwnProperty.call(contentTypes, contentTypeKey)) {
    return contentTypes[contentTypeKey];
  } else {
    return contentType;
  }
}

export function formatPublicationType(publicationType) {
  let publicationTypes = {
    all: 'All',
    audiobook: 'Audiobook',
    book: 'Book',
    bookseries: 'Book Series',
    database: 'Database',
    journal: 'Journal',
    newsletter: 'Newsletter',
    newspaper: 'Newspaper',
    proceedings: 'Proceedings',
    report: 'Report',
    streamingaudio: 'Streaming Audio',
    streamingvideo: 'Streaming Video',
    thesisdissertation: 'Thesis & Dissertation',
    website: 'Website',
    unspecified: 'Unspecified',
  };

  let publicationTypeKey = publicationType.toLowerCase();

  if (publicationType && Object.prototype.hasOwnProperty.call(publicationTypes, publicationTypeKey)) {
    return publicationTypes[publicationTypeKey];
  } else {
    return publicationType;
  }
}
