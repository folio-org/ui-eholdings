import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { Icon } from '@folio/stripes-components';
import { intlShape, injectIntl, FormattedMessage } from 'react-intl';

import SettingsDetailPane from '../settings-detail-pane';
import { processErrors } from '../utilities';
import Toaster from '../toaster';
import RootProxySelectField from './_fields/root-proxy-select';
import PaneHeaderButton from '../pane-header-button';
import styles from './settings-root-proxy.css';

class SettingsRootProxy extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    intl: intlShape.isRequired,
    invalid: PropTypes.bool,
    isFreshlySaved: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    proxyTypes: PropTypes.object.isRequired,
    reset: PropTypes.func,
    rootProxy: PropTypes.object.isRequired
  };

  render() {
    let {
      rootProxy,
      proxyTypes,
      handleSubmit,
      onSubmit,
      pristine,
      reset,
      intl,
      invalid,
      isFreshlySaved
    } = this.props;
    let toasts = processErrors(rootProxy);

    if (isFreshlySaved) {
      toasts.push({
        id: `root-proxy-${rootProxy.update.timestamp}`,
        message: <FormattedMessage id="ui-eholdings.settings.rootProxy.updated" />,
        type: 'success'
      });
    }

    let actionMenuItems = [
      {
        'label': intl.formatMessage({ id: 'ui-eholdings.actionMenu.cancelEditing' }),
        'state': { eholdings: true },
        'onClick': reset,
        'disabled': rootProxy.update.isPending || invalid || pristine,
        'data-test-eholdings-settings-root-proxy-cancel-action': true
      }
    ];

    return (
      <form
        data-test-eholdings-settings-root-proxy
        onSubmit={handleSubmit(onSubmit)}
        className={styles['settings-root-proxy-form']}
      >
        <SettingsDetailPane
          paneTitle={intl.formatMessage({ id: 'ui-eholdings.settings.rootProxy' })}
          actionMenuItems={actionMenuItems}
          lastMenu={(
            <Fragment>
              {rootProxy.update.isPending && (
                <Icon icon="spinner-ellipsis" />
              )}
              <PaneHeaderButton
                disabled={rootProxy.update.isPending || invalid || pristine}
                type="submit"
                buttonStyle="primary"
                data-test-eholdings-settings-root-proxy-save-button
              >
                {rootProxy.update.isPending ?
                  (<FormattedMessage id="ui-eholdings.saving" />)
                  :
                  (<FormattedMessage id="ui-eholdings.save" />)}
              </PaneHeaderButton>
            </Fragment>
          )}
        >
          <Toaster toasts={toasts} position="bottom" />
          <h3><FormattedMessage id="ui-eholdings.settings.rootProxy.setting" /></h3>

          {proxyTypes.isLoading ? (
            <Icon icon="spinner-ellipsis" />
          ) : (
            <div data-test-eholdings-settings-root-proxy-select>
              <RootProxySelectField proxyTypes={proxyTypes} />
            </div>
          )}

          <p><FormattedMessage id="ui-eholdings.settings.rootProxy.ebsco.customer.message" /></p>

          <p>
            <FormattedMessage id="ui-eholdings.settings.rootProxy.warning" />
          </p>
        </SettingsDetailPane>
      </form>
    );
  }
}

export default injectIntl(reduxForm({
  enableReinitialize: true,
  form: 'SettingsRootProxy',
  destroyOnUnmount: false,
})(SettingsRootProxy));
