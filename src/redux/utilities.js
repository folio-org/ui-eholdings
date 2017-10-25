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

export function formatResourceType(resourceType) {
  let resourceTypes = {
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
    website: 'Web Site',
    unspecified: 'Unspecified',
  };

  let resourceTypeKey = resourceType.toLowerCase();

  if (resourceType && Object.prototype.hasOwnProperty.call(resourceTypes, resourceTypeKey)) {
    return resourceTypes[resourceTypeKey];
  } else {
    return resourceType;
  }
}
