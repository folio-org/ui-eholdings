import { render } from '@folio/jest-config-stripes/testing-library/react';

import KeyValueColumns from './key-value-columns';

describe('Given KeyValueColumns', () => {
  it('should render KeyValueColumns', () => {
    const { getByText } = render(
      <KeyValueColumns>
        <span>content</span>
      </KeyValueColumns>
    );

    expect(getByText('content')).toBeDefined();
  });
});
