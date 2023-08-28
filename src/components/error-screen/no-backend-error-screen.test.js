import { render } from '@folio/jest-config-stripes/testing-library/react';

import NoBackendErrorScreen from './no-backend-error-screen';

describe('Given InvalidBackendErrorScreen', () => {
  const renderNoBackendErrorScreen = () => render(<NoBackendErrorScreen />);

  it('should show error message than knowledge base it not detected', () => {
    const { getByText } = renderNoBackendErrorScreen();

    expect(getByText('ui-eholdings.server.errors.noKbDetected'));
  });

  it('should show error messag that knowledge base is required', () => {
    const { getByText } = renderNoBackendErrorScreen();

    expect(getByText('ui-eholdings.server.errors.kbRequired'));
  });

  it('should show error message than backend should be installed', () => {
    const { getByText } = renderNoBackendErrorScreen();

    expect(getByText('ui-eholdings.server.errors.installBackend'));
  });
});
