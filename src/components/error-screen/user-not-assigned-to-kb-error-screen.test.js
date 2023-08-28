import { render } from '@folio/jest-config-stripes/testing-library/react';

import UserNotAssignedToKbErrorScreen from './user-not-assigned-to-kb-error-screen';

describe('Given InvalidBackendErrorScreen', () => {
  const renderUserNotAssignedToKbErrorScreen = () => render(<UserNotAssignedToKbErrorScreen />);

  it('should show error message user not assigned to knowledge base', () => {
    const { getByText } = renderUserNotAssignedToKbErrorScreen();

    expect(getByText('ui-eholdings.server.errors.userNotAssignedToKb'));
  });
});
