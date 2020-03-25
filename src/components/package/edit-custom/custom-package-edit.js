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
  KeyValue,
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
import NameField from '../_fields/name';
import CoverageFields from '../_fields/custom-coverage';
import ContentTypeField from '../_fields/content-type';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import SelectionStatus from '../selection-status';
import ProxySelectField from '../../proxy-select';
import AccessTypeEditSection from '../../access-type-edit-section';

import { accessTypesReduxStateShape } from '../../../constants';

import styles from './custom-package-edit.css';

const focusOnErrors = createFocusDecorator();

class CustomPackageEdit extends Component {
  static getInitialValues(model, proxyTypes) {
    const {
      name,
      contentType,
      isSelected,
      customCoverage,
      proxy,
      visibilityData,
    } = model;

    const proxyTypesRecords = getProxyTypesRecords(proxyTypes);
    const matchingProxy = getProxyTypeById(proxyTypesRecords, proxy.id);

    return {
      name,
      contentType,
      isSelected,
      customCoverages: [{
        ...customCoverage,
      }],
      proxyId: matchingProxy?.id || proxy.id,
      isVisible: !visibilityData.isHidden,
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
      isSelected,
      destroy,
    } = nextProps.model;
    const { proxyTypes, provider } = nextProps;

    const selectionStatusChanged = isSelected !== initialValues.isSelected;
    const isProxyTypesLoaded = CustomPackageEdit.isProxyTypesLoaded(proxyTypes, provider);

    if (selectionStatusChanged) {
      stateUpdates = {
        initialValues: CustomPackageEdit.getInitialValues(nextProps.model, proxyTypes),
        packageSelected: isSelected
      };
    }

    if (isProxyTypesLoaded && !wasProxyTypesLoaded) {
      stateUpdates = {
        initialValues: CustomPackageEdit.getInitialValues(nextProps.model, proxyTypes),
        wasProxyTypesLoaded: true,
      };
    }

    if (destroy.errors.length) {
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
      initialValues: CustomPackageEdit.getInitialValues(this.props.model, this.props.proxyTypes),
      sections: {
        packageHoldingStatus: true,
        packageInfo: true,
        packageSettings: true,
        packageCoverageSettings: true,
      },
    };
  }

  handleDeleteAction = () => {
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
    const { packageSelected } = this.state;
    const { stripes } = this.props;
    const hasDeletePermission = stripes.hasPerm('ui-eholdings.titles-packages.create-delete');

    if (!hasDeletePermission || !packageSelected) return null;

    return ({ onToggle }) => (
      <Button
        data-test-eholdings-package-remove-from-holdings-action
        buttonStyle="dropdownItem fullWidth"
        onClick={() => {
          onToggle();
          this.handleDeleteAction();
        }}
      >
        <FormattedMessage id="ui-eholdings.package.deletePackage" />
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
      sections,
    } = this.state;

    const visibilityMessage = model.visibilityData.reason && `(${model.visibilityData.reason})`;

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
              <DetailsView
                type="package"
                model={model}
                paneTitle={model.name}
                actionMenu={this.getActionMenu()}
                handleExpandAll={this.toggleAllSections}
                sections={sections}
                ariaRole="tablist"
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

                    <Accordion
                      label={this.getSectionHeader('ui-eholdings.label.packageInformation')}
                      open={sections.packageInfo}
                      id="packageInfo"
                      onToggle={this.toggleSection}
                    >
                      {packageSelected
                        ? <NameField />
                        : (
                          <KeyValue label={<FormattedMessage id="ui-eholdings.package.name" />}>
                            <div data-test-eholdings-package-readonly-name-field>
                              {model.name}
                            </div>
                          </KeyValue>
                        )}

                      {packageSelected
                        ? <ContentTypeField />
                        : (
                          <KeyValue label={<FormattedMessage id="ui-eholdings.package.contentType" />}>
                            <div data-test-eholdings-package-details-readonly-content-type>
                              {model.contentType}
                            </div>
                          </KeyValue>
                        )}
                      <AccessTypeEditSection accessStatusTypes={accessStatusTypes} />
                    </Accordion>

                    <Accordion
                      label={this.getSectionHeader('ui-eholdings.package.packageSettings')}
                      open={sections.packageSettings}
                      id="packageSettings"
                      onToggle={this.toggleSection}
                    >
                      {packageSelected ? (
                        <div className={styles['visibility-radios']}>
                          {initialValues.isVisible !== null ? (
                            <fieldset
                              data-test-eholdings-package-visibility-field
                              className={styles['visibility-radios']}
                            >
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
                        </div>
                      ) : (
                        <p><FormattedMessage id="ui-eholdings.package.packageSettings.notSelected" /></p>
                      )}
                    </Accordion>

                    <Accordion
                      label={this.getSectionHeader('ui-eholdings.package.coverageSettings')}
                      open={sections.packageCoverageSettings}
                      id="packageCoverageSettings"
                      onToggle={this.toggleSection}
                    >
                      {packageSelected ? (
                        <CoverageFields
                          initial={initialValues.customCoverages}
                        />
                      ) : (
                        <p><FormattedMessage id="ui-eholdings.package.customCoverage.notSelected" /></p>
                      )}
                    </Accordion>
                  </>
                )}
                onCancel={onCancel}
              />
            </form>

            <NavigationModal when={!pristine && !model.update.isPending && !model.update.isResolved} />

            <Modal
              open={showSelectionModal}
              size="small"
              label={<FormattedMessage id="ui-eholdings.package.modal.header.isCustom" />}
              id="eholdings-package-confirmation-modal"
              footer={(
                <ModalFooter>
                  <Button
                    data-test-eholdings-package-deselection-confirmation-modal-yes
                    buttonStyle="primary"
                    disabled={model.destroy.isPending}
                    onClick={this.commitSelectionToggle}
                  >
                    {(model.destroy.isPending ?
                      <FormattedMessage id="ui-eholdings.package.modal.buttonWorking.isCustom" /> :
                      <FormattedMessage id="ui-eholdings.package.modal.buttonConfirm.isCustom" />)}
                  </Button>
                  <Button
                    data-test-eholdings-package-deselection-confirmation-modal-no
                    onClick={() => this.cancelSelectionToggle(change)}
                  >
                    <FormattedMessage id="ui-eholdings.package.modal.buttonCancel.isCustom" />
                  </Button>
                </ModalFooter>
              )}
            >
              <FormattedMessage id="ui-eholdings.package.modal.body.isCustom" />
            </Modal>
          </div>
        )}
      />
    );
  }
}

export default withStripes(CustomPackageEdit);
