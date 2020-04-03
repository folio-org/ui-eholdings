import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, FormSpy } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import createFocusDecorator from 'final-form-focus';
import { FormattedMessage } from 'react-intl';

import update from 'lodash/fp/update';
import hasIn from 'lodash/hasIn';

import {
  Accordion,
  Button,
  Headline,
  Icon,
  Modal,
  ModalFooter,
  PaneFooter,
} from '@folio/stripes/components';

import {
  IfPermission,
  withStripes,
} from '@folio/stripes-core';

import {
  processErrors,
  isBookPublicationType,
  getUserDefinedFields,
  getAccessTypeId,
  getProxyTypesRecords,
  getProxyTypeById,
} from '../../utilities';

import CoverageStatementFields, { coverageStatementDecorator } from '../_fields/coverage-statement';
import VisibilityField from '../_fields/visibility';
import Toaster from '../../toaster';
import CustomEmbargoFields, { getEmbargoInitial } from '../_fields/custom-embargo';
import NavigationModal from '../../navigation-modal';
import AccessTypeEditSection from '../../access-type-edit-section';
import ProxySelectField from '../../proxy-select';
import CoverageFields from '../_fields/resource-coverage-fields';
import CoverageDateList from '../../coverage-date-list';
import DetailsView from '../../details-view';
import { CustomLabelsEditSection } from '../../custom-labels-section';
import { CustomLabelsAccordion } from '../../../features';

import {
  historyActions,
  coverageStatementExistenceStatuses,
  accessTypesReduxStateShape,
} from '../../../constants';

const focusOnErrors = createFocusDecorator();

class ResourceEditManagedTitle extends Component {
  static getInitialValuesFromModel(model, proxyTypes) {
    const {
      isSelected,
      visibilityData,
      customCoverages,
      coverageStatement,
      customEmbargoPeriod,
      proxy,
    } = model;

    const proxyTypesRecords = getProxyTypesRecords(proxyTypes);
    const matchingProxy = getProxyTypeById(proxyTypesRecords, proxy.id);

    const hasCoverageStatement = coverageStatement.length > 0
      ? coverageStatementExistenceStatuses.YES
      : coverageStatementExistenceStatuses.NO;

    return {
      isSelected,
      isVisible: !visibilityData.isHidden,
      customCoverages,
      coverageStatement,
      hasCoverageStatement,
      customEmbargoPeriod: getEmbargoInitial(customEmbargoPeriod),
      proxyId: matchingProxy?.id || proxy.id,
      accessTypeId: getAccessTypeId(model),
    };
  }

  static isProxyTypesLoaded(proxyTypes) {
    return proxyTypes.request.isResolved;
  }

