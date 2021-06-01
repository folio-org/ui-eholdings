import { render } from '@testing-library/react';

import ExternalLink from './external-link';

describe('Given ExternalLink', () => {
  const renderExternalLink = (props) => render(
    <ExternalLink
      href="test-link.com"
      target="_blank"
      rel="noreferrer"
      {...props}
    />
  );

  it('should show link', () => {
    const { getByText } = renderExternalLink();

    expect(getByText('test-link.com'));
  });
});
