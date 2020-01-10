import React, {
  Component,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  FormSpy,
} from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import createFocusDecorator from 'final-form-focus';
import { FormattedMessage } from 'react-intl';

import update from 'lodash/fp/update';
import hasIn from 'lodash/hasIn';

import { IfPermission } from '@folio/stripes-core';
import {
  Accordion,
  Button,
  Headline,
  Icon,
  Modal,
  ModalFooter
} from '@folio/stripes/components';

import CoverageStatementFields, { coverageStatementDecorator } from '../_fields/coverage-statement';
import CustomEmbargoFields, { getEmbargoInitial } from '../_fields/custom-embargo';
import CustomUrlFields from '../_fields/custom-url';
import CoverageFields from '../_fields/resource-coverage-fields';
import VisibilityField from '../_fields/visibility';

import CoverageDateList from '../../coverage-date-list';
import { CustomLabelsEditSection } from '../../custom-labels-section';
import DetailsView from '../../details-view';
import NavigationModal from '../../navigation-modal';
import PaneHeaderButton from '../../pane-header-button';
import ProxySelectField from '../../proxy-select';
import Toaster from '../../toaster';

import {
  processErrors,
  isBookPublicationType,
  getUserDefinedFields,
} from '../../utilities';

import { CustomLabelsAccordion } from '../../../features';

import {
  historyActions,
  coverageStatementExistenceStatuses,
} from '../../../constants';


const focusOnErrors = createFocusDecorator();

export default class ResourceEditCustomTitle extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    proxyTypes: PropTypes.object.isRequired
  };

  state = {
    resourceSelected: this.props.model.isSelected,
    showSelectionModal: false,
    allowFormToSubmit: false,
    formValues: {},
    initialValues: this.getInitialValuesFromModel(),
    sections: {
      resourceShowHoldingStatus: true,
      resourceShowCustomLabels: true,
      resourceShowSettings: true,
      resourceShowCoverageSettings: true,
    },
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const stateUpdates = {};

    if (nextProps.model.destroy.errors.length) {
      stateUpdates.showSelectionModal = false;
    }

    if (nextProps.model.isSelected !== prevState.initialValues.isSelected) {
      Object.assign(stateUpdates, {
        initialValues: {
          isSelected: nextProps.model.isSelected
        },
        resourceSelected: nextProps.model.isSelected
      });
    }

    return stateUpdates;
  }

  getInitialValuesFromModel() {
    const {
      isSelected,
      visibilityData,
      customCoverages,
      coverageStatement,
      customEmbargoPeriod,
      url,
      proxy,
    } = this.props.model;

    const hasCoverageStatement = coverageStatement.length > 0
      ? coverageStatementExistenceStatuses.YES
      : coverageStatementExistenceStatuses.NO;

    return {
      isSelected,
      customCoverages,
      coverageStatement,
      hasCoverageStatement,
      customUrl: url,
      proxyId: proxy.id,
      isVisible: !visibilityData.isHidden,
      customEmbargoPeriod: getEmbargoInitial(customEmbargoPeriod)
    };
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
    this.setState({
      formValues: {
        isSelected: false
      }
    }, () => { this.handleOnSubmit(this.state.formValues); });
  };

  handleSelectionToggle = (e) => {
    this.setState({
      resourceSelected: e.target.checked
    });
  };

  commitSelectionToggle = () => {
    this.setState({
      allowFormToSubmit: true
    }, () => { this.handleOnSubmit(this.state.formValues); });
  };

  cancelSelectionToggle = (change) => {
    this.setState({
      showSelectionModal: false,
      resourceSelected: true,
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

  getActionMenu = ({ onToggle }) => {
    const { onCancel } = this.props;
    const { resourceSelected } = this.state;

    return (
      <Fragment>
        <Button
          data-test-eholdings-resource-cancel-action
          buttonStyle="dropdownItem fullWidth"
          onClick={() => {
            onToggle();
            onCancel();
          }}
        >
          <FormattedMessage id="ui-eholdings.actionMenu.cancelEditing" />
        </Button>

        {resourceSelected && (
          <IfPermission perm="ui-eholdings.package-title.select-unselect">
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
          </IfPermission>
        )}
      </Fragment>
    );
  }

  render() {
    const {
      model,
      proxyTypes,
    } = this.props;

    const {
      showSelectionModal,
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
        onSubmit={this.handleOnSubmit}
        decorators={[coverageStatementDecorator, focusOnErrors]}
        mutators={{ ...arrayMutators }}
        initialValues={initialValues}
        render={({ handleSubmit, pristine, form: { change } }) => (
          <div>
            <Toaster toasts={processErrors(model)} position="bottom" />
            <form onSubmit={handleSubmit}>
              <DetailsView
                type="resource"
                model={model}
                paneTitle={model.title.name}
                paneSub={model.package.name}
                actionMenu={this.getActionMenu}
                handleExpandAll={this.toggleAllSections}
                sections={sections}
                lastMenu={
                  <Fragment>
                    {(model.update.isPending || model.destroy.isPending) && (
                      <Icon icon="spinner-ellipsis" />
                    )}
                    <PaneHeaderButton
                      disabled={pristine || model.update.isPending || model.destroy.isPending}
                      type="submit"
                      buttonStyle="primary"
                      data-test-eholdings-resource-save-button
                    >
                      {model.update.isPending || model.destroy.isPending ?
                        (<FormattedMessage id="ui-eholdings.saving" />)
                        :
                        (<FormattedMessage id="ui-eholdings.save" />)}
                    </PaneHeaderButton>
                  </Fragment>
                }
                bodyContent={(
                  <Fragment>
                    <Accordion
                      label={this.getSectionHeader('ui-eholdings.label.holdingStatus')}
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
                      label={this.getSectionHeader('ui-eholdings.resource.resourceSettings')}
                      open={sections.resourceShowSettings}
                      id="resourceShowSettings"
                      onToggle={this.toggleSection}
                    >
                      {resourceSelected ? (
                        <Fragment>
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
                          </div>
                          <CustomUrlFields />
                        </Fragment>
                      ) : (
                        <p data-test-eholdings-resource-edit-settings-message>
                          <FormattedMessage id="ui-eholdings.resource.resourceSettings.notSelected" />
                        </p>
                      )}
                    </Accordion>

                    <Accordion
                      label={this.getSectionHeader('ui-eholdings.label.coverageSettings')}
                      open={sections.resourceShowCoverageSettings}
                      id="resourceShowCoverageSettings"
                      onToggle={this.toggleSection}
                    >
                      {resourceSelected ? (
                        <Fragment>
                          <Headline tag="h4"><FormattedMessage id="ui-eholdings.label.dates" /></Headline>
                          <CoverageFields model={model} />

                          <Headline tag="h4">
                            <FormattedMessage id="ui-eholdings.label.coverageStatement" />
                          </Headline>
                          <CoverageStatementFields
                            coverageDates={this.renderCoverageDates()}
                          />

                          <Headline tag="h4">
                            <FormattedMessage id="ui-eholdings.resource.embargoPeriod" />
                          </Headline>
                          <CustomEmbargoFields />
                        </Fragment>
                      ) : (
                        <p data-test-eholdings-resource-edit-settings-message>
                          <FormattedMessage id="ui-eholdings.resource.coverage.notSelected" />
                        </p>
                      )}
                    </Accordion>
                  </Fragment>
                )}
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
                    onClick={this.commitSelectionToggle}
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
