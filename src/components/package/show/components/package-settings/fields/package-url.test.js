import {
  render,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';

import Harness from '../../../../../../../test/jest/helpers/harness';

import { PackageUrl } from './package-url';

const renderPackageUrl = (props = {}) => render(
  <Harness>
    <PackageUrl {...props} />
  </Harness>
);

describe('Given PackageUrl', () => {
  afterEach(cleanup);

  it('should render the URL as an external link', () => {
    const { getByRole } = renderPackageUrl({ url: 'https://example.com' });
    const urlLink = getByRole('link', { name: 'https://example.com' });

    expect(urlLink).toHaveAttribute('href', 'https://example.com');
    expect(urlLink).toHaveAttribute('target', '_blank');
    expect(urlLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should display NoValue when URL is missing', () => {
    const { getByText } = renderPackageUrl();

    expect(getByText('NoValue')).toBeDefined();
  });
});
