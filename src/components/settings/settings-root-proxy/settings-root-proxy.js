import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import createFocusDecorator from 'final-form-focus';
import {
  Button,
  Headline,
  Icon,
  PaneFooter,
} from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

import SettingsDetailPane from '../settings-detail-pane';
import { processErrors } from '../../utilities';
import Toaster from '../../toaster';
import RootProxySelectField from './_fields/root-proxy-select';

const focusOnErrors = createFocusDecorator();

export default class SettingsRootProxy extends Component {
  static propTypes = {
    isFreshlySaved: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    rootProxy: PropTypes.object.isRequired
  };

  renderPaneFooter({ handleSubmit, invalid, pristine, reset }) {
    const {
      rootProxy,
    } = this.props;

    const cancelButton = (
      <Button
        data-test-eholdings-settings-root-proxy-cancel-button
        buttonStyle="default mega"
        disabled={rootProxy.update.isPending || pristine}
        onClick={reset}
        marginBottom0
      >
        <FormattedMessage id="stripes-components.cancel" />
      </Button>
    );

    const saveButton = (
      <Button
        buttonStyle="primary mega"
        data-test-eholdings-settings-root-proxy-save-button
        disabled={rootProxy.update.isPending || invalid || pristine}
        marginBottom0
        onClick={handleSubmit}
        type="submit"
      >
        <FormattedMessage id="stripes-components.saveAndClose" />
      </Button>
    );

    return (
      <PaneFooter
        renderStart={cancelButton}
        renderEnd={saveButton}
      />
    );
  }

  render() {
    const {
      rootProxy,
      proxyTypes,
      onSubmit,
      isFreshlySaved
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
        render={({ form: { reset }, handleSubmit, invalid, pristine }) => (
          <SettingsDetailPane
            data-test-eholdings-settings-root-proxy
            id="root-proxy-form"
            onSubmit={handleSubmit}
            tagName="form"
            paneTitle={<FormattedMessage id="ui-eholdings.settings.rootProxy" />}
            footer={this.renderPaneFooter({ handleSubmit, invalid, pristine, reset })}
          >
            <Toaster toasts={toasts} position="bottom" />

            <Headline size="xx-large" tag="h3">
              <FormattedMessage id="ui-eholdings.settings.rootProxy.setting" />
            </Headline>

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
        )}
      />
    );
  }
}
