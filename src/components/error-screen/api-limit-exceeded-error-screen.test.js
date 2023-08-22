import { render } from '@folio/jest-config-stripes/testing-library/react';

import ApiLimitExceededErrorScreen from './api-limit-exceeded-error-screen';

describe('Given ApiLimitExceededErrorScreen', () => {
  const renderApiLimitExceededErrorScreen = () => render(<ApiLimitExceededErrorScreen />);

  it('should show unable to complite error message', () => {
    const { getByText } = renderApiLimitExceededErrorScreen();

    expect(getByText('ui-eholdings.server.errors.unableToCompleteOperation'));
  });

  it('should show api limit exceeded message', () => {
    const { getByText } = renderApiLimitExceededErrorScreen();

    expect(getByText('ui-eholdings.server.errors.apiLimitExceeded'));
  });
});
