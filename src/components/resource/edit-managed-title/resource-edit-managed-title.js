import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import isEqual from 'lodash/isEqual';
import { intlShape, injectIntl, FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
  Modal,
  ModalFooter
} from '@folio/stripes-components';
import { processErrors } from '../../utilities';

import DetailsView from '../../details-view';
import VisibilityField from '../_fields/visibility';
import CoverageStatementFields, { validate as validateCoverageStatement } from '../_fields/coverage-statement';
import CustomCoverageFields, { validate as validateCoverageDates } from '../_fields/custom-coverage';
import CustomEmbargoFields, { validate as validateEmbargo } from '../_fields/custom-embargo';
import DetailsViewSection from '../../details-view-section';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import PaneHeaderButton from '../../pane-header-button';

class ResourceEditManagedTitle extends Component { // eslint-disable-line react/no-deprecated
  static propTypes = {
    model: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    change: PropTypes.func,
    intl: intlShape.isRequired // eslint-disable-line react/no-unused-prop-types
  };

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };

  state = {
    managedResourceSelected: this.props.initialValues.isSelected,
    showSelectionModal: false,
    allowFormToSubmit: false,
    formValues: {}
  }

  componentWillReceiveProps(nextProps) {
    let wasPending = this.props.model.update.isPending && !nextProps.model.update.isPending;
    let needsUpdate = !isEqual(this.props.model, nextProps.model);

    let wasUnSelected = this.props.model.isSelected && !nextProps.model.isSelected;
    let isCurrentlySelected = this.props.model.isSelected && nextProps.model.isSelected;

    if (nextProps.initialValues.isSelected !== this.state.managedResourceSelected) {
      this.setState({
        managedResourceSelected: nextProps.initialValues.isSelected,
      });
    }

    if (nextProps.model.update.errors.length) {
      this.setState({
        showSelectionModal: false
      });
    }

    if (wasUnSelected || isCurrentlySelected) {
      if (wasPending && needsUpdate) {
        this.context.router.history.push(
          `/eholdings/resources/${this.props.model.id}`,
          { eholdings: true, isFreshlySaved: true }
        );
      }
    }
  }

  handleCancel = () => {
    this.context.router.history.push(
      `/eholdings/resources/${this.props.model.id}`,
      { eholdings: true }
    );
  }

  handleSelectionToggle = (e) => {
    this.setState({
      managedResourceSelected: e.target.checked
    });
  }

  handleRemoveResourceFromHoldings = () => {
    this.setState({
      formValues: {
        isSelected: false
      }
    }, () => { this.handleOnSubmit(this.state.formValues); });
  }

  handleAddResourceToHoldings = () => {
    this.setState({
      formValues: {
        isSelected: true
      }
    }, () => { this.handleOnSubmit(this.state.formValues); });
  }

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
  }

  render() {
    let {
      model,
      initialValues,
      handleSubmit,
      pristine,
      change,
      intl
    } = this.props;

    let {
      showSelectionModal,
      managedResourceSelected
    } = this.state;


    let isSelectInFlight = model.update.isPending && 'isSelected' in model.update.changedAttributes;

    let actionMenuItems = [
      {
        'label': <FormattedMessage id="ui-eholdings.actionMenu.cancelEditing" />,
        'to': {
          pathname: `/eholdings/resources/${model.id}`,
          state: { eholdings: true },
        },
        'data-test-eholdings-resource-cancel-action': true
      }
    ];

    if (managedResourceSelected === true) {
      actionMenuItems.push({
        'label': <FormattedMessage id="ui-eholdings.resource.actionMenu.removeHolding" />,
        'state': { eholdings: true },
        'onClick': this.handleRemoveResourceFromHoldings,
        'data-test-eholdings-remove-resource-from-holdings': true
      });
    } else if (managedResourceSelected === false) {
      actionMenuItems.push({
        'label': <FormattedMessage id="ui-eholdings.resource.actionMenu.addHolding" />,
        'state': { eholdings: true },
        'onClick': this.handleAddResourceToHoldings,
        'data-test-eholdings-add-resource-to-holdings': true
      });
    }

    let visibilityMessage = model.package.visibilityData.isHidden
      ? (intl.formatMessage({ id: 'ui-eholdings.resource.visibilityData.isHidden' }))
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
                <DetailsViewSection
                  label={<FormattedMessage id="ui-eholdings.label.holdingStatus" />}
                >
                  <label
                    data-test-eholdings-resource-holding-status
                    htmlFor="managed-resource-holding-status"
                  >  {
                    model.update.isPending ? (
                      <Icon icon='spinner-ellipsis' />
                    ) : (
                      <h4>{managedResourceSelected ?
                        (<FormattedMessage id="ui-eholdings.selected" />)
                        : (<FormattedMessage id="ui-eholdings.notSelected" />)}
                      </h4>
                    )
                  }
                    <br />
                    { ((!managedResourceSelected && !isSelectInFlight) || (!this.props.model.isSelected && isSelectInFlight)) && (
                      <Button
                        buttonStyle="primary"
                        onClick={this.handleAddResourceToHoldings}
                        disabled={isSelectInFlight}
                        data-test-eholdings-resource-add-to-holdings-button
                      >
                        <FormattedMessage id="ui-eholdings.addToHoldings" />
                      </Button>)}
                  </label>
                </DetailsViewSection>
                {managedResourceSelected && (
                  <DetailsViewSection label={<FormattedMessage id="ui-eholdings.resource.resourceSettings" />}>
                    <VisibilityField disabled={visibilityMessage} />
                  </DetailsViewSection>
                )}
                <DetailsViewSection
                  label={<FormattedMessage id="ui-eholdings.label.coverageDates" />}
                >
                  {managedResourceSelected ? (
                    <Fragment>
                      <h4><FormattedMessage id="ui-eholdings.label.coverageDates" /></h4>
                      <CustomCoverageFields
                        initialValue={initialValues.customCoverages}
                      />

                      <h4><FormattedMessage id="ui-eholdings.label.coverageStatement" /></h4>
                      <CoverageStatementFields />

                      <h4><FormattedMessage id="ui-eholdings.resource.embargoPeriod" /></h4>
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

                </DetailsViewSection>
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
          label={intl.formatMessage({ id: 'ui-eholdings.resource.modal.header' })}
          id="eholdings-resource-confirmation-modal"
          footer={(
            <ModalFooter
              primaryButton={{
                'label': model.update.isPending ?
                  (<FormattedMessage id="ui-eholdings.resource.modal.buttonWorking" />)
                    :
                  (<FormattedMessage id="ui-eholdings.resource.modal.buttonConfirm" />),
                'onClick': this.commitSelectionToggle,
                'disabled': model.update.isPending,
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
          <FormattedMessage id="ui-eholdings.resource.modal.body" />
        </Modal>
      </div>
    );
  }
}

const validate = (values, props) => {
  return Object.assign({}, validateCoverageDates(values, props), validateCoverageStatement(values, props), validateEmbargo(values, props));
};

export default injectIntl(reduxForm({
  validate,
  enableReinitialize: true,
  form: 'ResourceEditManagedTitle',
  destroyOnUnmount: false,
})(ResourceEditManagedTitle));
