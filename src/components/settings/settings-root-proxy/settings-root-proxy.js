import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import createFocusDecorator from 'final-form-focus';
import {
  Headline,
  Icon,
} from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

import SettingsForm from '../settings-form';
import { processErrors } from '../../utilities';
import RootProxySelectField from './_fields/root-proxy-select';

const focusOnErrors = createFocusDecorator();

export default class SettingsRootProxy extends Component {
  static propTypes = {
    isFreshlySaved: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    rootProxy: PropTypes.object.isRequired
  };

  render() {
    const {
      rootProxy,
      proxyTypes,
      onSubmit,
      isFreshlySaved,
    } = this.props;
    const toasts = processErrors(rootProxy);

    if (isFreshlySaved) {
      toasts.push({
        id: `root-proxy-${rootProxy.update.timestamp}`,
        message: <FormattedMessage id="ui-eholdings.settings.rootProxy.updated" />,
        type: 'success'
      });
    }

    return (
      <Form
        onSubmit={onSubmit}
        initialValues={{
          rootProxyServer: rootProxy.proxyTypeId
        }}
        decorators={[focusOnErrors]}
        render={(formState) => (
          <SettingsForm
            data-test-eholdings-settings-root-proxy
            id="root-proxy-form"
            formState={formState}
            updateIsPending={rootProxy.update.isPending}
            title={<FormattedMessage id="ui-eholdings.settings.rootProxy" />}
            toasts={toasts}
          >
            <Headline size="xx-large" tag="h3">
              <FormattedMessage id="ui-eholdings.settings.rootProxy.setting" />
            </Headline>

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
