import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import isEqual from 'lodash/isEqual';
import { intlShape, injectIntl } from 'react-intl';

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
import styles from './resource-edit-managed-title.css';

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
      change
    } = this.props;

    let {
      showSelectionModal,
      managedResourceSelected
    } = this.state;


    let isSelectInFlight = model.update.isPending && 'isSelected' in model.update.changedAttributes;

    let actionMenuItems = [
      {
        label: 'Cancel editing',
        to: {
          pathname: `/eholdings/resources/${model.id}`,
          state: { eholdings: true }
        }
      }
    ];

    if (managedResourceSelected === true) {
      actionMenuItems.push({
        'label': 'Remove title from holdings',
        'state': { eholdings: true },
        'onClick': this.handleRemoveResourceFromHoldings,
        'data-test-eholdings-remove-resource-from-holdings': true
      });
    } else if (managedResourceSelected === false) {
      actionMenuItems.push({
        'label': 'Add to holdings',
        'state': { eholdings: true },
        'onClick': this.handleAddResourceToHoldings,
        'data-test-eholdings-add-resource-to-holdings': true
      });
    }

    let visibilityMessage = model.package.visibilityData.isHidden
      ? '(All titles in this package are hidden)'
      : model.visibilityData.reason && `(${model.visibilityData.reason})`;

    return (
      <div>
        <Toaster toasts={processErrors(model)} position="bottom" />
        <DetailsView
          type="resource"
          model={model}
          paneTitle={model.title.name}
          paneSub={model.package.name}
          actionMenuItems={actionMenuItems}
          bodyContent={(
            <form onSubmit={handleSubmit(this.handleOnSubmit)}>
              <DetailsViewSection
                label="Holding status"
              >
                <label
                  data-test-eholdings-resource-holding-status
                  htmlFor="managed-resource-holding-status"
                >  {
                  model.update.isPending ? (
                    <Icon icon='spinner-ellipsis' />
                  ) : (
                    <h4>{managedResourceSelected ? 'Selected' : 'Not selected'}</h4>
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
                      Add to holdings
                    </Button>)}
                </label>
              </DetailsViewSection>
              {managedResourceSelected && (
                <DetailsViewSection label="Resource settings">
                  <VisibilityField disabled={visibilityMessage} />
                </DetailsViewSection>
              )}
              {managedResourceSelected && (
                <DetailsViewSection
                  label="Coverage dates"
                >
                  <CustomCoverageFields
                    initialValue={initialValues.customCoverages}
                  />
                </DetailsViewSection>
              )}
              {managedResourceSelected && (
                <DetailsViewSection
                  label="Coverage statement"
                >
                  <CoverageStatementFields />
                </DetailsViewSection>
               )}
              {managedResourceSelected && (
                <DetailsViewSection
                  label="Embargo period"
                >
                  <CustomEmbargoFields
                    change={change}
                    showInputs={(initialValues.customEmbargoValue > 0)}
                    initialValue={{
                    customEmbargoValue: initialValues.customEmbargoValue,
                    customEmbargoUnit: initialValues.customEmbargoUnit
                  }}
                  />
                </DetailsViewSection>
                )}
              {managedResourceSelected && (
                <div className={styles['resource-edit-action-buttons']}>
                  <div
                    data-test-eholdings-resource-cancel-button
                  >
                    <Button
                      disabled={model.update.isPending}
                      type="button"
                      onClick={this.handleCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                  <div
                    data-test-eholdings-resource-save-button
                  >
                    <Button
                      disabled={pristine || model.update.isPending}
                      type="submit"
                      buttonStyle="primary"
                    >
                      {model.update.isPending ? 'Saving' : 'Save'}
                    </Button>
                  </div>
                  {model.update.isPending && (
                    <Icon icon="spinner-ellipsis" />
                  )}
                </div>
              )}
              <NavigationModal when={!pristine && !model.update.isPending} />
            </form>
          )}
        />

        <Modal
          open={showSelectionModal}
          size="small"
          label="Remove title from holdings?"
          id="eholdings-resource-confirmation-modal"
          footer={(
            <ModalFooter
              primaryButton={{
                'label': model.update.isPending ? 'Removing...' : 'Yes, remove',
                'onClick': this.commitSelectionToggle,
                'disabled': model.update.isPending,
                'data-test-eholdings-resource-deselection-confirmation-modal-yes': true
              }}
              secondaryButton={{
                'label': 'No, do not remove',
                'onClick': this.cancelSelectionToggle,
                'data-test-eholdings-resource-deselection-confirmation-modal-no': true
              }}
            />
          )}
        >
        Are you sure you want to remove this title from your holdings? By removing this title, you will lose all customization to this title in this package only.
        </Modal>
      </div>
    );
  }
}

const validate = (values, props) => {
  return Object.assign({}, validateCoverageDates(values, props), validateCoverageStatement(values), validateEmbargo(values));
};

export default injectIntl(reduxForm({
  validate,
  enableReinitialize: true,
  form: 'ResourceEditManagedTitle',
  destroyOnUnmount: false,
})(ResourceEditManagedTitle));
