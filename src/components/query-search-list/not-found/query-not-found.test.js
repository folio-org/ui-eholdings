import {
  render,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';

import QueryNotFound from './query-not-found';

describe('Given QueryNotFound', () => {
  const renderQueryNotFound = () => render(
    <QueryNotFound type="package-titles">
      <div>children</div>
    </QueryNotFound>
  );

  afterEach(cleanup);

  it('should render children', () => {
    const { getByText } = renderQueryNotFound();

    expect(getByText('children')).toBeDefined();
  });
});
