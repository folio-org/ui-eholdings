import {
  render,
  cleanup,
} from '@testing-library/react';

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
});
