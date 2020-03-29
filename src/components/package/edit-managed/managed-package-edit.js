import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Field,
  Form
} from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import createFocusDecorator from 'final-form-focus';
import { FormattedMessage } from 'react-intl';

import { withStripes } from '@folio/stripes-core';
import {
  Accordion,
  Button,
  Headline,
  Icon,
  Modal,
  ModalFooter,
  RadioButton,
  PaneFooter,
} from '@folio/stripes/components';

import {
  processErrors,
  getAccessTypeId,
  getProxyTypesRecords,
  getProxyTypeById,
} from '../../utilities';

import DetailsView from '../../details-view';
import CoverageFields from '../_fields/custom-coverage';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import SelectionStatus from '../selection-status';
import ProxySelectField from '../../proxy-select';
import TokenField from '../../token';
import AccessTypeEditSection from '../../access-type-edit-section';

import { accessTypesReduxStateShape } from '../../../constants';

import styles from './managed-package-edit.css';

const focusOnErrors = createFocusDecorator();

class ManagedPackageEdit extends Component {
  static getInitialValues(model, { providerToken }, proxyTypes) {
    const {
      isSelected,
      customCoverage,
      proxy,
      packageToken,
      visibilityData,
      allowKbToAddTitles,
    } = model;

    const proxyTypesRecords = getProxyTypesRecords(proxyTypes);
    const matchingProxy = getProxyTypeById(proxyTypesRecords, proxy.id);

    return {
      isSelected,
      customCoverages: [{
        ...customCoverage,
      }],
      proxyId: matchingProxy?.id || proxy.id,
      providerTokenValue: providerToken.value,
      packageTokenValue: packageToken.value,
      isVisible: !visibilityData.isHidden,
      allowKbToAddTitles,
      accessTypeId: getAccessTypeId(model),
    };
  }

  static isProxyTypesLoaded(proxyTypes, provider) {
    return proxyTypes.request.isResolved && provider.data.isLoaded;
  }

  static propTypes = {
    accessStatusTypes: accessTypesReduxStateShape.isRequired,
    addPackageToHoldings: PropTypes.func.isRequired,
    model: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    provider: PropTypes.object.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
    }),
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let stateUpdates = {};
    const { initialValues, wasProxyTypesLoaded } = prevState;
    const {
      model: {
        isSelected,
        update,
      },
      provider: { providerToken },
      proxyTypes,
    } = nextProps;

    const providerTokenWasLoaded = !initialValues.providerTokenValue && providerToken.value;
    const selectionStatusChanged = isSelected !== initialValues.isSelected;
    const isProxyTypesLoaded = ManagedPackageEdit.isProxyTypesLoaded(proxyTypes, nextProps.provider);

    if (selectionStatusChanged || providerTokenWasLoaded) {
      stateUpdates = {
        initialValues: ManagedPackageEdit.getInitialValues(nextProps.model, nextProps.provider, proxyTypes),
        packageSelected: isSelected
      };
    }

    if (isProxyTypesLoaded && !wasProxyTypesLoaded) {
      stateUpdates = {
        initialValues: ManagedPackageEdit.getInitialValues(nextProps.model, nextProps.provider, proxyTypes),
        wasProxyTypesLoaded: true,
      };
    }

    if (update.errors.length) {
      stateUpdates.showSelectionModal = false;
    }

    return stateUpdates;
  }

  constructor(props) {
    super(props);
    this.state = {
      showSelectionModal: false,
      allowFormToSubmit: false,
      packageSelected: this.props.model.isSelected,
      wasProxyTypesLoaded: this.props.proxyTypes.request.isResolved,
      formValues: {},
      initialValues: ManagedPackageEdit.getInitialValues(this.props.model, this.props.provider, this.props.proxyTypes),
      sections: {
        packageHoldingStatus: true,
        packageSettings: true,
        packageCoverageSettings: true,
      },
    };
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

  getActionMenu = () => {
    const {
      stripes,
      model,
    } = this.props;
    const { packageSelected } = this.state;
    const isAddButtonNeeded = !packageSelected || model.isPartiallySelected;
    const hasSelectPermission = stripes.hasPerm('ui-eholdings.package-title.select-unselect');

    if (!hasSelectPermission) return null;

    return ({ onToggle }) => (
      <>
        {packageSelected && this.renderRemoveFromHoldingsButton(onToggle)}
        {isAddButtonNeeded && this.renderAddToHoldingsButton(onToggle)}
      </>
    );
  }

  renderRemoveFromHoldingsButton(onToggle) {
    return (
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
    );
  }

  renderAddToHoldingsButton(onToggle) {
    const {
      model: { isPartiallySelected },
      addPackageToHoldings,
    } = this.props;

    const translationIdEnding = isPartiallySelected
      ? 'addAllToHoldings'
      : 'addToHoldings';

    return (
      <Button
        data-test-eholdings-package-add-to-holdings-action
        buttonStyle="dropdownItem fullWidth"
        onClick={() => {
          onToggle();
          addPackageToHoldings();
        }}
      >
        <FormattedMessage
          id={`ui-eholdings.${translationIdEnding}`}
        />
      </Button>
    );
  }

  getFooter = (pristine, reset) => {
    const { model } = this.props;

    const cancelButton = (
      <Button
        data-test-eholdings-package-edit-cancel-button
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
        data-test-eholdings-package-save-button
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
      provider,
      onCancel,
      accessStatusTypes,
    } = this.props;

    const {
      initialValues,
      showSelectionModal,
      packageSelected,
      sections
    } = this.state;

    const visibilityMessage = model.visibilityData.reason && `(${model.visibilityData.reason})`;

    const supportsProviderTokens = provider && provider.isLoaded && provider.providerToken && provider.providerToken.prompt;
    const supportsPackageTokens = model && model.isLoaded && model.packageToken && model.packageToken.prompt;
    const hasProviderTokenValue = provider && provider.isLoaded && provider.providerToken && provider.providerToken.value;
    const hasPackageTokenValue = model && model.isLoaded && model.packageToken && model.packageToken.value;

    return (
      <Form
        onSubmit={this.handleOnSubmit}
        decorators={[focusOnErrors]}
        mutators={{ ...arrayMutators }}
        initialValues={initialValues}
        render={({ handleSubmit, pristine, form: { change, reset } }) => (
          <div>
            <Toaster toasts={processErrors(model)} position="bottom" />
            <form onSubmit={handleSubmit}>
              <div role="tablist">
                <DetailsView
                  type="package"
                  model={model}
                  paneTitle={model.name}
                  actionMenu={this.getActionMenu()}
                  handleExpandAll={this.toggleAllSections}
                  sections={sections}
                  footer={this.getFooter(pristine, reset)}
                  bodyContent={(
                    <>
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
                            <AccessTypeEditSection accessStatusTypes={accessStatusTypes} />
                            {supportsProviderTokens && (
                              <fieldset>
                                <Headline tag="legend">
                                  <FormattedMessage id="ui-eholdings.provider.token" />
                                </Headline>
                                <TokenField
                                  token={provider.providerToken}
                                  tokenValue={hasProviderTokenValue}
                                  type="provider"
                                />
                              </fieldset>
                            )}
                            {supportsPackageTokens && (
                              <fieldset>
                                <Headline tag="legend">
                                  <FormattedMessage id="ui-eholdings.package.token" />
                                </Headline>
                                <TokenField
                                  token={model.packageToken}
                                  tokenValue={hasPackageTokenValue}
                                  type="package"
                                />
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
                    </>
                  )}
                  onCancel={onCancel}
                />
              </div>
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

export default withStripes(ManagedPackageEdit);