  static propTypes = {
    accessStatusTypes: accessTypesReduxStateShape.isRequired,
    model: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
    }),
  };

  constructor(props) {
    super(props);
    this.state = {
      managedResourceSelected: this.props.model.isSelected,
      showSelectionModal: false,
      allowFormToSubmit: false,
      wasProxyTypesLoaded: this.props.proxyTypes.request.isResolved,
      formValues: {},
      initialValues: ResourceEditManagedTitle.getInitialValuesFromModel(this.props.model, this.props.proxyTypes),
      sections: {
        resourceShowHoldingStatus: true,
        resourceShowSettings: true,
        resourceShowCoverageSettings: true,
      },
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { wasProxyTypesLoaded } = prevState;
    const stateUpdates = {};

    const { proxyTypes } = nextProps;
    const isProxyTypesLoaded = ResourceEditManagedTitle.isProxyTypesLoaded(proxyTypes);

    if (nextProps.model.update.errors.length) {
      stateUpdates.showSelectionModal = false;
    }

    if (nextProps.model.isSelected !== prevState.initialValues.isSelected) {
      Object.assign(stateUpdates, {
        initialValues: {
          isSelected: nextProps.model.isSelected
        },
        managedResourceSelected: nextProps.model.isSelected
      });
    }

    if (isProxyTypesLoaded && !wasProxyTypesLoaded) {
      Object.assign(stateUpdates, {
        initialValues: ResourceEditManagedTitle.getInitialValuesFromModel(nextProps.model, proxyTypes),
        wasProxyTypesLoaded: true,
      });
    }

    return stateUpdates;
  }

  toggleSection = ({ id }) => {
    const newState = update(`sections.${id}`, value => !value, this.state);
    this.setState(newState);
  };

  toggleAllSections = (sections) => {
    this.setState({ sections });
  };

  getSectionHeader = (translationKey) => {
    return (
      <Headline
        size="large"
        tag="h3"
      >
        <FormattedMessage id={translationKey} />
      </Headline>);
  };

  handleRemoveResourceFromHoldings = () => {
    this.handleOnSubmit({
      isSelected: false
    });
  };

  commitSelectionToggle = () => {
    this.setState({
      allowFormToSubmit: true
    }, () => { this.handleOnSubmit(this.state.formValues); });
  };

  cancelSelectionToggle = () => {
    this.setState({
      showSelectionModal: false,
      managedResourceSelected: true,
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

  renderCoverageDates = () => {
    return (
      <FormSpy subscription={{ values: true }}>
        {({ values }) => {
          const { model } = this.props;
          const { customCoverages: customCoverageDateValues } = values;
          let coverageDates = model.managedCoverages;

          if (customCoverageDateValues && customCoverageDateValues.length > 0) {
            coverageDates = customCoverageDateValues;
          }

          const nonEmptyCoverageDates = coverageDates
            .filter((currentCoverageDate) => Object.keys(currentCoverageDate).length !== 0);

          if (nonEmptyCoverageDates.length === 0) {
            return null;
          }

          return (
            <CoverageDateList
              coverageArray={nonEmptyCoverageDates}
              isYearOnly={isBookPublicationType(model.publicationType)}
            />
          );
        }}
      </FormSpy>
    );
  };

  getActionMenu = () => {
    const { stripes } = this.props;
    const hasSelectPermission = stripes.hasPerm('ui-eholdings.package-title.select-unselect');

    if (!hasSelectPermission) return null;

    return ({ onToggle }) => (
      <Button
        data-test-eholdings-remove-resource-from-holdings
        buttonStyle="dropdownItem fullWidth"
        onClick={() => {
          onToggle();
          this.handleRemoveResourceFromHoldings();
        }}
      >
        <FormattedMessage id="ui-eholdings.resource.actionMenu.removeHolding" />
      </Button>
    );
  }

  getFooter = (pristine, reset) => {
    const { model } = this.props;

    const cancelButton = (
      <Button
        data-test-eholdings-provider-edit-cancel-button
        buttonStyle="default mega"
        disabled={model.update.isPending || model.destroy.isPending || pristine}
        onClick={reset}
        marginBottom0
      >
        <FormattedMessage id="stripes-components.cancel" />
      </Button>
    );

    const saveButton = (
      <Button
        buttonStyle="primary mega"
        data-test-eholdings-resource-save-button
        disabled={pristine || model.update.isPending || model.destroy.isPending}
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
      accessStatusTypes,
      onCancel,
      model: { isSelected },
    } = this.props;

    const {
      showSelectionModal,
      managedResourceSelected,
      sections,
      initialValues,
    } = this.state;

    const isSelectInFlight = model.update.isPending && hasIn(model.update.changedAttributes, 'isSelected');
    const hasInheritedProxy = hasIn(model, 'package.proxy.id');
    const visibilityMessage = model.package.visibilityData.isHidden
      ? <FormattedMessage id="ui-eholdings.resource.visibilityData.isHidden" />
      : model.visibilityData.reason && `(${model.visibilityData.reason})`;

    const userDefinedFields = getUserDefinedFields(model);

    return (
      <Form
        onSubmit={this.handleOnSubmit}
        decorators={[coverageStatementDecorator, focusOnErrors]}
        mutators={{ ...arrayMutators }}
        initialValuesEqual={() => true}
        initialValues={initialValues}
        render={({ handleSubmit, pristine, form: { change, reset } }) => (
          <div>
            <Toaster toasts={processErrors(model)} position="bottom" />
            <form onSubmit={handleSubmit}>
              <DetailsView
                type="resource"
                model={model}
                paneTitle={model.title.name}
                paneSub={model.package.name}
                actionMenu={this.getActionMenu()}
                handleExpandAll={this.toggleAllSections}
                sections={sections}
                footer={this.getFooter(pristine, reset)}
                bodyContent={(
                  <>
                    <Accordion
                      label={this.getSectionHeader('ui-eholdings.label.holdingStatus')}
                      open={sections.resourceShowHoldingStatus}
                      id="resourceShowHoldingStatus"
                      onToggle={this.toggleSection}
                    >
                      <label
                        data-test-eholdings-resource-holding-status
                        htmlFor="managed-resource-holding-status"
                      >
                        {model.update.isPending ? (
                          <Icon icon='spinner-ellipsis' />
                        )
                          : (
                            <Headline margin="none">
                              {managedResourceSelected ?
                                (<FormattedMessage id="ui-eholdings.selected" />)
                                : (<FormattedMessage id="ui-eholdings.notSelected" />)}
                            </Headline>
                          )}
                        <br />
                        {((!managedResourceSelected && !isSelectInFlight) || (!this.props.model.isSelected && isSelectInFlight)) && (
                          <IfPermission perm="ui-eholdings.package-title.select-unselect">
                            <Button
                              buttonStyle="primary"
                              onClick={this.handleAddResourceToHoldings}
                              disabled={isSelectInFlight}
                              data-test-eholdings-resource-add-to-holdings-button
                            >
                              <FormattedMessage id="ui-eholdings.addToHoldings" />
                            </Button>
                          </IfPermission>
                        )}
                      </label>
                    </Accordion>

                    {isSelected && (
                      <CustomLabelsAccordion
                        id="resourceShowCustomLabels"
                        isOpen={sections.resourceShowCustomLabels}
                        onToggle={this.toggleSection}
                        section={CustomLabelsEditSection}
                        userDefinedFields={userDefinedFields}
                      />
                    )}

                    {managedResourceSelected && (
                      <Accordion
                        label={this.getSectionHeader('ui-eholdings.resource.resourceSettings')}
                        open={sections.resourceShowSettings}
                        id="resourceShowSettings"
                        onToggle={this.toggleSection}
                      >
                        <VisibilityField disabled={visibilityMessage} />
                        <div>
                          {hasInheritedProxy && (
                            (!proxyTypes.request.isResolved) ? (
                              <Icon icon="spinner-ellipsis" />
                            ) : (
                              <div data-test-eholdings-resource-proxy-select>
                                <ProxySelectField proxyTypes={proxyTypes} inheritedProxyId={model.package.proxy.id} />
                              </div>
                            ))}
                          <AccessTypeEditSection accessStatusTypes={accessStatusTypes} />
                        </div>
                      </Accordion>
                    )}

                    <Accordion
                      label={this.getSectionHeader('ui-eholdings.label.coverageSettings')}
                      open={sections.resourceShowCoverageSettings}
                      id="resourceShowCoverageSettings"
                      onToggle={this.toggleSection}
                    >
                      {managedResourceSelected ? (
                        <>
                          <Headline tag="h4">
                            <FormattedMessage id="ui-eholdings.label.dates" />
                          </Headline>
                          <CoverageFields model={model} />

                          <Headline tag="h4">
                            <FormattedMessage id="ui-eholdings.label.coverageDisplay" />
                          </Headline>
                          <CoverageStatementFields
                            coverageDates={this.renderCoverageDates()}
                          />

                          <Headline tag="h4">
                            <FormattedMessage id="ui-eholdings.resource.embargoPeriod" />
                          </Headline>
                          <CustomEmbargoFields />
                        </>
                      ) : (
                        <p data-test-eholdings-resource-edit-settings-message>
                          <FormattedMessage id="ui-eholdings.resource.coverage.notSelected" />
                        </p>
                      )}
                    </Accordion>
                  </>
                )}
                onCancel={onCancel}
              />
            </form>

            <NavigationModal historyAction={historyActions.REPLACE} when={!pristine && !model.update.isPending && !model.update.isResolved} />

            <Modal
              open={showSelectionModal}
              size="small"
              label={<FormattedMessage id="ui-eholdings.resource.modal.header" />}
              id="eholdings-resource-confirmation-modal"
              footer={(
                <ModalFooter>
                  <Button
                    data-test-eholdings-resource-deselection-confirmation-modal-yes
                    buttonStyle="primary"
                    disabled={model.update.isPending}
                    onClick={this.commitSelectionToggle}
                  >
                    {(model.update.isPending ?
                      <FormattedMessage id="ui-eholdings.resource.modal.buttonWorking" /> :
                      <FormattedMessage id="ui-eholdings.resource.modal.buttonConfirm" />)}
                  </Button>
                  <Button
                    data-test-eholdings-resource-deselection-confirmation-modal-no
                    onClick={() => this.cancelSelectionToggle(change)}
                  >
                    <FormattedMessage id="ui-eholdings.resource.modal.buttonCancel" />
                  </Button>
                </ModalFooter>
              )}
            >
              <FormattedMessage id="ui-eholdings.resource.modal.body" />
            </Modal>
          </div>
        )}
      />
    );
  }
}

export default withStripes(ResourceEditManagedTitle);
