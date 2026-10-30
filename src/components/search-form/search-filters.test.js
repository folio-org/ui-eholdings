import {
  render,
  cleanup,
  fireEvent,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import Harness from '../../../test/jest/helpers/harness';
import SearchFilters from './search-filters';
import { FILTER_TYPES } from '../../constants';

const mockOnUpdate = jest.fn();
const mockToggleColumn = jest.fn();

const renderSearchFilters = (props = {}) => render(
  <Harness>
    <SearchFilters
      activeFilters={{
        sort: 'undefined',
      }}
      availableFilters={[{
        label: 'Sort-label',
        name: 'sort',
        options: [{
          labelId: 'Relevance-label',
          filters: { sort: 'relevance' },
          isDefault: true,
        }, {
          labelId: 'Package-label',
          filters: { sort: 'package' },
        }],
      }, {
        type: FILTER_TYPES.SELECT,
        label: 'Publication-type',
        name: 'publicationType',
        options: [{
          labelId: 'All-label',
          filters: { publicationType: 'all' },
          isDefault: true,
        }, {
          labelId: 'Book-label',
          filters: { publicationType: 'book' },
        }],
      }]}
      onUpdate={mockOnUpdate}
      searchType="titles"
      toggleColumn={mockToggleColumn}
      {...props}
    />
  </Harness>
);

describe('Given SearchFilters', () => {
  afterEach(() => {
    cleanup();
    mockOnUpdate.mockClear();
    mockToggleColumn.mockClear();
  });

  it('should render available filters', () => {
    const { getByText } = renderSearchFilters();

    expect(getByText('Sort-label')).toBeDefined();
    expect(getByText('Publication-type')).toBeDefined();
  });

  describe('when editing checkbox filter value', () => {
    it('should call onUpdate', () => {
      const { getByLabelText } = renderSearchFilters();

      fireEvent.click(getByLabelText('Package-label'));

      expect(mockOnUpdate).toHaveBeenCalledWith({ sort: 'package' });
    });
  });

  describe('when editing select filter value', () => {
    it('should call onUpdate', () => {
      const { getByRole } = renderSearchFilters();

      fireEvent.change(getByRole('combobox'), { target: { value: 'Book-label' } });

      expect(mockOnUpdate).toHaveBeenCalledWith(expect.objectContaining({ publicationType: 'book' }));
    });
  });

  describe('when an option sets several filters', () => {
    const availableFilters = [{
      type: FILTER_TYPES.SELECT,
      label: 'Status-label',
      name: 'status',
      options: [
        { labelId: 'All-label', filters: {}, isDefault: true },
        { labelId: 'Selected-label', filters: { selected: 'true' } },
        { labelId: 'Hidden-label', filters: { selected: 'true', visibility: 'hiddenInPF' } },
      ],
    }];

    it('should apply all of them and keep unrelated filters', () => {
      const { getByRole } = renderSearchFilters({ availableFilters, activeFilters: { q: 'abc' } });

      fireEvent.change(getByRole('combobox'), { target: { value: 'Hidden-label' } });

      expect(mockOnUpdate).toHaveBeenCalledWith({ q: 'abc', selected: 'true', visibility: 'hiddenInPF' });
    });

    it('should clear the stale filter when switching to an option with fewer filters', () => {
      const { getByRole } = renderSearchFilters({
        availableFilters,
        activeFilters: { selected: 'true', visibility: 'hiddenInPF' },
      });

      fireEvent.change(getByRole('combobox'), { target: { value: 'Selected-label' } });

      expect(mockOnUpdate).toHaveBeenCalledWith({ selected: 'true' });
    });

    it('should clear all of them when switching to the default option', () => {
      const { getByRole } = renderSearchFilters({
        availableFilters,
        activeFilters: { q: 'abc', selected: 'true', visibility: 'hiddenInPF' },
      });

      fireEvent.change(getByRole('combobox'), { target: { value: 'All-label' } });

      expect(mockOnUpdate).toHaveBeenCalledWith({ q: 'abc' });
    });
  });

  describe('when filtering a Selection filter', () => {
    const availableFilters = [{
      type: FILTER_TYPES.SELECTION,
      label: 'Status-label',
      name: 'status',
      options: [
        { labelId: 'All-label', filters: {}, isDefault: true },
        { labelId: 'Hidden-label', filters: { selected: 'true', visibility: 'hiddenInPF' } },
      ],
    }];

    it('should match options containing the text, not only starting with it', async () => {
      const { getByRole, getByPlaceholderText, getAllByRole } = renderSearchFilters({ availableFilters });

      fireEvent.click(getByRole('button', { name: /All-label/ }));
      fireEvent.change(getByPlaceholderText('stripes-components.selection.filterOptionsPlaceholder'), {
        target: { value: 'idden' },
      });

      await waitFor(() => {
        expect(getAllByRole('option').map(o => o.textContent)).toEqual(['Hidden-label']);
      });
    });
  });

  describe('when passing hasColumnManager prop', () => {
    it('should render ColumnManager', () => {
      const { getByText } = renderSearchFilters({
        hasColumnManager: true,
      });

      expect(getByText('stripes-smart-components.columnManager.showColumns')).toBeInTheDocument();
    });

    describe('when clicking on a column checkbox', () => {
      it('should call toggleColumn', () => {
        const { getByRole } = renderSearchFilters({
          hasColumnManager: true,
        });

        fireEvent.click(getByRole('checkbox', { name: 'ui-eholdings.titlesList.status' }));

        expect(mockToggleColumn).toHaveBeenCalledWith('status');
      });
    });
  });
});
