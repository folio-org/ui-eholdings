import {
  fireEvent,
  render,
} from '@folio/jest-config-stripes/testing-library/react';

import { ActionMenu } from './action-menu';
import { searchTypes } from '../../../constants';

const mockOnFilterChange = jest.fn();
const mockOnStandaloneFilterChange = jest.fn();
const mockOnToggleActions = jest.fn();
const mockOnToggleFilter = jest.fn();
const mockToggleColumn = jest.fn();
const mockRenderFilters = jest.fn().mockReturnValue(<div>Filters</div>);

const tagsModelOfAlreadyAddedTags = {
  isLoading: false,
  resolver: {
    state: {
      tags: {
        records: {
          tag1: { attributes: { value: 'Urgent' } },
          tag2: { attributes: { value: 'Important' } },
        },
      },
    },
  },
};

const accessTypes = {
  isLoading: false,
  items: {
    data: [
      { id: '1', attributes: { name: 'Open Access' } },
      { id: '2', attributes: { name: 'Trial' } },
    ],
  },
};

const query = {
  sort: 'name',
  filter: {
    tags: undefined,
    'access-type': undefined,
  },
};

const renderActionMenu = (props = {}) => render(
  <ActionMenu
    searchType={searchTypes.TITLES}
    tagsModelOfAlreadyAddedTags={tagsModelOfAlreadyAddedTags}
    searchByTagsEnabled={false}
    searchByAccessTypesEnabled={false}
    query={query}
    accessTypes={accessTypes}
    standaloneFiltersEnabled={false}
    params={{}}
    prevDataOfOptedPackage={{}}
    results={{ length: 0, isLoading: false }}
    titlesFacets={{}}
    packagesFacetCollection={{ isLoading: false }}
    filterCount={0}
    onFilterChange={mockOnFilterChange}
    onToggleFilter={mockOnToggleFilter}
    onToggleActions={mockOnToggleActions}
    onStandaloneFilterChange={mockOnStandaloneFilterChange}
    visibleColumns={[]}
    toggleColumn={mockToggleColumn}
    renderFilters={mockRenderFilters}
    {...props}
  />
);

const openActionMenu = (getByRole) => fireEvent.click(getByRole('button', { name: /paneMenuActionsToggleLabel/i }));

describe('ActionMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render action menu toggle button', () => {
    const { getByRole } = renderActionMenu();

    expect(getByRole('button', { name: /paneMenuActionsToggleLabel/i })).toBeInTheDocument();
  });

  describe('when filterCount is greater than zero', () => {
    it('should render a filter badge with the count', () => {
      const { getByText } = renderActionMenu({ filterCount: 3 });

      expect(getByText('3')).toBeInTheDocument();
    });
  });

  describe('when filterCount is zero', () => {
    it('should not render a filter badge', () => {
      const { queryByText } = renderActionMenu({ filterCount: 0 });

      expect(queryByText('0')).not.toBeInTheDocument();
    });
  });

  describe('when the toggle button is clicked', () => {
    it('should call onToggleActions with true', () => {
      const { getByRole } = renderActionMenu();

      openActionMenu(getByRole);

      expect(mockOnToggleActions).toHaveBeenCalledWith(true);
    });

    it('should render the tags filter inside an IfPermission gate', () => {
      const { getByRole, getByTestId } = renderActionMenu();

      openActionMenu(getByRole);

      expect(getByTestId('search-form-tag-filter')).toBeInTheDocument();
    });

    it('should render the result of renderFilters', () => {
      const { getByRole, getByText } = renderActionMenu();

      openActionMenu(getByRole);

      expect(getByText('Filters')).toBeInTheDocument();
    });

    it('should call renderFilters with combined filters and column manager flags', () => {
      const { getByRole } = renderActionMenu();

      openActionMenu(getByRole);

      expect(mockRenderFilters).toHaveBeenCalledWith(expect.objectContaining({
        activeFilters: expect.objectContaining({ sort: 'name' }),
        resultsLength: 0,
        isResultsLoading: false,
        isPackagesLoading: false,
        hasAccordion: false,
        hasColumnManager: true,
        disabled: false,
        onUpdate: mockOnFilterChange,
        visibleColumns: [],
        toggleColumn: mockToggleColumn,
      }));
    });
  });

  describe('when searchType is TITLES and access types exist', () => {
    it('should render the access types filter', () => {
      const { getByRole, getByText } = renderActionMenu({ searchType: searchTypes.TITLES });

      openActionMenu(getByRole);

      expect(getByText('ui-eholdings.accessTypes.filter')).toBeInTheDocument();
    });
  });

  describe('when searchType is PACKAGES and access types exist', () => {
    it('should render the access types filter', () => {
      const { getByRole, getByText } = renderActionMenu({ searchType: searchTypes.PACKAGES });

      openActionMenu(getByRole);

      expect(getByText('ui-eholdings.accessTypes.filter')).toBeInTheDocument();
    });
  });

  describe('when searchType is PROVIDERS', () => {
    it('should not render the access types filter', () => {
      const { getByRole, queryByText } = renderActionMenu({ searchType: searchTypes.PROVIDERS });

      openActionMenu(getByRole);

      expect(queryByText('ui-eholdings.accessTypes.filter')).not.toBeInTheDocument();
    });
  });

  describe('when no access types are available', () => {
    it('should not render the access types filter', () => {
      const { getByRole, queryByText } = renderActionMenu({
        accessTypes: { isLoading: false, items: { data: [] } },
      });

      openActionMenu(getByRole);

      expect(queryByText('ui-eholdings.accessTypes.filter')).not.toBeInTheDocument();
    });
  });

  describe('when the tags filter clear button is clicked', () => {
    it('should call onStandaloneFilterChange with tags set to undefined', () => {
      const { getByRole } = renderActionMenu({
        searchByTagsEnabled: true,
        query: {
          sort: 'name',
          filter: {
            tags: ['urgent'],
            'access-type': undefined,
          },
        },
      });

      openActionMenu(getByRole);

      fireEvent.click(getByRole('button', { name: /clearFilterSetLabel/i }));

      expect(mockOnStandaloneFilterChange).toHaveBeenCalledWith({ tags: undefined });
    });
  });
});
