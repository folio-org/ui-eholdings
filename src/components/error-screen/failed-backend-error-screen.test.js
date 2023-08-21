import { render } from '@folio/jest-config-stripes/testing-library/react';

import FailedBackendErrorScreen from './failed-backend-error-screen';

describe('Given FailedBackendErrorScreen', () => {
  const renderFailedBackendErrorScreen = () => render(<FailedBackendErrorScreen />);

  it('should show failed backend error message', () => {
    const { getByText } = renderFailedBackendErrorScreen();

    expect(getByText('ui-eholdings.server.errors.failedBackend'));
  });

  it('should show error during fetch message', () => {
    const { getByText } = renderFailedBackendErrorScreen();

    expect(getByText('ui-eholdings.server.errors.errorDuringFetch'));
  });
});
