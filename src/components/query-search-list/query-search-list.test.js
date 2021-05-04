import noop from 'lodash/noop';
import {
  render,
  cleanup,
  fireEvent,
} from '@testing-library/react';

import QuerySearchList from './query-search-list';

const collection = {
  isLoading: false,
  hasLoaded: false,
  hasFailed: false,
  items: [],
  errors: [],
  totalResults: 0,
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

  describe('when request returns the collection and total result is more then 100', () => {
    it('should show load more button', () => {
      const { getByText } = renderQuerySearchList({
        collection: {
          ...collection,
          totalResults: 150,
          items: new Array(100).fill({ isRejected: false }),
        },
      });

      expect(getByText('ui-eholdings.loadMore')).toBeDefined();
    });

    describe('when click on load more button', () => {
      it('should handle fetch', () => {
        const fetch = jest.fn();
        const { getByText } = renderQuerySearchList({
          fetch,
          collection: {
            ...collection,
            totalResults: 150,
            items: new Array(100).fill({ isRejected: false }),
          },
        });

        fireEvent.click(getByText('ui-eholdings.loadMore'));

        expect(fetch).toHaveBeenCalledWith(2);
      });
    });
  });

  describe('when request returns the collection and total result is less then 100', () => {
    it('should not show load more button', () => {
      const { queryByText } = renderQuerySearchList({
        collection: {
          ...collection,
          totalResults: 50,
          items: new Array(50).fill({
            isRejected: true,
            error: [{ title: 'error' }],
          }),
        },
      });

      expect(queryByText('ui-eholdings.loadMore')).toBeNull();
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
