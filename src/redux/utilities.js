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

  return contentTypes[contentType.toLowerCase()];
}
