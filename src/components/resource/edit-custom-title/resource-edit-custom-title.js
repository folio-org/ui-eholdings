import React, { Component } from 'react';
import {
  Form,
} from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import createFocusDecorator from 'final-form-focus';
import { FormattedMessage } from 'react-intl';

import hasIn from 'lodash/hasIn';
import update from 'lodash/fp/update';

import { withStripes } from '@folio/stripes-core';
import {
  Accordion,
  Button,
  Headline,
  Icon,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

import CoverageStatementFields, { coverageStatementDecorator } from '../_fields/coverage-statement';
import CustomEmbargoFields, { getEmbargoInitial } from '../_fields/custom-embargo';
import CustomUrlFields from '../_fields/custom-url';
import CoverageFields from '../_fields/resource-coverage-fields';
import VisibilityField from '../_fields/visibility';
import { CustomLabelsEditSection } from '../../custom-labels-section';
import DetailsView from '../../details-view';
import NavigationModal from '../../navigation-modal';
import ProxySelectField from '../../proxy-select';
import AccessTypeEditSection from '../../access-type-edit-section';
import Toaster from '../../toaster';

import resourceEditProptypes from '../recource-edit-proptypes';

import {
  processErrors,
  getUserDefinedFields,
  getAccessTypeId,
  getProxyTypesRecords,
  getProxyTypeById,
} from '../../utilities';

import { CustomLabelsAccordion } from '../../../features';

import {
  historyActions,
  coverageStatementExistenceStatuses,
} from '../../../constants';


const focusOnErrors = createFocusDecorator();

class ResourceEditCustomTitle extends Component {
  static getInitialValuesFromModel(model, proxyTypes) {
    const {
      isSelected,
      visibilityData,
      customCoverages,
      coverageStatement,
      customEmbargoPeriod,
      url,
      proxy,
    } = model;

    const proxyTypesRecords = getProxyTypesRecords(proxyTypes);
    const matchingProxy = getProxyTypeById(proxyTypesRecords, proxy.id);

    const hasCoverageStatement = coverageStatement.length > 0
      ? coverageStatementExistenceStatuses.YES
      : coverageStatementExistenceStatuses.NO;

    return {
      isSelected,
      customCoverages,
      coverageStatement,
      hasCoverageStatement,
      customUrl: url,
      proxyId: matchingProxy?.id || proxy.id,
      accessTypeId: getAccessTypeId(model),
      isVisible: !visibilityData.isHidden,
      customEmbargoPeriod: getEmbargoInitial(customEmbargoPeriod)
    };
  }

  static isProxyTypesLoaded(proxyTypes) {
    return proxyTypes.request.isResolved;
  }

  static propTypes = resourceEditProptypes;

  constructor(props) {
    super(props);
    this.state = {
      resourceSelected: this.props.model.isSelected,
      wasProxyTypesLoaded: this.props.proxyTypes.request.isResolved,
      initialValues: ResourceEditCustomTitle.getInitialValuesFromModel(this.props.model, this.props.proxyTypes),
      sections: {
        resourceShowHoldingStatus: true,
        resourceShowCustomLabels: true,
        resourceShowSettings: true,
        resourceShowCoverageSettings: true,
      },
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { wasProxyTypesLoaded } = prevState;
    const stateUpdates = {};

    const { proxyTypes } = nextProps;
    const isProxyTypesLoaded = ResourceEditCustomTitle.isProxyTypesLoaded(proxyTypes);

    if (nextProps.model.isSelected !== prevState.initialValues.isSelected) {
      Object.assign(stateUpdates, {
        initialValues: {
          isSelected: nextProps.model.isSelected
        },
        resourceSelected: nextProps.model.isSelected
      });
    }

    if (isProxyTypesLoaded && !wasProxyTypesLoaded) {
      Object.assign(stateUpdates, {
        initialValues: ResourceEditCustomTitle.getInitialValuesFromModel(nextProps.model, proxyTypes),
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

  handleRemoveResourceFromHoldings = () => {
    this.setState({
      formValues: {
        isSelected: false
      }
    }, () => { this.props.handleOnSubmit(this.state.formValues); });
  };

  handleSelectionToggle = (e) => {
    this.setState({
      resourceSelected: e.target.checked
    });
  };

  cancelSelectionToggle = (change) => {
    this.props.closeSelectionModal();

    this.setState({
      resourceSelected: true,
    }, () => {
      change('isSelected', true);
    });
  };

  getActionMenu = () => {
    const { stripes } = this.props;

    const { resourceSelected } = this.state;
    const hasSelectPermission = stripes.hasPerm('ui-eholdings.package-title.select-unselect');

    if (!hasSelectPermission || !resourceSelected) return null;

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

  render() {
    const {
      model,
      proxyTypes,
      onCancel,
      accessStatusTypes,
      showSelectionModal,
      handelDeleteConfirmation,
      handleOnSubmit,
      getFooter,
      getSectionHeader,
      renderCoverageDates,
    } = this.props;

    const {
      resourceSelected,
      sections,
      initialValues,
    } = this.state;

    const hasInheritedProxy = hasIn(model, 'package.proxy.id');
    const visibilityMessage = model.package.visibilityData.isHidden
      ? <FormattedMessage id="ui-eholdings.resource.visibilityData.isHidden" />
      : model.visibilityData.reason && `(${model.visibilityData.reason})`;

    const userDefinedFields = getUserDefinedFields(model);

    return (
      <Form
        onSubmit={handleOnSubmit}
        decorators={[coverageStatementDecorator, focusOnErrors]}
        mutators={{ ...arrayMutators }}
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
                footer={getFooter(pristine, reset)}
                bodyContent={(
                  <>
                    <Accordion
                      label={getSectionHeader('ui-eholdings.label.holdingStatus')}
                      open={sections.resourceShowHoldingStatus}
                      id="resourceShowHoldingStatus"
                      onToggle={this.toggleSection}
                    >
                      <label
                        data-test-eholdings-resource-holding-status
                        htmlFor="custom-resource-holding-status"
                      >
                        <Headline margin="none">
                          {resourceSelected ?
                            (<FormattedMessage id="ui-eholdings.selected" />)
                            :
                            (<FormattedMessage id="ui-eholdings.notSelected" />)}
                        </Headline>
                        <br />
                      </label>
                    </Accordion>

                    <CustomLabelsAccordion
                      id="resourceShowCustomLabels"
                      isOpen={sections.resourceShowCustomLabels}
                      onToggle={this.toggleSection}
                      section={CustomLabelsEditSection}
                      userDefinedFields={userDefinedFields}
                    />

                    <Accordion
                      label={getSectionHeader('ui-eholdings.resource.resourceSettings')}
                      open={sections.resourceShowSettings}
                      id="resourceShowSettings"
                      onToggle={this.toggleSection}
                    >
                      {resourceSelected ? (
                        <>
                          <VisibilityField disabled={visibilityMessage} />
                          <div>
                            {hasInheritedProxy && (
                              (!proxyTypes.request.isResolved) ? (
                                <Icon icon="spinner-ellipsis" />
                              ) : (
                                <div data-test-eholdings-resource-proxy-select>
                                  <ProxySelectField proxyTypes={proxyTypes} inheritedProxyId={model.package.proxy.id} />
                                </div>
                              )
                            )}
                          </div>
                          <CustomUrlFields />
                          <AccessTypeEditSection accessStatusTypes={accessStatusTypes} />
                        </>
                      ) : (
                        <p data-test-eholdings-resource-edit-settings-message>
                          <FormattedMessage id="ui-eholdings.resource.resourceSettings.notSelected" />
                        </p>
                      )}
                    </Accordion>

                    <Accordion
                      label={getSectionHeader('ui-eholdings.label.coverageSettings')}
                      open={sections.resourceShowCoverageSettings}
                      id="resourceShowCoverageSettings"
                      onToggle={this.toggleSection}
                    >
                      {resourceSelected ? (
                        <>
                          <Headline tag="h4"><FormattedMessage id="ui-eholdings.label.dates" /></Headline>
                          <CoverageFields model={model} />

                          <Headline tag="h4">
                            <FormattedMessage id="ui-eholdings.label.coverageStatement" />
                          </Headline>
                          <CoverageStatementFields
                            coverageDates={renderCoverageDates()}
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

            <NavigationModal
              historyAction={historyActions.REPLACE}
              when={!pristine && !model.update.isPending && !model.update.isResolved}
            />

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
                    disabled={model.destroy.isPending}
                    onClick={handelDeleteConfirmation}
                  >
                    {(model.destroy.isPending ?
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
              {
                /*
                  we use <= here to account for the case where a user
                  selects and then immediately deselects the
                  resource
                */
                model.package.titleCount <= 1
                  ? (
                    <span data-test-eholdings-deselect-final-title-warning>
                      <FormattedMessage id="ui-eholdings.resource.modal.body.isCustom.lastTitle" />
                    </span>
                  )
                  : (
                    <span data-test-eholdings-deselect-title-warning>
                      <FormattedMessage id="ui-eholdings.resource.modal.body" />
                    </span>
                  )
              }
            </Modal>
          </div>
        )}
      />
    );
  }
}

export default withStripes(ResourceEditCustomTitle);
