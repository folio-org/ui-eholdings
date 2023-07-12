import {
  render,
  fireEvent,
} from '@testing-library/react';

import {
  searchTypes,
  searchableIndexes,
} from '../../constants';

import SearchModal from './search-modal';

const mockOnFilter = jest.fn();
const mockOnToggle = jest.fn();

const accessTypes = {
  errors: [],
  isLoading: false,
  isDeleted: false,
  items: {
    data: [{
      attributes: { name: 'test-access-type' },
      id: 'test-id',
      type: 'accessTypes',
    }],
  },
};

const tagsModelOfAlreadyAddedTags = {
  isLoading: false,
  request: {
    isResolved: true,
  },
  resolver: {
    state: {
      tags: {
        records: {
          'tag-id': {
            attributes: {
              id: 'tag-id',
              label: 'tag-not-added-to-any-record',
            },
            id: 'tag-id',
          },
          'tag-id2': {
            attributes: {
              value: 'already-added-tag-to-record',
            },
          },
        },
      },
    },
  },
};

const renderSearchModal = (props = {}) => render(
  <SearchModal
    accessTypes={accessTypes}
    listType={searchTypes.TITLES}
    onFilter={mockOnFilter}
    onToggle={mockOnToggle}
    tagsModelOfAlreadyAddedTags={tagsModelOfAlreadyAddedTags}
    {...props}
  />
);

