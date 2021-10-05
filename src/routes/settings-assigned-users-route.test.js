import { MemoryRouter } from 'react-router-dom';
import noop from 'lodash/noop';

import {
  render,
  cleanup,
  act,
  fireEvent,
} from '@testing-library/react';

import SettingsAssignedUsersRoute from './settings-assigned-users-route';
import Harness from '../../test/jest/helpers/harness';

jest.mock('../components/settings/settings-assigned-users', () => ({
  onDeleteUser,
  onSelectUser,
  alreadyAssignedMessageDisplayed,
  hideAlreadyAssignedMessage,
}) => (
  <>
    <button
      type="button"
      onClick={onDeleteUser}
    >
      Delete user
    </button>

    <button
      type="button"
      onClick={() => onSelectUser({
        id: 'test-user-id',
        personal: {
          firstName: 'test-first-name',
          middleName: 'test-middle-name',
          lastName: 'test-last-name',
        },
      })}
    >
      Select user
    </button>

    {alreadyAssignedMessageDisplayed && (
      <>
        <div>Already assigned message</div>
        <button
          type="button"
          onClick={hideAlreadyAssignedMessage}
        >
          Hide already assigned message
        </button>
      </>
    )}
  </>
));

const mockGetKBCredentialsUsers = jest.fn();
const mockDeleteKBCredentialsUser = jest.fn();
const mockPostKBCredentialsUser = jest.fn();
const mockGetUserGroups = jest.fn();

jest.mock('../redux/actions', () => ({
  ...jest.requireActual('../redux/actions'),
  getKBCredentialsUsers: mockGetKBCredentialsUsers,
  deleteKBCredentialsUser: mockDeleteKBCredentialsUser,
  postKBCredentialsUser: mockPostKBCredentialsUser,
  getUserGroups: mockGetUserGroups,
}));

const assignedUsers = {
  errors: [],
  hasFailed: false,
  hasLoaded: true,
  isLoading: false,
  items: [{
    attributes: {
      credentialsId: 'credentials-id',
      lastName: 'Doe',
      patronGroup: 'patron-group',
    },
    id: 'user-id',
    type: 'test-type',
  }],
};

const kbId = 'test-kb-id';

const kbCredentials = {
  errors: [],
  hasFailed: false,
  hasKeyLoaded: false,
  hasLoaded: true,
  hasUpdated: false,
  isKeyLoading: false,
  isLoading: false,
  isUpdating: false,
  items: [{
    attributes: {
      apiKey: 'api-key',
      customerId: 'customer-id',
      name: 'Knowledge Base',
      url: 'test-url',
    },
    id: kbId,
    type: 'kbCredentials',
  }],
};

const userGroups = {
  errors: [],
  hasFailed: false,
  hasLoaded: true,
  isLoading: false,
  items: [{
    attributes: {
      desc: 'User group',
      group: 'test-group',
      id: 'group-id',
    },
  }],
};

const match = {
  isExact: true,
  params: { kbId },
  path: '/eholdings',
  url: '/eholdings',
};

const renderSettingsAssignedUsersRoute = ({ harnessProps = {}, props = {} }) => render(
  <MemoryRouter>
    <Harness
      storeInitialState={{
        data: {
          kbCredentialsUsers: assignedUsers,
          kbCredentials,
          userGroups,
        },
      }}
      {...harnessProps}
    >
      <SettingsAssignedUsersRoute
        deleteKBCredentialsUser={noop}
        getKBCredentialsUsers={noop}
        getUserGroups={noop}
        match={match}
        postKBCredentialsUser={noop}
        {...props}
      />
    </Harness>
  </MemoryRouter>
);

