import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon } from '@folio/stripes/components';

import { createResolver } from '../redux';
import { Status } from '../redux/application';
import { getUsersKbCredentials as getUsersKbCredentialsAction } from '../redux/actions';
import { selectPropFromData } from '../redux/selectors';
import { KbCredentialsUsers } from '../constants';
import NoBackendErrorScreen from '../components/error-screen/no-backend-error-screen';
import FailedBackendErrorScreen from '../components/error-screen/failed-backend-error-screen';
import InvalidBackendErrorScreen from '../components/error-screen/invalid-backend-error-screen';
import UserNotAssignedToKbErrorScreen from '../components/error-screen/user-not-assigned-to-kb-error-screen';

class ApplicationRoute extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    getBackendStatus: PropTypes.func.isRequired,
    getUsersKbCredentials: PropTypes.func.isRequired,
    kbCredentialsUsers: KbCredentialsUsers.kbCredentialsUsersReduxStateShape,
    interfaces: PropTypes.object,
    showSettings: PropTypes.bool,
    status: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    props.getBackendStatus();
    props.getUsersKbCredentials();
  }

  render() {
    const {
      status,
      interfaces: { eholdings: version },
      showSettings,
      children,
      kbCredentialsUsers,
      kbCredentials,
    } = this.props;
    const {
      isLoading: isLoadingUser,
      userKbCredentials,
      errors,
    } = kbCredentialsUsers;

    const userHasKbCredentials = !isLoadingUser && !errors.length && !!userKbCredentials;

    return (
      version ? (status.isLoading ? (
        <Icon icon="spinner-ellipsis" />
      ) : status.request.isRejected ? (
        <FailedBackendErrorScreen />
      ) : status.isLoaded && (
        !(showSettings || status.isConfigurationValid)
          ? <InvalidBackendErrorScreen />
          : userHasKbCredentials ? children : <UserNotAssignedToKbErrorScreen />
      )) : <NoBackendErrorScreen />
    );
  }
}

export default connect(
  (store) => {
    const {
      eholdings: { data },
      discovery: { interfaces = {} },
    } = store;

    return {
      status: createResolver(data).find('statuses', 'status'),
      interfaces,
      kbCredentialsUsers: selectPropFromData(store, 'kbCredentialsUsers'),
    };
  }, {
    getBackendStatus: () => Status.find('status'),
    getUsersKbCredentials: getUsersKbCredentialsAction,
  }
)(ApplicationRoute);
