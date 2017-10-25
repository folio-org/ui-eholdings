export default function formatContentType(contentType) {
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
