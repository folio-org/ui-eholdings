import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Icon } from '@folio/stripes/components';

import View from '../../components/settings/settings-assigned-users';
import Toaster from '../../components/toaster';

import {
  KbCredentialsUsers,
  KbCredentials,
} from '../../constants';
import { getFullName } from '../../components/utilities';

const ASSIGNED_TO_ANOTHER_CREDENTIALS_BACKEND_ERROR = 'The user is already assigned to another credentials';

const propTypes = {
  assignedUsers: KbCredentialsUsers.kbCredentialsUsersReduxStateShape.isRequired,
  deleteKBCredentialsUser: PropTypes.func.isRequired,
  getKBCredentialsUsers: PropTypes.func.isRequired,
  kbCredentials: KbCredentials.KbCredentialsReduxStateShape,
  match: ReactRouterPropTypes.match.isRequired,
  postKBCredentialsUser: PropTypes.func.isRequired,
};

const SettingsAssignedUsersRoute = ({
  getKBCredentialsUsers,
  deleteKBCredentialsUser,
  postKBCredentialsUser,
  assignedUsers,
  kbCredentials,
  match: { params: { kbId } },
}) => {
  useEffect(() => {
    getKBCredentialsUsers(kbId);
  }, [getKBCredentialsUsers, kbId]);

  const [
    alreadyAssignedMessageDisplayed,
    setAlreadyAssignedMessageDisplayed,
  ] = useState(false);

  const [
    userToBeAssigned,
    setUserToBeAssigned,
  ] = useState(null);

  useEffect(() => {
    const lastError = assignedUsers.errors[assignedUsers.errors.length - 1];

    if (lastError?.title === ASSIGNED_TO_ANOTHER_CREDENTIALS_BACKEND_ERROR) {
      setAlreadyAssignedMessageDisplayed(true);
    }
  }, [assignedUsers.errors]);

  const hideAlreadyAssignedMessage = () => {
    setAlreadyAssignedMessageDisplayed(false);
  };

  const formattedAssignedUsersList = assignedUsers.items.map(user => ({
    name: getFullName(user.attributes),
    patronGroup: user.attributes.patronGroup,
    id: user.id,
  }));

  const currentKB = kbCredentials.items.find(({ id }) => id === kbId);

  const toasts = useMemo(() => {
    return assignedUsers.errors
      .filter(error => error.title !== ASSIGNED_TO_ANOTHER_CREDENTIALS_BACKEND_ERROR)
      .map(() => ({
        message: <FormattedMessage id="ui-eholdings.settings.assignedUsers.networkErrorMessage" values={{ personal: getFullName(userToBeAssigned.personal) }} />,
        type: 'error',
        id: `kbId-${Date.now()}`,
      }));
  }, [assignedUsers.errors]);


  const getFormattedUserData = user => {
    const { id } = user;

    return {
      data: {
        id,
        credentialsId: kbId,
      },
    };
  };

  const handleUserSelection = user => {
    const userIsAlreadyAssignedToCurrentKB = assignedUsers.items.some(({ id }) => id === user.id);

    if (!userIsAlreadyAssignedToCurrentKB) {
      postKBCredentialsUser(kbId, getFormattedUserData(user));
    }

    setUserToBeAssigned(user);
  };

  const assignedUsersLoaded = assignedUsers.hasLoaded || assignedUsers.hasFailed;

  return (
    <>
      {assignedUsersLoaded
        ? (
          <View
            requestIsPending={assignedUsers.isLoading}
            assignedUsers={formattedAssignedUsersList}
            knowledgeBaseName={currentKB.attributes.name}
            onDeleteUser={deleteKBCredentialsUser}
            credentialsId={kbId}
            onSelectUser={handleUserSelection}
            alreadyAssignedMessageDisplayed={alreadyAssignedMessageDisplayed}
            hideAlreadyAssignedMessage={hideAlreadyAssignedMessage}
          />
        )
        : <Icon icon="spinner-ellipsis" />
      }
      <Toaster
        toasts={toasts}
        position="bottom"
      />
    </>
  );
};

SettingsAssignedUsersRoute.propTypes = propTypes;

export default SettingsAssignedUsersRoute;