describe('Given SearchModal', () => {
  afterEach(() => {
    mockOnFilter.mockClear();
    mockOnToggle.mockClear();
  });

  it('should render SearchModal component', () => {
    const {
      getByRole,
      getByTestId,
    } = renderSearchModal();

    fireEvent.click(getByRole('button', { name: 'ui-eholdings.filter.togglePane' }));

    expect(getByTestId('search-modal')).toBeDefined();
  });

  it('should display modal title', () => {
    const {
      getByRole,
      getByText,
    } = renderSearchModal();

    fireEvent.click(getByRole('button', { name: 'ui-eholdings.filter.togglePane' }));

    expect(getByText('ui-eholdings.filter.filterType.titles')).toBeDefined();
  });

  it('should display search input', () => {
    const { getByRole } = renderSearchModal();

    fireEvent.click(getByRole('button', { name: 'ui-eholdings.filter.togglePane' }));

    const searchfield = getByRole('searchbox', { name: 'ui-eholdings.search.enterYourSearch' });

    expect(searchfield).toBeDefined();
    expect(searchfield.placeholder).toBe('ui-eholdings.search.searchType.titles');
  });

  it('should display reset all button', () => {
    const { getByRole } = renderSearchModal();

    fireEvent.click(getByRole('button', { name: 'ui-eholdings.filter.togglePane' }));

    expect(getByRole('button', { name: 'ui-eholdings.filter.resetAll' })).toBeDefined();
  });

  it('should display search button', () => {
    const { getByRole } = renderSearchModal();

    fireEvent.click(getByRole('button', { name: 'ui-eholdings.filter.togglePane' }));

    expect(getByRole('button', { name: 'ui-eholdings.label.search' })).toBeDefined();
  });

  it('should display close modal button', () => {
    const { getByRole } = renderSearchModal();

    fireEvent.click(getByRole('button', { name: 'ui-eholdings.filter.togglePane' }));

    expect(getByRole('button', { name: 'stripes-components.dismissModal' })).toBeDefined();
  });

  describe('when click the button open the modal', () => {
    it('should invoke onToggle callback', () => {
      const { getByRole } = renderSearchModal();

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.filter.togglePane' }));

      expect(mockOnToggle).toHaveBeenCalledWith(true);
    });
  });

  describe('when click on close button', () => {
    it('should close search modal', () => {
      const {
        getByRole,
        getByTestId,
        queryByTestId,
      } = renderSearchModal();

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.filter.togglePane' }));

      expect(getByTestId('search-modal')).toBeDefined();

      fireEvent.click(getByRole('button', { name: 'stripes-components.dismissModal' }));

      expect(queryByTestId('search-modal')).toBeNull();
    });
  });

  describe('when click on search button', () => {
    it('should update search with passed filter values', () => {
      const {
        getByRole,
        getByTestId,
        queryByTestId,
      } = renderSearchModal({
        query: {
          filter: {
            selected: true,
          },
        },
      });

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.filter.togglePane' }));

      expect(getByTestId('search-modal')).toBeDefined();

      const searchfield = getByRole('searchbox', { name: 'ui-eholdings.search.enterYourSearch' });

      fireEvent.change(searchfield, { target: { value: 'Test value' } });
      fireEvent.blur(searchfield);

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.label.search' }));

      expect(queryByTestId('search-modal')).toBeNull();
      expect(mockOnFilter).toBeCalledWith({
        filter: {
          selected: true,
          tags: undefined,
          'access-type': undefined,
        },
        q: 'Test value',
        searchfield: undefined,
        sort: undefined,
      });
    });
  });

  describe('when click on reset all button', () => {
    it('should reset search', () => {
      const {
        getByRole,
        getByTestId,
        queryByTestId,
      } = renderSearchModal();

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.filter.togglePane' }));

      expect(getByTestId('search-modal')).toBeDefined();

      const searchfield = getByRole('searchbox', { name: 'ui-eholdings.search.enterYourSearch' });

      fireEvent.change(searchfield, { target: { value: 'Test value' } });
      fireEvent.blur(searchfield);

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.filter.resetAll' }));

      expect(queryByTestId('search-modal')).toBeNull();
      expect(mockOnFilter).toBeCalledWith({
        filter: {
          selected: undefined,
          tags: undefined,
          'access-type': undefined,
        },
        q: undefined,
        searchfield: undefined,
        sort: undefined,
      });
    });
  });

  describe('when search by tags enabled', () => {
    it('should update search with corresponding filter value', () => {
      const {
        getByRole,
        getByText,
        getByTestId,
        queryByTestId,
      } = renderSearchModal();

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.filter.togglePane' }));

      expect(getByTestId('search-modal')).toBeDefined();

      fireEvent.click(getByText('ui-eholdings.search.searchByTagsOnly'));

      expect(getByRole('searchbox', { name: 'ui-eholdings.search.enterYourSearch' })).toBeDisabled();

      fireEvent.click(getByTestId('search-form-tag-filter'));
      fireEvent.click(getByText('already-added-tag-to-record'));

      expect(queryByTestId('search-modal')).toBeNull();
      expect(mockOnFilter).toBeCalledWith({
        filter: {
          tags: ['already-added-tag-to-record'],
          'access-type': undefined,
        },
        q: undefined,
        searchfield: undefined,
        sort: undefined,
      });
    });
  });

  describe('when search by access types enabled', () => {
    it('should update search with corresponding filter value', () => {
      const {
        getByRole,
        getByText,
        getByTestId,
        queryByTestId,
      } = renderSearchModal();

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.filter.togglePane' }));

      expect(getByTestId('search-modal')).toBeDefined();

      fireEvent.click(getByText('ui-eholdings.search.searchByAccessTypeOnly'));

      expect(getByRole('searchbox', { name: 'ui-eholdings.search.enterYourSearch' })).toBeDisabled();

      fireEvent.click(getByTestId('search-form-access-type-filter'));
      fireEvent.click(getByText('test-access-type'));

      expect(queryByTestId('search-modal')).toBeNull();
      expect(mockOnFilter).toBeCalledWith({
        filter: {
          tags: undefined,
          'access-type': ['test-access-type'],
        },
        q: undefined,
        searchfield: undefined,
        sort: undefined,
      });
    });
  });

  describe('when query contains access types filter', () => {
    it('should filter by access type', () => {
      const {
        getByRole,
        getByTestId,
        queryByTestId,
      } = renderSearchModal({
        query: {
          filter: {
            'access-type': ['test-access-type'],
          },
        },
      });

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.filter.togglePane' }));

      expect(getByTestId('search-modal')).toBeDefined();

      const searchfield = getByRole('searchbox', { name: 'ui-eholdings.search.enterYourSearch' });

      fireEvent.change(searchfield, { target: { value: 'Test value' } });
      fireEvent.blur(searchfield);

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.label.search' }));

      expect(queryByTestId('search-modal')).toBeNull();
      expect(mockOnFilter).toBeCalledWith({
        filter: {
          tags: undefined,
          'access-type': ['test-access-type'],
        },
        q: 'Test value',
        searchfield: undefined,
        sort: undefined,
      });
    });
  });

  describe('when change search field', () => {
    it('should change state and enable search button', () => {
      const {
        getByRole,
        getByTestId,
      } = renderSearchModal();

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.filter.togglePane' }));

      expect(getByTestId('search-modal')).toBeDefined();

      fireEvent.change(getByTestId('field-to-search-select'), { target: { value: searchableIndexes.ISNX } });

      const searchButton = getByRole('button', { name: 'ui-eholdings.label.search' });

      expect(searchButton).toBeEnabled();
    });
  });

  describe('when change filter', () => {
    it('should change state and enable search button', () => {
      const {
        getByRole,
        getByTestId,
        getByText,
      } = renderSearchModal();

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.filter.togglePane' }));

      expect(getByTestId('search-modal')).toBeDefined();

      fireEvent.click(getByText('ui-eholdings.filter.pubType.audiobook'));

      const searchButton = getByRole('button', { name: 'ui-eholdings.label.search' });

      expect(searchButton).toBeEnabled();
    });
  });
});
