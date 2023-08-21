import { render } from '@folio/jest-config-stripes/testing-library/react';

import TokenDisplay from './token-display';

const tokenWithoutValue = {
  prompt: 'test-prompt',
};

const tokenWithValue = {
  ...tokenWithoutValue,
  value: 'test-value',
};

const typeProvider = 'provider';
const typePackage = 'package';

describe('Given TokenDisplay', () => {
  const renderTokenDisplay = (props = {}) => render(
    <TokenDisplay
      token={tokenWithValue}
      type={typeProvider}
      {...props}
    />
  );

  it('should display message of token not set for the provider', () => {
    const { getByText } = renderTokenDisplay({
      token: tokenWithoutValue,
    });

    expect(getByText('ui-eholdings.provider.noTokenSet')).toBeDefined();
  });

  it('should display message of token not set for the package', () => {
    const { getByText } = renderTokenDisplay({
      token: tokenWithoutValue,
      type: typePackage,
    });

    expect(getByText('ui-eholdings.package.noTokenSet')).toBeDefined();
  });

  it('should display token information', () => {
    const { getByText } = renderTokenDisplay();

    expect(getByText('test-prompt: test-value')).toBeDefined();
  });
});
