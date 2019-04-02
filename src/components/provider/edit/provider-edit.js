import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import createFocusDecorator from 'final-form-focus';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Headline,
  Icon
} from '@folio/stripes/components';

import { processErrors } from '../../utilities';
import DetailsView from '../../details-view';
import DetailsViewSection from '../../details-view-section';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import ProxySelectField from '../../proxy-select';
import TokenField from '../../token';
import PaneHeaderButton from '../../pane-header-button';

const focusOnErrors = createFocusDecorator();

export default class ProviderEdit extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onFullView: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    rootProxy: PropTypes.object.isRequired
  };

  getActionMenu = ({ onToggle }) => {
    const {
      onFullView,
      onCancel
    } = this.props;

    return (
      <Fragment>
        <Button
          data-test-eholdings-provider-cancel-action
          buttonStyle="dropdownItem fullWidth"
          onClick={() => {
            onToggle();
            onCancel();
          }}
        >
          <FormattedMessage id="ui-eholdings.actionMenu.cancelEditing" />
        </Button>

        {onFullView && (
          <Button
            buttonStyle="dropdownItem fullWidth"
            onClick={() => {
              onToggle();
              onFullView();
            }}
          >
            <FormattedMessage id="ui-eholdings.actionMenu.fullView" />
          </Button>
        )}
      </Fragment>
    );
  }

  render() {
    const {
      model,
      proxyTypes,
      rootProxy,
      onSubmit,
    } = this.props;

    const supportsTokens = model.providerToken && model.providerToken.prompt;
    const hasTokenValue = model.providerToken && model.providerToken.value;

    return (
      <Form
        decorators={[focusOnErrors]}
        onSubmit={onSubmit}
        initialValues={{
          proxyId: model.proxy.id,
          providerTokenValue: model.providerToken.value
        }}
        render={({ handleSubmit, pristine }) => (
          <Fragment>
            <Toaster toasts={processErrors(model)} position="bottom" />
            <form onSubmit={handleSubmit}>
              <DetailsView
                type="provider"
                model={model}
                key={model.id}
                paneTitle={model.name}
                actionMenu={this.getActionMenu}
                lastMenu={(
                  <Fragment>
                    {model.update.isPending && (
                    <Icon icon="spinner-ellipsis" />
                    )}
                    <PaneHeaderButton
                      disabled={pristine || model.update.isPending}
                      type="submit"
                      buttonStyle="primary"
                      data-test-eholdings-provider-save-button
                    >
                      {model.update.isPending ?
                        (<FormattedMessage id="ui-eholdings.saving" />)
                        :
                        (<FormattedMessage id="ui-eholdings.save" />)}
                    </PaneHeaderButton>
                  </Fragment>
              )}
                bodyContent={(
                  <Fragment>
                    <DetailsViewSection
                      label={<FormattedMessage id="ui-eholdings.provider.providerSettings" />}
                    >
                      {model.packagesSelected > 0 ? (
                        <div>
                          {(!proxyTypes.request.isResolved || !rootProxy.request.isResolved) ? (
                            <Icon icon="spinner-ellipsis" />
                          ) : (
                            <div data-test-eholdings-provider-proxy-select>
                              <ProxySelectField proxyTypes={proxyTypes} inheritedProxyId={rootProxy.data.attributes.proxyTypeId} />
                            </div>
                          )}

                          {supportsTokens && (
                            <fieldset>
                              <Headline tag="legend">
                                <FormattedMessage id="ui-eholdings.provider.token" />
                              </Headline>
                              <TokenField token={model.providerToken} tokenValue={hasTokenValue} type="provider" />
                            </fieldset>
                          )}
                        </div>
                      ) : (
                        <div data-test-eholdings-provider-package-not-selected>
                          <FormattedMessage id="ui-eholdings.provider.noPackagesSelected" />
                        </div>
                      )}
                    </DetailsViewSection>
                  </Fragment>
                )}
              />
            </form>
            <NavigationModal when={!pristine && !model.update.isPending && !model.update.isResolved} />
          </Fragment>
        )}
      />
    );
  }
}
