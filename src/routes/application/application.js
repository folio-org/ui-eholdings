import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from '@folio/stripes-components/lib/Icon';

import { createResolver } from '../../redux';
import { Status } from '../../redux/application';
import NoBackendErrorScreen from '../../components/error-screen/no-backend';
import FailedBackendErrorScreen from '../../components/error-screen/failed-backend';
import InvalidBackendErrorScreen from '../../components/error-screen/invalid-backend';
import styles from './application.css';

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
      <div className={styles['eholdings-application']} data-test-eholdings-application>
        {version ? (status.isLoading ? (
          <Icon icon="spinner-ellipsis" />
        ) : status.request.isRejected ? (
          <FailedBackendErrorScreen />
        ) : status.isLoaded && (
          !(showSettings || status.isConfigurationValid)
            ? <InvalidBackendErrorScreen />
            : children
        )) : <NoBackendErrorScreen />}
      </div>
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
