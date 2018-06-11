import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import {
  Icon,
  Button
} from '@folio/stripes-components';
import isEqual from 'lodash/isEqual';

import SettingsDetailPane from '../settings-detail-pane';
import { processErrors } from '../utilities';
import Toaster from '../toaster';
import styles from './settings-root-proxy.css';
import RootProxySelectField from './_fields/root-proxy-select';

class SettingsRootProxy extends Component {
  static propTypes = {
    proxyTypes: PropTypes.object.isRequired,
    rootProxy: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    reset: PropTypes.func
  };

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };

  componentWillReceiveProps(nextProps) {
    let wasPending = this.props.rootProxy.update.isPending && !nextProps.rootProxy.update.isPending;
    let needsUpdate = !isEqual(this.props.rootProxy, nextProps.rootProxy);
    let isRejected = nextProps.rootProxy.update.isRejected;

    let { router } = this.context;

    if (wasPending && needsUpdate && !isRejected) {
      router.history.push({
        pathname: '/settings/eholdings/root-proxy',
        state: { eholdings: true, isFreshlySaved: true }
      });
    }
  }

  render() {
    let {
      rootProxy,
      proxyTypes,
      handleSubmit,
      onSubmit,
      pristine,
      reset
    } = this.props;

    let { router } = this.context;

    let toasts = processErrors(rootProxy);

    if (router.history.action === 'PUSH' &&
        router.history.location.state &&
        router.history.location.state.isFreshlySaved &&
        rootProxy.update.isResolved) {
      toasts.push({
        id: `root-proxy-${rootProxy.update.timestamp}`,
        message: 'Root Proxy updated',
        type: 'success'
      });
    }

    return (
      <SettingsDetailPane
        paneTitle="Root proxy"
      >
        <Toaster toasts={toasts} position="bottom" />
        <h3>Root Proxy Setting</h3>

        {proxyTypes.isLoading ? (
          <Icon icon="spinner-ellipsis" />
        ) : (
          <form
            data-test-eholdings-settings-root-proxy
            onSubmit={handleSubmit(onSubmit)}
            className={styles['settings-root-proxy-form']}
          >
            <div
              data-test-eholdings-settings-root-proxy-select
              className={styles['settings-root-proxy-form']}
            >
              <RootProxySelectField proxyTypes={proxyTypes} />
            </div>

            {!pristine && (
            <div
              className={styles['settings-root-proxy-form-actions']}
              data-test-eholdings-settings-root-proxy-actions
            >
              <div data-test-eholdings-root-proxy-cancel-button>
                <Button
                  disabled={rootProxy.update.isPending}
                  type="reset"
                  onClick={reset}
                >
                  Cancel
                </Button>
              </div>
              <div data-test-eholdings-root-proxy-save-button>
                <Button
                  disabled={rootProxy.update.isPending}
                  type="submit"
                  buttonStyle="primary"
                >
                  {rootProxy.update.isPending ? 'Saving' : 'Save'}
                </Button>
              </div>
              {rootProxy.update.isPending && (
                <Icon icon="spinner-ellipsis" />
              )}
            </div>
          )}
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
