import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector, reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import update from 'lodash/fp/update';

import {
  Accordion,
  Headline,
  Icon,
  Modal,
  ModalFooter
} from '@folio/stripes/components';

import { processErrors, isBookPublicationType } from '../../utilities';

import DetailsView from '../../details-view';
import VisibilityField from '../_fields/visibility';
import CustomCoverageFields, { validate as validateCoverageDates } from '../_fields/custom-coverage';
import CustomUrlFields, { validate as validateUrlFields } from '../_fields/custom-url';
import CoverageStatementFields, { validate as validateCoverageStatement } from '../_fields/coverage-statement';
import CustomEmbargoFields, { validate as validateEmbargo } from '../_fields/custom-embargo';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import PaneHeaderButton from '../../pane-header-button';
import CoverageDateList from '../../coverage-date-list';
import ProxySelectField from '../../proxy-select';

class ResourceEditCustomTitle extends Component {
  static propTypes = {
    change: PropTypes.func,
    customCoverageDateValues: PropTypes.array,
    handleSubmit: PropTypes.func,
    initialValues: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    proxyTypes: PropTypes.object.isRequired
  };

  state = {
    resourceSelected: this.props.initialValues.isSelected,
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

    if (nextProps.model.destroy.errors.length) {
      stateUpdates.showSelectionModal = false;
    }

    if (nextProps.initialValues.isSelected !== prevState.initialValues.isSelected) {
      Object.assign(stateUpdates, {
        initialValues: {
          isSelected: nextProps.initialValues.isSelected
        },
        resourceSelected: nextProps.initialValues.isSelected
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

  cancelSelectionToggle = () => {
    this.setState({
      showSelectionModal: false,
      resourceSelected: true,
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
  };

  renderCoverageDates = () => {
    let { customCoverageDateValues, model } = this.props;
    let coverageDates = model.managedCoverages;

    if (customCoverageDateValues && customCoverageDateValues.length > 0) {
      coverageDates = customCoverageDateValues;
    }

    return (
      <CoverageDateList
        coverageArray={coverageDates}
        isYearOnly={isBookPublicationType(model.publicationType)}
      />
    );
  };

  render() {
    let {
      model,
      proxyTypes,
      initialValues,
      handleSubmit,
      pristine,
      change,
      onCancel
    } = this.props;

    let {
      showSelectionModal,
      resourceSelected,
      sections,
    } = this.state;

    let hasInheritedProxy = model.package &&
      model.package.proxy &&
      model.package.proxy.id;

    let actionMenuItems = [
      {
        'label': <FormattedMessage id="ui-eholdings.actionMenu.cancelEditing" />,
        'onClick': onCancel,
        'data-test-eholdings-resource-cancel-action': true
      }
    ];

    if (resourceSelected === true) {
      actionMenuItems.push({
        'label': <FormattedMessage id="ui-eholdings.resource.actionMenu.removeHolding" />,
        'state': { eholdings: true },
        'onClick': this.handleRemoveResourceFromHoldings,
        'data-test-eholdings-remove-resource-from-holdings': true
      });
    }

    let visibilityMessage = model.package.visibilityData.isHidden
      ? <FormattedMessage id="ui-eholdings.resource.visibilityData.isHidden" />
      : model.visibilityData.reason && `(${model.visibilityData.reason})`;

    return (
      <div>
        <Toaster toasts={processErrors(model)} position="bottom" />
        <form onSubmit={handleSubmit(this.handleOnSubmit)}>
          <DetailsView
            type="resource"
            model={model}
            paneTitle={model.title.name}
            paneSub={model.package.name}
            actionMenuItems={actionMenuItems}
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
                      <CustomCoverageFields
                        initialValue={initialValues.customCoverages}
                        model={model}
                      />

                      <Headline tag="h4">
                        <FormattedMessage id="ui-eholdings.label.coverageStatement" />
                      </Headline>
                      <CoverageStatementFields
                        change={change}
                        coverageDates={this.renderCoverageDates()}
                      />

                      <Headline tag="h4">
                        <FormattedMessage id="ui-eholdings.resource.embargoPeriod" />
                      </Headline>
                      <CustomEmbargoFields
                        change={change}
                        showInputs={(initialValues.customEmbargoValue > 0)}
                        initialValue={{
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

        <Modal
          open={showSelectionModal}
          size="small"
          label={<FormattedMessage id="ui-eholdings.resource.modal.header" />}
          id="eholdings-resource-confirmation-modal"
          footer={(
            <ModalFooter
              primaryButton={{
                'label': model.destroy.isPending ?
                  (<FormattedMessage id="ui-eholdings.resource.modal.buttonWorking" />)
                  :
                  (<FormattedMessage id="ui-eholdings.resource.modal.buttonConfirm" />),
                'onClick': this.commitSelectionToggle,
                'disabled': model.destroy.isPending,
                'data-test-eholdings-resource-deselection-confirmation-modal-yes': true
              }}
              secondaryButton={{
                'label': <FormattedMessage id="ui-eholdings.resource.modal.buttonCancel" />,
                'onClick': this.cancelSelectionToggle,
                'data-test-eholdings-resource-deselection-confirmation-modal-no': true
              }}
            />
          )}
        >
          {
            /*
              we use <= here to account for the case where a user
              selects and then immediately deselects the
              resource
            */
            model.title.resources.length <= 1 ? (
              <span data-test-eholdings-deselect-final-title-warning>
                <FormattedMessage id="ui-eholdings.resource.modal.body.isCustom.lastTitle" />
              </span>
            ) : (
              <span data-test-eholdings-deselect-title-warning>
                <FormattedMessage id="ui-eholdings.resource.modal.body" />
              </span>
            )
          }
        </Modal>
      </div>
    );
  }
}

const validate = (values, props) => {
  return Object.assign({},
    validateCoverageDates(values, props),
    validateCoverageStatement(values),
    validateUrlFields(values),
    validateEmbargo(values));
};

const selector = formValueSelector('ResourceEditCustomTitle');

export default injectIntl(connect(state => ({
  customCoverageDateValues: selector(state, 'customCoverages')
}))(
  reduxForm({
    validate,
    enableReinitialize: true,
    form: 'ResourceEditCustomTitle',
    destroyOnUnmount: false,
  })(ResourceEditCustomTitle)
));
