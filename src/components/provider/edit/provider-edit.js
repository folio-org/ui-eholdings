import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import createFocusDecorator from 'final-form-focus';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Headline,
  PaneFooter,
  Icon,
} from '@folio/stripes/components';

import { processErrors } from '../../utilities';
import DetailsView from '../../details-view';
import DetailsViewSection from '../../details-view-section';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import ProxySelectField from '../../proxy-select';
import TokenField from '../../token';

const focusOnErrors = createFocusDecorator();

export default class ProviderEdit extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    rootProxy: PropTypes.object.isRequired
  };

  getFooter = (pristine, reset) => {
    const { model } = this.props;

    const cancelButton = (
      <Button
        data-test-eholdings-provider-edit-cancel-button
        buttonStyle="default mega"
        disabled={model.update.isPending || pristine}
        onClick={reset}
        marginBottom0
      >
        <FormattedMessage id="stripes-components.cancel" />
      </Button>
    );

    const saveButton = (
      <Button
        buttonStyle="primary mega"
        data-test-eholdings-provider-save-button
        disabled={model.update.isPending || pristine}
        marginBottom0
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
      model,
      proxyTypes,
      rootProxy,
      onSubmit,
      onCancel,
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
        render={({ handleSubmit, pristine, form: { reset } }) => (
          <>
            <Toaster toasts={processErrors(model)} position="bottom" />
            <form onSubmit={handleSubmit}>
              <DetailsView
                type="provider"
                model={model}
                key={model.id}
                paneTitle={model.name}
                footer={this.getFooter(pristine, reset)}
                bodyContent={(
                  <>
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
                  </>
                )}
                onCancel={onCancel}
              />
            </form>
            <NavigationModal when={!pristine && !model.update.isPending && !model.update.isResolved} />
          </>
        )}
      />
    );
  }
}
