import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Field,
  Form
} from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import createFocusDecorator from 'final-form-focus';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Button,
  Headline,
  Icon,
  Modal,
  ModalFooter,
  RadioButton,
} from '@folio/stripes/components';

import { processErrors } from '../../utilities';

import DetailsView from '../../details-view';
import CoverageFields from '../_fields/custom-coverage';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import PaneHeaderButton from '../../pane-header-button';
import SelectionStatus from '../selection-status';
import ProxySelectField from '../../proxy-select';
import TokenField from '../../token';
import styles from './managed-package-edit.css';

const focusOnErrors = createFocusDecorator();

export default class ManagedPackageEdit extends Component {
  static propTypes = {
    addPackageToHoldings: PropTypes.func.isRequired,
    model: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onFullView: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    provider: PropTypes.object.isRequired,
    proxyTypes: PropTypes.object.isRequired
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let stateUpdates = {};
    const { initialValues } = prevState;
    const {
      model: {
        isSelected,
        update,
      },
      provider: { providerToken },
    } = nextProps;

    const providerTokenWasLoaded = !initialValues.providerTokenValue && providerToken.value;
    const selectionStatusChanged = isSelected !== initialValues.isSelected;

    if (selectionStatusChanged || providerTokenWasLoaded) {
      stateUpdates = {
        initialValues: ManagedPackageEdit.getInitialValues(nextProps.model, nextProps.provider),
        packageSelected: isSelected
      };
    }

    if (update.errors.length) {
      stateUpdates.showSelectionModal = false;
    }

    return stateUpdates;
  }

  static getInitialValues(model, { providerToken }) {
    const {
      isSelected,
      customCoverage,
      proxy,
      packageToken,
      visibilityData,
      allowKbToAddTitles,

    } = model;

    return {
      isSelected,
      customCoverages: [{
        ...customCoverage,
      }],
      proxyId: proxy.id,
      providerTokenValue: providerToken.value,
      packageTokenValue: packageToken.value,
      isVisible: !visibilityData.isHidden,
      allowKbToAddTitles,
    };
  }

