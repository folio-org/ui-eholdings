import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import {
  Icon
} from '@folio/stripes-components';
import SettingsDetailPane from '../settings-detail-pane';
import styles from './settings-root-proxy.css';
import RootProxySelectField from './_fields/root-proxy-select';

class SettingsRootProxy extends Component {
  static propTypes = {
    proxyTypes: PropTypes.object.isRequired
  };

  render() {
    let {
      proxyTypes
    } = this.props;

    return (
      <SettingsDetailPane
        paneTitle="Root proxy"
      >
        <h3>Root Proxy Setting</h3>

        {proxyTypes.isLoading ? (
          <Icon icon="spinner-ellipsis" />
        ) : (
          <form
            data-test-eholdings-settings-root-proxy
            className={styles['settings-root-proxy-form']}
          >
            <div
              data-test-eholdings-settings-root-proxy-select
              className={styles['settings-root-proxy-form']}
            >
              <RootProxySelectField proxyTypes={proxyTypes} />
            </div>
          </form>
        )}

        <p>EBSCO KB API customers: Please access EBSCOAdmin to setup and maintain proxies.</p>

        <p>Warning: Changing the root proxy setting will override the proxy for all links and resources currently set to inherit the root proxy selection.</p>
      </SettingsDetailPane>
    );
  }
}

export default reduxForm({
  enableReinitialize: true,
  form: 'SettingsRootProxy',
  destroyOnUnmount: false,
})(SettingsRootProxy);
