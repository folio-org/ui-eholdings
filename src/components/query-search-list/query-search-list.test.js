import noop from 'lodash/noop';
import {
  render,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';

import QuerySearchList from './query-search-list';

const collection = {
  isLoading: false,
  hasLoaded: false,
  hasFailed: false,
  items: [],
  errors: [],
  totalResults: 0,
  page: 1,
};

const renderQuerySearchList = (props = {}) => render(
  <QuerySearchList
    collection={collection}
    fetch={noop}
    notFoundMessage="titles not found"
    renderItem={noop}
    type="provider-packages"
    itemHeight={10}
    {...props}
  />
);

describe('Given QuerySearchList', () => {
  afterEach(cleanup);

  it('should handle fetch', () => {
    const fetch = jest.fn();

    renderQuerySearchList({ fetch });

    expect(fetch).toHaveBeenCalledWith(1);
  });

  it('should show not found message', () => {
    const { getByText } = renderQuerySearchList();

    expect(getByText('titles not found')).toBeDefined();
  });

  describe('when request has failed', () => {
    it('should show an error', () => {
      const { getByText } = renderQuerySearchList({
        collection: {
          ...collection,
          hasFailed: true,
          errors: [{ title: 'error' }],
        },
      });

      expect(getByText('error')).toBeDefined();
    });
  });

  describe('when request returns the collection and items are not rejected', () => {
    it('should handle renderItem', () => {
      const renderItem = jest.fn();

      renderQuerySearchList({
        renderItem,
        collection: {
          ...collection,
          totalResults: 1,
          items: [{ isRejected: false }],
        },
      });

      expect(renderItem).toHaveBeenCalled();
    });
  });
});
