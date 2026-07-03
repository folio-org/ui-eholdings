import {
  render,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';

import SearchBadge from './search-badge';

describe('Given SearchBadge', () => {
  const mockOnClick = jest.fn();

  const renderSearchBadge = (props = {}) => render(
    <SearchBadge
      filterCount={2}
      onClick={mockOnClick}
      {...props}
    />
  );

  afterEach(() => {
    cleanup();
    mockOnClick.mockClear();
  });

  it('should render badge count', () => {
    const { getByText } = renderSearchBadge();

    expect(getByText('2')).toBeDefined();
  });

  describe('when badge count is 0 or less', () => {
    it('should not render badge count', () => {
      const { queryByText } = renderSearchBadge({
        filterCount: -2,
      });

      expect(queryByText('-2')).toBeNull();
    });
  });
});
