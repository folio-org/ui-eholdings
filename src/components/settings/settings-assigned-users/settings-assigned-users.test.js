import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import Harness from '../../../../test/jest/helpers/harness';

import SettingsAssignedUsers from './settings-assigned-users';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  Pluggable: ({ selectUser, renderTrigger }) => (
    renderTrigger({ onClick: selectUser })
  ),
}));

const assignedUsers = [{
  id: 'assigned-user-id',
  name: 'assigned-user-name',
  patronGroup: 'assigned-user-patron-group',
}];

const renderSettingsAssignedUsers = (props = {}) => render(
  <Harness>
    <SettingsAssignedUsers
      alreadyAssignedMessageDisplayed={false}
      assignedUsers={assignedUsers}
      credentialsId='credentials-id'
      hideAlreadyAssignedMessage={() => {}}
      knowledgeBaseName='Knowledge Base'
      onDeleteUser={() => {}}
      onSelectUser={() => {}}
      requestIsPending={false}
      {...props}
    />
  </Harness>
);

describe('Given SettingsAssignedUsers', () => {
  const mockOnDeleteUser = jest.fn();
  const mockOnSelectUser = jest.fn();

  it('should render SettingsAccessStatusTypes component', () => {
    const { getByTestId } = renderSettingsAssignedUsers();

    expect(getByTestId('settings-assigned-users')).toBeDefined();
  });

  it('should display `Assigned users` in the pane header and as the headline', () => {
    const { getAllByText } = renderSettingsAssignedUsers();

    expect(getAllByText('ui-eholdings.settings.assignedUsers')).toHaveLength(2);
  });

  describe('when assignedUsers array is empty', () => {
    it('should display an empty message', () => {
      const { getByText } = renderSettingsAssignedUsers({
        assignedUsers: [],
      });

      expect(getByText('ui-eholdings.settings.assignedUsers.list.emptyMessage')).toBeDefined();
    });
  });

  it('should display table column titles', () => {
    const { getByText } = renderSettingsAssignedUsers();

    expect(getByText('ui-eholdings.settings.assignedUsers.list.name')).toBeDefined();
    expect(getByText('ui-eholdings.settings.assignedUsers.list.patronGroup')).toBeDefined();
  });

  it('should display assigned users info', () => {
    const { getByText } = renderSettingsAssignedUsers();

    expect(getByText('assigned-user-name')).toBeDefined();
    expect(getByText('assigned-user-patron-group')).toBeDefined();
  });

  it('should display unassign user icon button', () => {
    const { getByRole } = renderSettingsAssignedUsers();

    expect(getByRole('button', { name: 'ui-eholdings.settings.assignedUsers.list.unassignUser' })).toBeDefined();
  });

  describe('when click on unassign user icon button', () => {
    it('should show a confirmation modal', () => {
      const {
        getByRole,
        getByTestId,
        getByText,
      } = renderSettingsAssignedUsers();

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.settings.assignedUsers.list.unassignUser' }));

      expect(getByTestId('unassign-user-confirmation-modal')).toBeDefined();

      const title = 'ui-eholdings.settings.assignedUsers.confirmationModal.title';
      const message = 'ui-eholdings.settings.assignedUsers.confirmationModal.prompt';
      const cancelButton = 'ui-eholdings.settings.assignedUsers.confirmationModal.cancelButton';
      const confirmButton = 'ui-eholdings.settings.assignedUsers.confirmationModal.confirmButton';

      expect(getByText(title)).toBeDefined();
      expect(getByText(message)).toBeDefined();
      expect(getByRole('button', { name: cancelButton })).toBeDefined();
      expect(getByRole('button', { name: confirmButton })).toBeDefined();
    });

    describe('when click on cancel button on confirm unassign user modal', () => {
      it('should close modal and do not unassign user', () => {
        const {
          getByRole,
          getByTestId,
          queryByTestId,
          getByText,
        } = renderSettingsAssignedUsers();

        fireEvent.click(getByRole('button', { name: 'ui-eholdings.settings.assignedUsers.list.unassignUser' }));

        expect(getByTestId('unassign-user-confirmation-modal')).toBeDefined();

        const cancelButton = 'ui-eholdings.settings.assignedUsers.confirmationModal.cancelButton';

        fireEvent.click(getByRole('button', { name: cancelButton }));

        expect(queryByTestId('unassign-user-confirmation-modal')).toBeNull();

        expect(getByText('assigned-user-name')).toBeDefined();
        expect(getByText('assigned-user-patron-group')).toBeDefined();
      });
    });

    describe('when click on confirm button on confirm unassign user modal', () => {
      it('should close modal and handle onDeleteUser', () => {
        const {
          getByRole,
          getByTestId,
          queryByTestId,
        } = renderSettingsAssignedUsers({
          onDeleteUser: mockOnDeleteUser,
        });

        fireEvent.click(getByRole('button', { name: 'ui-eholdings.settings.assignedUsers.list.unassignUser' }));

        expect(getByTestId('unassign-user-confirmation-modal')).toBeDefined();

        const confirmButton = 'ui-eholdings.settings.assignedUsers.confirmationModal.confirmButton';

        fireEvent.click(getByRole('button', { name: confirmButton }));

        expect(queryByTestId('unassign-user-confirmation-modal')).toBeNull();
        expect(mockOnDeleteUser).toBeCalled();
      });
    });
  });

  describe('when the request is pending', () => {
    it('should show spinner', () => {
      const { container } = renderSettingsAssignedUsers({
        requestIsPending: true,
      });

      expect(container.querySelector('.icon-spinner-ellipsis')).toBeDefined();
    });
  });

  describe('when click on `Assign user` button', () => {
    it('should handle onSelectUser', () => {
      const { getByText } = renderSettingsAssignedUsers({
        onSelectUser: mockOnSelectUser,
      });

      fireEvent.click(getByText('ui-eholdings.settings.assignedUsers.pluginButtonMessage'));

      expect(mockOnSelectUser).toBeCalled();
    });
  });
});
