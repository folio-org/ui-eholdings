import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form, FormSpy } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import createDecorator from 'final-form-calculate';
import { FormattedMessage } from 'react-intl';
import update from 'lodash/fp/update';

import {
  Accordion,
  Button,
  Headline,
  Icon,
  Modal,
  ModalFooter
} from '@folio/stripes/components';

import { processErrors, isBookPublicationType } from '../../utilities';

import DetailsView from '../../details-view';
import VisibilityField from '../_fields/visibility';
import CoverageStatementFields from '../_fields/coverage-statement';
import ManagedCoverageFields from '../_fields/managed-coverage';
import CustomEmbargoFields from '../_fields/custom-embargo';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import PaneHeaderButton from '../../pane-header-button';
import CoverageDateList from '../../coverage-date-list';
import ProxySelectField from '../../proxy-select';

const coverageStatementDecorator = createDecorator(
  {
    field: 'hasCoverageStatement',
    updates: {
      coverageStatement: (hasCoverageStatement, { coverageStatement }) => {
        return (hasCoverageStatement === 'no') ? '' : coverageStatement;
      }
    }
  },
  {
    field: 'coverageStatement',
    updates: {
      hasCoverageStatement: (coverageStatement) => {
        return (coverageStatement && coverageStatement.length) > 0 ? 'yes' : 'no';
      }
    }
  }
);

export default class ResourceEditManagedTitle extends Component {
  static propTypes = {
    initialValues: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    proxyTypes: PropTypes.object.isRequired
  };

  state = {
    managedResourceSelected: this.props.initialValues.isSelected,
    showSelectionModal: false,
    allowFormToSubmit: false,
    formValues: {},
    initialValues: this.props.initialValues,
    sections: {
      resourceShowHoldingStatus: true,
      resourceShowSettings: true,
      resourceShowCoverageSettings: true,
    },
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let stateUpdates = {};

    if (nextProps.model.update.errors.length) {
      stateUpdates.showSelectionModal = false;
    }

    if (nextProps.initialValues.isSelected !== prevState.initialValues.isSelected) {
      Object.assign(stateUpdates, {
        initialValues: {
          isSelected: nextProps.initialValues.isSelected
        },
        managedResourceSelected: nextProps.initialValues.isSelected
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

  handleSelectionToggle = (e) => {
    this.setState({
      managedResourceSelected: e.target.checked
    });
  };

  handleRemoveResourceFromHoldings = () => {
    this.setState({
      formValues: {
        isSelected: false
      }
    }, () => { this.handleOnSubmit(this.state.formValues); });
  };

  handleAddResourceToHoldings = () => {
    this.setState({
      formValues: {
        isSelected: true
      }
    }, () => { this.handleOnSubmit(this.state.formValues); });
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

  getActionMenu = ({ onToggle }) => {
    const { onCancel } = this.props;
    const { managedResourceSelected } = this.state;

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

        {managedResourceSelected ? (
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
        ) : (
          <Button
            data-test-eholdings-add-resource-to-holdings
            buttonStyle="dropdownItem fullWidth"
            onClick={() => {
              onToggle();
              this.handleAddResourceToHoldings();
            }}
          >
            <FormattedMessage id="ui-eholdings.resource.actionMenu.addHolding" />
          </Button>
        )}
      </Fragment>
    );
  }

  render() {
    let {
      model,
      proxyTypes,
      initialValues,
    } = this.props;

    let {
      showSelectionModal,
      managedResourceSelected,
      sections,
    } = this.state;

    let isSelectInFlight = model.update.isPending && 'isSelected' in model.update.changedAttributes;

    let hasInheritedProxy = model.package &&
      model.package.proxy &&
      model.package.proxy.id;

    let visibilityMessage = model.package.visibilityData.isHidden
      ? <FormattedMessage id="ui-eholdings.resource.visibilityData.isHidden" />
      : model.visibilityData.reason && `(${model.visibilityData.reason})`;

    return (
      <Form
        onSubmit={this.handleOnSubmit}
        decorators={[coverageStatementDecorator]}
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
                lastMenu={(
                  <Fragment>
                    {(model.update.isPending || model.destroy.isPending) && (
                      <Icon icon="spinner-ellipsis" />
                    )}
                    {managedResourceSelected && (
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
                    )}
                  </Fragment>
                )}
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
                        htmlFor="managed-resource-holding-status"
                      >
                        {model.update.isPending ? (
                          <Icon icon='spinner-ellipsis' />
                        ) : (
                          <Headline margin="none">
                            {managedResourceSelected ?
                              (<FormattedMessage id="ui-eholdings.selected" />)
                              : (<FormattedMessage id="ui-eholdings.notSelected" />)
                            }
                          </Headline>
                        )
                        }
                        <br />
                        {((!managedResourceSelected && !isSelectInFlight) || (!this.props.model.isSelected && isSelectInFlight)) && (
                          <Button
                            buttonStyle="primary"
                            onClick={this.handleAddResourceToHoldings}
                            disabled={isSelectInFlight}
                            data-test-eholdings-resource-add-to-holdings-button
                          >
                            <FormattedMessage id="ui-eholdings.addToHoldings" />
                          </Button>)}
                      </label>
                    </Accordion>

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
                        <Fragment>
                          <Headline tag="h4">
                            <FormattedMessage id="ui-eholdings.label.dates" />
                          </Headline>
                          <ManagedCoverageFields
                            model={model}
                          />

                          <Headline tag="h4">
                            <FormattedMessage id="ui-eholdings.label.coverageDisplay" />
                          </Headline>
                          <CoverageStatementFields
                            coverageDates={this.renderCoverageDates()}
                          />

                          <Headline tag="h4">
                            <FormattedMessage id="ui-eholdings.resource.embargoPeriod" />
                          </Headline>
                          <CustomEmbargoFields
                            change={change}
                            showInputs={(initialValues.customEmbargoValue > 0)}
                            initial={{
                              customEmbargoValue: initialValues.customEmbargoValue,
                              customEmbargoUnit: initialValues.customEmbargoUnit
                            }}
                          />
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

            <NavigationModal when={!pristine && !model.update.isPending && !model.update.isResolved} />

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
