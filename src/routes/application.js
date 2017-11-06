import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from '@folio/stripes-components/lib/Icon';

import { getBackendStatus } from '../redux/application';
import NoBackendErrorScreen from '../components/error-screen/no-backend';
import FailedBackendErrorScreen from '../components/error-screen/failed-backend';
import InvalidBackendErrorScreen from '../components/error-screen/invalid-backend';

class ApplicationRoute extends Component {
  static propTypes = {
    showSettings: PropTypes.bool,
    children: PropTypes.node.isRequired,
    interfaces: PropTypes.object,
    status: PropTypes.object.isRequired,
    getBackendStatus: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.getBackendStatus();
  }

  render() {
    let {
      status,
      interfaces: { eholdings: version },
      showSettings,
      children
    } = this.props;

    return (
      <div className="eholdings-application" data-test-eholdings-application>
        {version ? (status.isPending ? (
          <Icon icon="spinner-ellipsis" />
        ) : status.isRejected ? (
          <FailedBackendErrorScreen />
        ) : status.isResolved && (
          !(showSettings || status.content.isConfigurationValid)
            ? <InvalidBackendErrorScreen />
            : children
        )) : <NoBackendErrorScreen />}
      </div>
    );
  }
}

export default connect(
  ({
    eholdings: { application },
    discovery: { interfaces = {} }
  }) => ({
    status: application.status,
    interfaces
  }),
  { getBackendStatus }
)(ApplicationRoute);
