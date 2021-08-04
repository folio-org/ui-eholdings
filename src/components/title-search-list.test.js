import {
  render,
  fireEvent,
} from '@testing-library/react';

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
    {
      records: [
        {
          ...content,
        },
      ],
    },
  ],
};

jest.mock('./query-list', () => ({ renderItem }) => (
  <>
    <span>QueryList component</span>
    {renderItem({ content })}
  </>
));

describe('Given TitleSearchList', () => {
  const mockOnClickItem = jest.fn();

  const renderTitleSearchList = ({ ...props }) => render(
    <Harness>
      <TitleSearchList
        collection={collection}
        fetch={() => {}}
        notFoundMessage="Not Found Message"
        onClickItem={mockOnClickItem}
        onUpdateOffset={() => {}}
        params={{}}
        {...props}
      />
    </Harness>
  );

  it('should render QueryList component', () => {
    const { getByText } = renderTitleSearchList();

    expect(getByText('QueryList component')).toBeDefined();
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
