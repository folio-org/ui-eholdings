import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon } from '@folio/stripes/components';

import { createResolver } from '../redux';
import { Status } from '../redux/application';
import NoBackendErrorScreen from '../components/error-screen/no-backend-error-screen';
import FailedBackendErrorScreen from '../components/error-screen/failed-backend-error-screen';
import InvalidBackendErrorScreen from '../components/error-screen/invalid-backend-error-screen';

class ApplicationRoute extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    getBackendStatus: PropTypes.func.isRequired,
    interfaces: PropTypes.object,
    showSettings: PropTypes.bool,
    status: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    props.getBackendStatus();
  }

  render() {
    const {
      status,
      interfaces: { eholdings: version },
      showSettings,
      children
    } = this.props;

    return (
      version ? (status.isLoading ? (
        <Icon icon="spinner-ellipsis" />
      ) : status.request.isRejected ? (
        <FailedBackendErrorScreen />
      ) : status.isLoaded && (
        !(showSettings || status.isConfigurationValid)
          ? <InvalidBackendErrorScreen />
          : children
      )) : <NoBackendErrorScreen />
    );
  }
}

export default connect(
  ({
    eholdings: { data },
    discovery: { interfaces = {} }
  }) => ({
    status: createResolver(data).find('statuses', 'status'),
    interfaces
  }), {
    getBackendStatus: () => Status.find('status')
  }
)(ApplicationRoute);
