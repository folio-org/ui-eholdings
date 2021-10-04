import { useEffect } from 'react';

class Dataset {
  constructor({ pageSize, page }) {
    this.hasRejected = false;
    this.records = new Array(pageSize * page).fill(null);
    this.errors = [];
  }

  get length() {
    return this.records.length;
  }

  slice(...args) {
    return this.records.slice(...args).map(record => ({
      content: record,
    }));
  }

  resolve(records) {
    this.records = records;
    this.hasRejected = false;
  }

  reject(errors) {
    this.hasRejected = true;
    this.errors = errors;
  }
}

const useImpagination = ({
  pageSize,
  page,
  collection,
  fetch,
  isMainPageSearch,
}) => {
  useEffect(() => {
    if (!isMainPageSearch) {
      return;
    }

    fetch(page);
  }, [page]);

  useEffect(() => {
    if (!isMainPageSearch) {
      return;
    }

    fetch(1);
  }, [collection.key]);

  if (!isMainPageSearch) {
    return false;
  }

  const { request, records } = collection.getPage(page);
  const dataset = new Dataset({
    pageSize,
    page,
  });

  dataset.isLoading = collection.isLoading;

  if (request.isResolved) {
    dataset.resolve(records, page);
  } else if (request.isRejected) {
    dataset.reject(request.errors, page);
  }

  return dataset;
};

export default useImpagination;
