import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon } from '@folio/stripes/components';

import { createResolver } from '../redux';
import { Status } from '../redux/application';
import { getKbCredentials as getKbCredentialsAction } from '../redux/actions';
import { selectPropFromData } from '../redux/selectors';
import { KbCredentials } from '../constants';
import NoBackendErrorScreen from '../components/error-screen/no-backend-error-screen';
import FailedBackendErrorScreen from '../components/error-screen/failed-backend-error-screen';
import InvalidBackendErrorScreen from '../components/error-screen/invalid-backend-error-screen';
import UserNotAssignedToKbErrorScreen from '../components/error-screen/user-not-assigned-to-kb-error-screen';

class ApplicationRoute extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    getBackendStatus: PropTypes.func.isRequired,
    getKbCredentials: PropTypes.func.isRequired,
    interfaces: PropTypes.shape({
      eholdings: PropTypes.shape({
        version: PropTypes.string,
      }),
    }),
    kbCredentials: KbCredentials.KbCredentialsReduxStateShape.isRequired,
    showSettings: PropTypes.bool,
    status: PropTypes.shape({
      isConfigurationValid: PropTypes.bool.isRequired,
      isLoaded: PropTypes.bool.isRequired,
      isLoading: PropTypes.bool.isRequired,
      request: PropTypes.shape({
        isRejected: PropTypes.bool.isRequired,
      }).isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props);
    props.getBackendStatus();
    props.getKbCredentials();
  }

  render() {
    const {
      status,
      interfaces: { eholdings: version },
      showSettings,
      children,
      kbCredentials,
    } = this.props;

    const hasMultipleKbCredentials = kbCredentials.items?.length > 1;

    return (
      version ? (kbCredentials.isLoading && status.isLoading ? (
        <Icon icon="spinner-ellipsis" />
      ) : status.request.isRejected ? (
        <FailedBackendErrorScreen />
      ) : status.isLoaded && (
        (!showSettings && !status.isConfigurationValid)
          ? (hasMultipleKbCredentials ? <UserNotAssignedToKbErrorScreen /> : <InvalidBackendErrorScreen />)
          : children
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
      kbCredentials: selectPropFromData(store, 'kbCredentials'),
    };
  }, {
    getBackendStatus: () => Status.find('status'),
    getKbCredentials: getKbCredentialsAction,
  }
)(ApplicationRoute);
