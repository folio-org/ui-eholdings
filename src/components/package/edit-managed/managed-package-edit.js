import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { intlShape, injectIntl, FormattedMessage } from 'react-intl';

import {
  Icon,
  Modal,
  ModalFooter,
  RadioButton,
  RadioButtonGroup
} from '@folio/stripes-components';
import { processErrors } from '../../utilities';

import DetailsView from '../../details-view';
import CoverageFields, { validate as validateCoverageDates } from '../_fields/custom-coverage';
import DetailsViewSection from '../../details-view-section';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import PaneHeaderButton from '../../pane-header-button';
import SelectionStatus from '../selection-status';
import ProxySelectField from '../../proxy-select';
import TokenField, { validate as validateToken } from '../../token';
import styles from './managed-package-edit.css';

class ManagedPackageEdit extends Component {
  static propTypes = {
    change: PropTypes.func,
    model: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    intl: intlShape.isRequired,
    addPackageToHoldings: PropTypes.func.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    provider: PropTypes.object.isRequired,
    hasFullViewLink: PropTypes.bool
  };

  state = {
    showSelectionModal: false,
    allowFormToSubmit: false,
    packageSelected: this.props.initialValues.isSelected,
    formValues: {},
    // these are used in getDerivedStateFromProps
    packageVisible: this.props.initialValues.isVisible, // eslint-disable-line react/no-unused-state
    initialValues: this.props.initialValues // eslint-disable-line react/no-unused-state
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.model.update.errors.length) {
      return { showSelectionModal: false };
    }

