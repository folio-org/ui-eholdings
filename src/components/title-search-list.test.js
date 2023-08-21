import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import noop from 'lodash/noop';
import Harness from '../../test/jest/helpers/harness';

import TitleSearchList from './title-search-list';

const content = {
  id: 'title-id',
  name: 'title-name',
  contributors: [
    {
      type: 'Author',
      contributor: 'Contributor Name',
    },
  ],
  publicationType: 'Book',
  publisherName: 'Publisher Name',
  identifiers: [
    {
      id: 'identifier-id',
      subtype: 'Online',
      type: 'ISBN',
    },
  ],
};

const collection = {
  pages: [
    {},
    {
      records: [
        {
          ...content,
        },
      ],
    },
  ],
  length: 10,
  request: {
    isRejected: false,
    errors: [],
  },
  isLoading: false,
  currentPage: 1,
};

jest.mock('./query-search-list', () => ({ renderItem }) => (
  <>
    <span>QuerySearchList component</span>
    {renderItem({ content })}
  </>
));

describe('Given TitleSearchList', () => {
  const mockOnClickItem = jest.fn();

  const renderTitleSearchList = (props = {}) => render(
    <Harness>
      <TitleSearchList
        collection={collection}
        fetch={noop}
        notFoundMessage="Not Found Message"
        packagesFacetCollection={{}}
        onClickItem={mockOnClickItem}
        onUpdateOffset={noop}
        {...props}
      />
    </Harness>
  );

  it('should render QuerySearchList component', () => {
    const { getByText } = renderTitleSearchList();

    expect(getByText('QuerySearchList component')).toBeDefined();
  });

  it('should display found title information', () => {
    const { getByText } = renderTitleSearchList();

    expect(getByText('title-name')).toBeDefined();
    expect(getByText('Book')).toBeDefined();
    expect(getByText('Publisher Name')).toBeDefined();
    expect(getByText('Contributor Name')).toBeDefined();
    expect(getByText('ISBN (Online): identifier-id')).toBeDefined();
  });

  it('should have a link to the found title', () => {
    const { getByRole, getAllByRole } = renderTitleSearchList();

    expect(getAllByRole('link')).toHaveLength(1);
    expect(getByRole('link')).toHaveAttribute('href', '/eholdings/titles/title-id');
  });

  describe('when click on a title', () => {
    it('should call onClickItem', () => {
      const { getByRole } = renderTitleSearchList();

      fireEvent.click(getByRole('link'));

      expect(mockOnClickItem).toHaveBeenCalled();
      expect(mockOnClickItem).toHaveBeenCalledTimes(1);
    });
  });
});