describe('Given SettingsAssignedUsersRoute', () => {
  beforeEach(() => {
    mockGetKBCredentialsUsers.mockClear();
    mockDeleteKBCredentialsUser.mockClear();
    mockPostKBCredentialsUser.mockClear();
    mockGetUserGroups.mockClear();
  });

  afterEach(cleanup);

  it('should handle getKBCredentialsUsers', async () => {
    await act(async () => {
      await renderSettingsAssignedUsersRoute({
        props: { getKBCredentialsUsers: mockGetKBCredentialsUsers },
      });
    });

    expect(mockGetKBCredentialsUsers).toHaveBeenCalled();
    expect(mockGetKBCredentialsUsers).toHaveBeenCalledWith(kbId);
  });

  it('should handle getUserGroups', async () => {
    await act(async () => {
      await renderSettingsAssignedUsersRoute({
        props: { getUserGroups: mockGetUserGroups },
      });
    });

    expect(mockGetUserGroups).toHaveBeenCalled();
  });

  describe('when click on unassign user icon button', () => {
    describe('when click on confirm button on confirm unassign user modal', () => {
      it('should handle deleteKBCredentialsUser', async () => {
        let getByRole;

        await act(async () => {
          getByRole = await renderSettingsAssignedUsersRoute({
            props: { deleteKBCredentialsUser: mockDeleteKBCredentialsUser },
          }).getByRole;
        });

        fireEvent.click(getByRole('button', { name: 'Delete user' }));

        expect(mockDeleteKBCredentialsUser).toHaveBeenCalled();
      });
    });
  });

  describe('when assignedUsers and/or userGroups are not loaded', () => {
    it('should show spinner', () => {
      const { container } = renderSettingsAssignedUsersRoute({
        harnessProps: {
          storeInitialState: {
            data: {
              kbCredentialsUsers: {
                ...assignedUsers,
                hasLoaded: false,
              },
              kbCredentials,
              userGroups: {
                ...userGroups,
                hasLoaded: false,
              },
            },
          },
        },
      });

      expect(container.querySelector('.icon-spinner-ellipsis')).toBeDefined();
    });
  });

  describe('when assignedUsers contains errors', () => {
    it('should show toast with an error message', async () => {
      let getByText;

      await act(async () => {
        getByText = await renderSettingsAssignedUsersRoute({
          harnessProps: {
            storeInitialState: {
              data: {
                kbCredentialsUsers: {
                  ...assignedUsers,
                  errors: [{ title: 'Error title' }],
                },
                kbCredentials,
                userGroups,
              },
            },
          },
        }).getByText;
      });

      expect(getByText('ui-eholdings.settings.assignedUsers.networkErrorMessage')).toBeDefined();
    });
  });

  describe('when assignedUsers contains an `assigned to another credentials` error', () => {
    it('should display an `already assigned` message', async () => {
      let getByText;

      await act(async () => {
        getByText = await renderSettingsAssignedUsersRoute({
          harnessProps: {
            storeInitialState: {
              data: {
                kbCredentialsUsers: {
                  ...assignedUsers,
                  errors: [{ title: 'The user is already assigned to another credentials' }],
                },
                kbCredentials,
                userGroups,
              },
            },
          },
        }).getByText;
      });

      expect(getByText('Already assigned message')).toBeDefined();
    });
  });

  describe('when click on `hide already assigned message` button', () => {
    it('should hide an `already assigned` message', async () => {
      let getByRoleFunction;
      let getByTextFunction;
      let queryByTextFunction;

      await act(async () => {
        const {
          getByRole,
          getByText,
          queryByText,
        } = await renderSettingsAssignedUsersRoute({
          harnessProps: {
            storeInitialState: {
              data: {
                kbCredentialsUsers: {
                  ...assignedUsers,
                  errors: [{ title: 'The user is already assigned to another credentials' }],
                },
                kbCredentials,
                userGroups,
              },
            },
          },
        });

        getByRoleFunction = getByRole;
        getByTextFunction = getByText;
        queryByTextFunction = queryByText;
      });

      expect(getByTextFunction('Already assigned message')).toBeDefined();

      fireEvent.click(getByRoleFunction('button', { name: 'Hide already assigned message' }));

      expect(queryByTextFunction('Already assigned message')).toBeNull();
    });
  });

  describe('when click on `Assign user` button', () => {
    it('should handle postKBCredentialsUser', async () => {
      let getByText;

      await act(async () => {
        getByText = await renderSettingsAssignedUsersRoute({
          props: { postKBCredentialsUser: mockPostKBCredentialsUser },
        }).getByText;
      });

      fireEvent.click(getByText('Select user'));

      expect(mockPostKBCredentialsUser).toHaveBeenCalled();
    });
  });

  describe('when user is already assigned to current KB', () => {
    it('should not handle postKBCredentialsUser', async () => {
      let getByText;

      await act(async () => {
        getByText = await renderSettingsAssignedUsersRoute({
          props: { postKBCredentialsUser: mockPostKBCredentialsUser },
          harnessProps: {
            storeInitialState: {
              data: {
                kbCredentialsUsers: {
                  ...assignedUsers,
                  items: [{
                    ...assignedUsers.items[0],
                    id: 'test-user-id',
                  }],
                },
                kbCredentials,
                userGroups,
              },
            },
          },
        }).getByText;
      });

      fireEvent.click(getByText('Select user'));

      expect(mockPostKBCredentialsUser).not.toHaveBeenCalled();
    });
  });
});
