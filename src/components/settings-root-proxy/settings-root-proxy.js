import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import createFocusDecorator from 'final-form-focus';
import {
  Button,
  Headline,
  Icon
} from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

import SettingsDetailPane from '../settings-detail-pane';
import { processErrors } from '../utilities';
import Toaster from '../toaster';
import RootProxySelectField from './_fields/root-proxy-select';
import PaneHeaderButton from '../pane-header-button';

const focusOnErrors = createFocusDecorator();

export default class SettingsRootProxy extends Component {
  static propTypes = {
    isFreshlySaved: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    rootProxy: PropTypes.object.isRequired
  };

  render() {
    let {
      rootProxy,
      proxyTypes,
      onSubmit,
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
            onSubmit={handleSubmit}
            tagName="form"
            paneTitle={<FormattedMessage id="ui-eholdings.settings.rootProxy" />}
            actionMenu={() => (
              <Button
                data-test-eholdings-settings-root-proxy-cancel-action
                buttonStyle="dropdownItem fullWidth"
                disabled={rootProxy.update.isPending || pristine}
                onClick={reset}
              >
                <FormattedMessage id="ui-eholdings.actionMenu.cancelEditing" />
              </Button>
            )}
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