  state = {
    showSelectionModal: false,
    allowFormToSubmit: false,
    packageSelected: this.props.model.isSelected,
    formValues: {},
    initialValues: ManagedPackageEdit.getInitialValues(this.props.model, this.props.provider),
    sections: {
      packageHoldingStatus: true,
      packageSettings: true,
      packageCoverageSettings: true,
    }
  };

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
  };

  commitSelectionToggle = () => {
    this.setState({
      allowFormToSubmit: true
    }, () => { this.handleOnSubmit(this.state.formValues); });
  };

  cancelSelectionToggle = (change) => {
    this.setState({
      showSelectionModal: false,
      packageSelected: true,
    }, () => {
      change('isSelected', true);
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
  };

  toggleSection = ({ id: sectionId }) => {
    this.setState((prevState) => {
      const { sections } = prevState;
      const sectionIsExpanded = sections[sectionId];
      return {
        sections: {
          ...sections,
          [sectionId]: !sectionIsExpanded
        }
      };
    });
  };

  toggleAllSections = (sections) => {
    this.setState({ sections });
  };

  getSectionHeader(translationKey) {
    return (
      <Headline
        size="large"
        tag="h3"
      >
        <FormattedMessage id={translationKey} />
      </Headline>
    );
  }

  getActionMenu = ({ onToggle }) => {
    const {
      addPackageToHoldings,
      onFullView,
      model,
      onCancel
    } = this.props;

    const { packageSelected } = this.state;

    return (
      <Fragment>
        <Button
          data-test-eholdings-package-cancel-action
          buttonStyle="dropdownItem fullWidth"
          onClick={() => {
            onToggle();
            onCancel();
          }}
          disabled={model.update.isPending}
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

        {packageSelected && (
          <Button
            data-test-eholdings-package-remove-from-holdings-action
            buttonStyle="dropdownItem fullWidth"
            onClick={() => {
              onToggle();
              this.handleDeselectionAction();
            }}
          >
            <FormattedMessage id="ui-eholdings.package.removeFromHoldings" />
          </Button>
        )}

        {(!packageSelected || model.isPartiallySelected) && (
          <Button
            data-test-eholdings-package-add-to-holdings-action
            buttonStyle="dropdownItem fullWidth"
            onClick={() => {
              onToggle();
              addPackageToHoldings();
            }}
          >
            <FormattedMessage
              id={`ui-eholdings.${(model.isPartiallySelected ? 'addAllToHoldings' : 'addToHoldings')}`}
            />
          </Button>
        )}
      </Fragment>
    );
  }

  render() {
    let {
      model,
      proxyTypes,
      provider
    } = this.props;

    let {
      initialValues,
      showSelectionModal,
      packageSelected,
      sections
    } = this.state;

    let visibilityMessage = model.visibilityData.reason && `(${model.visibilityData.reason})`;

    let supportsProviderTokens = provider && provider.isLoaded && provider.providerToken && provider.providerToken.prompt;
    let supportsPackageTokens = model && model.isLoaded && model.packageToken && model.packageToken.prompt;
    let hasProviderTokenValue = provider && provider.isLoaded && provider.providerToken && provider.providerToken.value;
    let hasPackageTokenValue = model && model.isLoaded && model.packageToken && model.packageToken.value;

    return (
      <Form
        onSubmit={this.handleOnSubmit}
        decorators={[focusOnErrors]}
        mutators={{ ...arrayMutators }}
        initialValues={initialValues}
        render={({ handleSubmit, pristine, form: { change } }) => (
          <div>
            <Toaster toasts={processErrors(model)} position="bottom" />
            <form onSubmit={handleSubmit}>
              <DetailsView
                type="package"
                model={model}
                paneTitle={model.name}
                actionMenu={this.getActionMenu}
                handleExpandAll={this.toggleAllSections}
                sections={sections}
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
                    <Accordion
                      label={this.getSectionHeader('ui-eholdings.label.holdingStatus')}
                      open={sections.packageHoldingStatus}
                      id="packageHoldingStatus"
                      onToggle={this.toggleSection}
                    >
                      <SelectionStatus
                        model={model}
                        onAddToHoldings={this.props.addPackageToHoldings}
                      />
                    </Accordion>

                    {packageSelected && (
                      <div>
                        <Accordion
                          label={this.getSectionHeader('ui-eholdings.package.packageSettings')}
                          open={sections.packageSettings}
                          id="packageSettings"
                          onToggle={this.toggleSection}
                        >
                          <div className={styles['visibility-radios']}>
                            {initialValues.isVisible !== null ? (
                              <fieldset data-test-eholdings-package-visibility-field>
                                <Headline tag="legend" size="small" margin="x-large">
                                  <FormattedMessage id="ui-eholdings.package.visibility" />
                                </Headline>

                                <Field
                                  component={RadioButton}
                                  format={value => typeof value !== 'undefined' && value !== null && value.toString()}
                                  label={<FormattedMessage id="ui-eholdings.yes" />}
                                  name="isVisible"
                                  parse={value => value === 'true'}
                                  type="radio"
                                  value="true"
                                />

                                <Field
                                  component={RadioButton}
                                  format={value => typeof value !== 'undefined' && value !== null && value.toString()}
                                  label={
                                    <FormattedMessage
                                      id="ui-eholdings.package.visibility.no"
                                      values={{ visibilityMessage }}
                                    />
                                  }
                                  name="isVisible"
                                  parse={value => value === 'true'}
                                  type="radio"
                                  value="false"
                                />
                              </fieldset>
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
                            {initialValues.allowKbToAddTitles !== null ? (
                              <fieldset data-test-eholdings-allow-kb-to-add-titles-radios>
                                <Headline tag="legend" size="small" margin="x-large">
                                  <FormattedMessage id="ui-eholdings.package.packageAllowToAddTitles" />
                                </Headline>

                                <Field
                                  data-test-eholdings-allow-kb-to-add-titles-radio-yes
                                  component={RadioButton}
                                  format={value => typeof value !== 'undefined' && value !== null && value.toString()}
                                  label={<FormattedMessage id="ui-eholdings.yes" />}
                                  name="allowKbToAddTitles"
                                  parse={value => value === 'true'}
                                  type="radio"
                                  value="true"
                                />

                                <Field
                                  data-test-eholdings-allow-kb-to-add-titles-radio-no
                                  component={RadioButton}
                                  format={value => typeof value !== 'undefined' && value !== null && value.toString()}
                                  label={<FormattedMessage id="ui-eholdings.no" />}
                                  name="allowKbToAddTitles"
                                  parse={value => value === 'true'}
                                  type="radio"
                                  value="false"
                                />
                              </fieldset>
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
                            <Headline tag="legend">
                              <FormattedMessage id="ui-eholdings.provider.token" />
                            </Headline>
                            <TokenField token={provider.providerToken} tokenValue={hasProviderTokenValue} type="provider" />
                          </fieldset>
                          )}
                          {supportsPackageTokens && (
                          <fieldset>
                            <Headline tag="legend">
                              <FormattedMessage id="ui-eholdings.package.token" />
                            </Headline>
                            <TokenField token={model.packageToken} tokenValue={hasPackageTokenValue} type="package" />
                          </fieldset>
                          )}
                        </Accordion>

                        <Accordion
                          label={this.getSectionHeader('ui-eholdings.package.coverageSettings')}
                          open={sections.packageCoverageSettings}
                          id="packageCoverageSettings"
                          onToggle={this.toggleSection}
                        >
                          <CoverageFields initial={initialValues.customCoverages} />
                        </Accordion>
                      </div>
                    )}
                  </Fragment>
                )}
              />
            </form>

            <NavigationModal when={!pristine && !model.update.isPending && !model.update.isResolved} />

            <Modal
              open={showSelectionModal}
              size="small"
              label={<FormattedMessage id="ui-eholdings.package.modal.header" />}
              id="eholdings-package-confirmation-modal"
              footer={(
                <ModalFooter>
                  <Button
                    data-test-eholdings-package-deselection-confirmation-modal-yes
                    buttonStyle="primary"
                    disabled={model.update.isPending}
                    onClick={this.commitSelectionToggle}
                  >
                    {(model.update.isPending ?
                      <FormattedMessage id="ui-eholdings.package.modal.buttonWorking" /> :
                      <FormattedMessage id="ui-eholdings.package.modal.buttonConfirm" />)}
                  </Button>
                  <Button
                    data-test-eholdings-package-deselection-confirmation-modal-no
                    onClick={() => this.cancelSelectionToggle(change)}
                  >
                    <FormattedMessage id="ui-eholdings.package.modal.buttonCancel" />
                  </Button>
                </ModalFooter>
              )}
            >
              <FormattedMessage id="ui-eholdings.package.modal.body" />
            </Modal>
          </div>
        )}
      />
    );
  }
}
