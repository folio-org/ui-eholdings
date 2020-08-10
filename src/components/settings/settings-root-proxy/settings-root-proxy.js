import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import createFocusDecorator from 'final-form-focus';
import { Icon } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

import SettingsForm from '../settings-form';
import RootProxySelectField from './_fields/root-proxy-select';
import { rootProxy as rootProxyShapes } from '../../../constants';

const focusOnErrors = createFocusDecorator();

export default class SettingsRootProxy extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    rootProxy: rootProxyShapes.RootProxyReduxStateShape.isRequired,
  };

  state = {
    toasts: [],
  }

  componentDidUpdate(prevProps) {
    const { rootProxy } = this.props;

    if (rootProxy.isUpdated) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(({ toasts }) => ({
        toasts: [...toasts, {
          id: `root-proxy-${rootProxy.id}`,
          message: <FormattedMessage id="ui-eholdings.settings.rootProxy.updated" />,
          type: 'success'
        }],
      }));
    }

    if (prevProps.rootProxy.errors !== rootProxy.errors) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(({ toasts }) => ({
        toasts: [...toasts, ...rootProxy.errors.map(error => ({
          id: `root-proxy-${rootProxy.id}`,
          message: error.title,
          type: 'error'
        }))],
      }));
    }
  }

  render() {
    const {
      rootProxy,
      proxyTypes,
      onSubmit,
    } = this.props;

    return (
      <Form
        onSubmit={onSubmit}
        initialValues={{
          rootProxyServer: rootProxy.data?.attributes?.proxyTypeId
        }}
        decorators={[focusOnErrors]}
        render={(formState) => (
          <SettingsForm
            data-test-eholdings-settings-root-proxy
            id="root-proxy-form"
            formState={formState}
            updateIsPending={rootProxy.isLoading}
            title={<FormattedMessage id="ui-eholdings.settings.rootProxy" />}
            toasts={this.state.toasts}
          >
            {proxyTypes.isLoading ? (
              <Icon icon="spinner-ellipsis" />
            ) : (
              <div data-test-eholdings-settings-root-proxy-select>
                <RootProxySelectField
                  proxyTypes={proxyTypes}
                  value={formState.values.rootProxyServer}
                />
              </div>
            )}

            <p><FormattedMessage id="ui-eholdings.settings.rootProxy.ebsco.customer.message" /></p>

            <p>
              <FormattedMessage id="ui-eholdings.settings.rootProxy.warning" />
            </p>
          </SettingsForm>
        )}
      />
    );
  }
}
