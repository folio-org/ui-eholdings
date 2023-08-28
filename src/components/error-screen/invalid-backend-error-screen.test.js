import { render } from '@folio/jest-config-stripes/testing-library/react';

import InvalidBackendErrorScreen from './invalid-backend-error-screen';

describe('Given InvalidBackendErrorScreen', () => {
  const renderInvalidBackendErrorScreen = () => render(<InvalidBackendErrorScreen />);

  it('should show error message than knowledge base it not configured', () => {
    const { getByText } = renderInvalidBackendErrorScreen();

    expect(getByText('ui-eholdings.server.errors.kbNotConfigured'));
  });

  it('should show error messag that detected unconfigured knowledge base', () => {
    const { getByText } = renderInvalidBackendErrorScreen();

    expect(getByText('ui-eholdings.server.errors.detectedUnconfiguredKb'));
  });

  it('should show link to configure knowledge base', () => {
    const { getByText } = renderInvalidBackendErrorScreen();

    expect(getByText('ui-eholdings.server.errors.configureKbLinkMsg'));
  });
});
