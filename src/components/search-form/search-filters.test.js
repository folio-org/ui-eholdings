import {
  render,
  cleanup,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import Harness from '../../../test/jest/helpers/harness';
import SearchFilters from './search-filters';

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

  describe('when editing filter value', () => {
    it('should call onUpdate', () => {
      const { getByLabelText } = renderSearchFilters();

      fireEvent.click(getByLabelText('Package-label'));

      expect(mockOnUpdate).toBeCalledWith({ sort: 'package' });
    });
  });
});
