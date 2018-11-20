import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
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
import FullViewLink from '../../full-view-link';

class ProviderEdit extends Component {
  static propTypes = {
    fullViewLink: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    handleSubmit: PropTypes.func,
    model: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    proxyTypes: PropTypes.object.isRequired,
    rootProxy: PropTypes.object.isRequired
  };

  getActionMenu = ({ onToggle }) => {
    const {
      fullViewLink,
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

        {fullViewLink && (
          <FullViewLink to={fullViewLink} />
        )}
      </Fragment>
    );
  }

  render() {
    let {
      model,
      proxyTypes,
      rootProxy,
      handleSubmit,
      onSubmit,
      pristine,
    } = this.props;

    let supportsTokens = model.providerToken && model.providerToken.prompt;
    let hasTokenValue = model.providerToken && model.providerToken.value;

    return (
      <Fragment>
        <Toaster toasts={processErrors(model)} position="bottom" />
        <form onSubmit={handleSubmit(onSubmit)}>
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
                <NavigationModal
                  modalLabel={<FormattedMessage id="ui-eholdings.navModal.modalLabel" />}
                  continueLabel={<FormattedMessage id="ui-eholdings.navModal.continueLabel" />}
                  dismissLabel={<FormattedMessage id="ui-eholdings.navModal.dismissLabel" />}
                  when={!pristine && !model.update.isPending}
                />
              </Fragment>
            )}
          />
        </form>
      </Fragment>
    );
  }
}

export default reduxForm({
  enableReinitialize: true,
  form: 'ProviderEdit',
  destroyOnUnmount: false,
})(ProviderEdit);