    if (nextProps.initialValues.isSelected !== prevState.initialValues.isSelected) {
      return {
        ...prevState,
        initialValues: {
          ...prevState.initialValues,
          isSelected: nextProps.initialValues.isSelected
        },
        packageSelected: nextProps.initialValues.isSelected
      };
    }
    return prevState;
  }

  handleSelectionAction = () => {
    this.setState({
      packageSelected: true,
      formValues: {
        allowKbToAddTitles: true,
        isSelected: true
      }
    }, () => this.handleOnSubmit(this.state.formValues));
  }

  handleDeselectionAction = () => {
    this.setState({
      formValues: {
        isSelected: false
      }
    }, () => this.handleOnSubmit(this.state.formValues));
  }

  commitSelectionToggle = () => {
    this.setState({
      allowFormToSubmit: true
    }, () => { this.handleOnSubmit(this.state.formValues); });
  };

  cancelSelectionToggle = () => {
    this.setState({
      showSelectionModal: false,
      packageSelected: true,
    }, () => {
      this.props.change('isSelected', true);
    });
  };

  handleOnSubmit = (values) => {
    if (this.state.allowFormToSubmit === false && values.isSelected === false) {
      this.setState({
        showSelectionModal: true,
        formValues: values
      });
    } else {
      this.setState({
        allowFormToSubmit: false,
        formValues: {}
      }, () => {
        this.props.onSubmit(values);
      });
    }
  }

  render() {
    let {
      model,
      initialValues,
      handleSubmit,
      pristine,
      proxyTypes,
      provider,
      intl,
      onCancel,
      hasFullViewLink
    } = this.props;

    let {
      showSelectionModal,
      packageSelected
    } = this.state;

    let visibilityMessage = model.visibilityData.reason && `(${model.visibilityData.reason})`;

    let supportsProviderTokens = provider && provider.isLoaded && provider.providerToken && provider.providerToken.prompt;
    let supportsPackageTokens = model && model.isLoaded && model.packageToken && model.packageToken.prompt;
    let hasProviderTokenValue = provider && provider.isLoaded && provider.providerToken && provider.providerToken.value;
    let hasPackageTokenValue = model && model.isLoaded && model.packageToken && model.packageToken.value;

    let actionMenuItems = [
      {
        'label': <FormattedMessage id="ui-eholdings.actionMenu.cancelEditing" />,
        'onClick': onCancel,
        'data-test-eholdings-package-cancel-action': true
      }
    ];

    if (hasFullViewLink) {
      actionMenuItems.push({
        label: <FormattedMessage id="ui-eholdings.actionMenu.fullView" />,
        to: {
          pathname: `/eholdings/packages/${model.id}/edit`,
          state: { eholdings: true }
        },
        className: styles['full-view-link']
      });
    }

    if (packageSelected) {
      actionMenuItems.push({
        'label': intl.formatMessage({ id: 'ui-eholdings.package.removeFromHoldings' }),
        'state': { eholdings: true },
        'data-test-eholdings-package-remove-from-holdings-action': true,
        'onClick': this.handleDeselectionAction
      });
    }

    if (!packageSelected || model.isPartiallySelected) {
      let messageId = model.isPartiallySelected ? 'addAllToHoldings' : 'addToHoldings';
      actionMenuItems.push({
        'label': intl.formatMessage({ id: `ui-eholdings.${messageId}` }),
        'state': { eholdings: true },
        'data-test-eholdings-package-add-to-holdings-action': true,
        'onClick': this.props.addPackageToHoldings
      });
    }

    return (
      <div>
        <Toaster toasts={processErrors(model)} position="bottom" />
        <form onSubmit={handleSubmit(this.handleOnSubmit)}>
          <DetailsView
            type="package"
            model={model}
            paneTitle={model.name}
            actionMenuItems={actionMenuItems}
            lastMenu={(
              <Fragment>
                {model.update.isPending && (
                  <Icon icon="spinner-ellipsis" />
                )}
                {model.isSelected && (
                  <PaneHeaderButton
                    disabled={pristine || model.update.isPending}
                    type="submit"
                    buttonStyle="primary"
                    data-test-eholdings-package-save-button
                  >
                    {model.update.isPending ?
                      (<FormattedMessage id="ui-eholdings.saving" />)
                      :
                      (<FormattedMessage id="ui-eholdings.save" />)}
                  </PaneHeaderButton>
                )}
              </Fragment>
            )}
            bodyContent={(
              <Fragment>
                <DetailsViewSection
                  label={intl.formatMessage({ id: 'ui-eholdings.label.holdingStatus' })}
                >
                  <SelectionStatus
                    model={model}
                    onAddToHoldings={this.props.addPackageToHoldings}
                  />
                </DetailsViewSection>
                {packageSelected && (
                  <div>
                    <DetailsViewSection label={intl.formatMessage({ id: 'ui-eholdings.package.packageSettings' })}>
                      <div className={styles['visibility-radios']}>
                        {this.props.initialValues.isVisible != null ? (
                          <Fragment>
                            <div data-test-eholdings-package-visibility-field>
                              <Field
                                label={intl.formatMessage({ id: 'ui-eholdings.package.visibility' })}
                                name="isVisible"
                                component={RadioButtonGroup}
                              >
                                <RadioButton label={intl.formatMessage({ id: 'ui-eholdings.yes' })} value="true" />
                                <RadioButton
                                  label={intl.formatMessage(
                                    { id: 'ui-eholdings.package.visibility.no' },
                                    { visibilityMessage }
                                  )}
                                  value="false"
                                />
                              </Field>
                            </div>
                          </Fragment>
                        ) : (
                          <div
                            data-test-eholdings-package-details-visibility
                            htmlFor="managed-package-details-visibility-switch"
                          >
                            <Icon icon="spinner-ellipsis" />
                          </div>
                        )}
                      </div>
                      <div className={styles['title-management-radios']}>
                        {this.props.initialValues.allowKbToAddTitles != null ? (
                          <Fragment>
                            <Field
                              label={intl.formatMessage({ id: 'ui-eholdings.package.packageAllowToAddTitles' })}
                              name="allowKbToAddTitles"
                              data-test-eholdings-allow-kb-to-add-titles-radios
                              component={RadioButtonGroup}
                            >
                              <RadioButton
                                label={intl.formatMessage({ id: 'ui-eholdings.yes' })}
                                value="true"
                                data-test-eholdings-allow-kb-to-add-titles-radio-yes
                              />
                              <RadioButton
                                label={intl.formatMessage({ id: 'ui-eholdings.no' })}
                                value="false"
                                data-test-eholdings-allow-kb-to-add-titles-radio-no
                              />
                            </Field>
                          </Fragment>
                        ) : (
                          <div
                            data-test-eholdings-package-details-allow-add-new-titles
                            htmlFor="managed-package-details-toggle-allow-add-new-titles-switch"
                          >
                            <Icon icon="spinner-ellipsis" />
                          </div>
                        )}
                      </div>
                      {(proxyTypes.request.isResolved && provider.data.isLoaded) ? (
                        <div data-test-eholdings-package-proxy-select-field>
                          <ProxySelectField
                            proxyTypes={proxyTypes}
                            inheritedProxyId={provider.proxy.id}
                          />
                        </div>
                      ) : (
                        <Icon icon="spinner-ellipsis" />
                      )}
                      {supportsProviderTokens && (
                        <fieldset>
                          <legend>
                            <FormattedMessage id="ui-eholdings.provider.token" />
                          </legend>
                          <TokenField token={provider.providerToken} tokenValue={hasProviderTokenValue} type="provider" />
                        </fieldset>
                      )}
                      {supportsPackageTokens && (
                        <fieldset>
                          <legend>
                            <FormattedMessage id="ui-eholdings.package.token" />
                          </legend>
                          <TokenField token={model.packageToken} tokenValue={hasPackageTokenValue} type="package" />
                        </fieldset>
                      )}
                    </DetailsViewSection>
                    <DetailsViewSection
                      label={intl.formatMessage({ id: 'ui-eholdings.package.coverageSettings' })}
                    >
                      <CoverageFields
                        initialValue={initialValues.customCoverages}
                      />
                    </DetailsViewSection>
                  </div>
                )}
                <NavigationModal
                  modalLabel={intl.formatMessage({ id: 'ui-eholdings.navModal.modalLabel' })}
                  continueLabel={intl.formatMessage({ id: 'ui-eholdings.navModal.continueLabel' })}
                  dismissLabel={intl.formatMessage({ id: 'ui-eholdings.navModal.dismissLabel' })}
                  when={!pristine && !model.update.isPending}
                />
              </Fragment>
            )}
          />
        </form>
        <Modal
          open={showSelectionModal}
          size="small"
          label={intl.formatMessage({ id: 'ui-eholdings.package.modal.header' })}
          id="eholdings-package-confirmation-modal"
          footer={(
            <ModalFooter
              primaryButton={{
                'label': model.update.isPending ?
                  intl.formatMessage({ id: 'ui-eholdings.package.modal.buttonWorking' }) :
                  intl.formatMessage({ id: 'ui-eholdings.package.modal.buttonConfirm' }),
                'onClick': this.commitSelectionToggle,
                'disabled': model.update.isPending,
                'data-test-eholdings-package-deselection-confirmation-modal-yes': true
              }}
              secondaryButton={{
                'label': intl.formatMessage({ id: 'ui-eholdings.package.modal.buttonCancel' }),
                'onClick': this.cancelSelectionToggle,
                'data-test-eholdings-package-deselection-confirmation-modal-no': true
              }}
            />
          )}
        >
          <FormattedMessage id="ui-eholdings.package.modal.body" />
        </Modal>
      </div>
    );
  }
}

const validate = (values, props) => {
  return Object.assign({}, validateCoverageDates(values, props), validateToken(values, props));
};

export default injectIntl(reduxForm({
  validate,
  enableReinitialize: true,
  form: 'ManagedPackageEdit',
  destroyOnUnmount: false,
})(ManagedPackageEdit));
