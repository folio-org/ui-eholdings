import { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@folio/stripes/components';

import {
  KbCredentials,
  httpResponseCodes,
} from '../../constants';
import NoBackendErrorScreen from '../../components/error-screen/no-backend-error-screen';
import FailedBackendErrorScreen from '../../components/error-screen/failed-backend-error-screen';
import InvalidBackendErrorScreen from '../../components/error-screen/invalid-backend-error-screen';
import UserNotAssignedToKbErrorScreen from '../../components/error-screen/user-not-assigned-to-kb-error-screen';
import ApiLimitExceededErrorScreen from '../../components/error-screen/api-limit-exceeded-error-screen';

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
    isFinished: PropTypes.bool,
    kbCredentials: KbCredentials.KbCredentialsReduxStateShape.isRequired,
    showSettings: PropTypes.bool,
    status: PropTypes.shape({
      isConfigurationValid: PropTypes.bool.isRequired,
      isLoaded: PropTypes.bool.isRequired,
      isLoading: PropTypes.bool.isRequired,
      request: PropTypes.shape({
        isRejected: PropTypes.bool.isRequired,
        status: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    if (!props.showSettings) {
      props.getBackendStatus();
    }

    props.getKbCredentials();
  }

  render() {
    const {
      status,
      interfaces: { eholdings: version },
      isFinished,
      showSettings,
      children,
      kbCredentials,
    } = this.props;

    const hasMultipleKbCredentials = kbCredentials.items?.length > 1;

    if (!version && isFinished && !showSettings) {
      return <NoBackendErrorScreen />;
    }

    const isLoadingKbCredentials = kbCredentials.isLoading || (!kbCredentials.hasLoaded && !kbCredentials.hasFailed);
    const isLoadingStatus = status.isLoading || (!status.isLoaded && !status.request.isRejected);

    if (isLoadingKbCredentials && (isLoadingStatus && !showSettings)) {
      return (
        <Icon
          id="kb-credentials-loading-spinner"
          icon="spinner-ellipsis"
        />
      );
    }

    if (status.request.isRejected && !showSettings) {
      if (status.request.status === httpResponseCodes.API_LIMIT_EXCEEDED) {
        return <ApiLimitExceededErrorScreen />;
      }

      return <FailedBackendErrorScreen />;
    }

    if (status.isLoaded && !status.isConfigurationValid && !showSettings) {
      return hasMultipleKbCredentials
        ? <UserNotAssignedToKbErrorScreen />
        : <InvalidBackendErrorScreen />;
    }

    return children;
  }
}

export default ApplicationRoute;
