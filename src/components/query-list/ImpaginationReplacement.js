import {
  useState,
  useEffect,
} from 'react';

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

const ImpaginationReplacement = ({
  pageSize,
  page,
  collection,
  fetch,
  children,
}) => {
  useEffect(() => {
    fetch(page);
  }, [page]);

  useEffect(() => {
    fetch(1);
  }, [collection.key]);

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

  return children(dataset);
};

export default ImpaginationReplacement;
