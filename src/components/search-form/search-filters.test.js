import {
  render,
  cleanup,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import Harness from '../../../test/jest/helpers/harness';
import SearchFilters from './search-filters';
import { FILTER_TYPES } from '../../constants';

const mockOnUpdate = jest.fn();

const renderSearchFilters = (props = {}) => render(
  <Harness>
    <SearchFilters
      activeFilters={{
        sort: 'undefined',
      }}
      availableFilters={[{
        label: 'Sort-label',
        name: 'sort',
        defaultValue: 'relevance',
        options: [{
          label: 'Relevance-label',
          value: 'relevance',
        }, {
          label: 'Package-label',
          value: 'package',
        }],
      }, {
        type: FILTER_TYPES.SELECT,
        label: 'Publication-type',
        name: 'publicationType',
        defaultValue: 'all',
        options: [{
          label: 'All-label',
          value: 'all',
        }, {
          label: 'Book-label',
          value: 'book',
        }],
      }]}
      onUpdate={mockOnUpdate}
      searchType="packages"
      {...props}
    />
  </Harness>
);

describe('Given SearchFilters', () => {
  afterEach(() => {
    cleanup();
    mockOnUpdate.mockClear();
  });

  it('should render available filters', () => {
    const { getByText } = renderSearchFilters();

    expect(getByText('Sort-label')).toBeDefined();
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

      fireEvent.change(getByRole('combobox'), { target: { value: 'book' } });

      expect(mockOnUpdate).toHaveBeenCalledWith(expect.objectContaining({ publicationType: 'book' }));
    });
  });
});
