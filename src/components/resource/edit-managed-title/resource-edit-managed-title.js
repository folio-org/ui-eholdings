import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import isEqual from 'lodash/isEqual';

import {
  Button,
  Icon
} from '@folio/stripes-components';
import { processErrors } from '../../utilities';

import DetailsView from '../../details-view';
import CoverageStatementFields, { validate as validateCoverageStatement } from '../_fields/coverage-statement';
import CustomCoverageFields, { validate as validateCoverageDates } from '../_fields/custom-coverage';
import CustomEmbargoFields, { validate as validateEmbargo } from '../_fields/custom-embargo';
import DetailsViewSection from '../../details-view-section';
import ToggleSwitch from '../../toggle-switch/toggle-switch';
import Modal from '../../modal/modal';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import styles from './resource-edit-managed-title.css';

class ResourceEditManagedTitle extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    change: PropTypes.func
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
    managedResourceHidden: this.props.initialValues.isHidden,
    showSelectionModal: false,
    allowFormToSubmit: false,
    formValues: {}
  }

  componentWillReceiveProps(nextProps) {
    let wasPending = this.props.model.update.isPending && !nextProps.model.update.isPending;
    let needsUpdate = !isEqual(this.props.initialValues, nextProps.initialValues);

    if (nextProps.initialValues.isSelected !== this.props.initialValues.isSelected) {
      this.setState({
        ...this.state,
        managedResourceSelected: nextProps.initialValues.isSelected,
        managedResourceHidden: nextProps.initialValues.isHidden,
      });
    }

    if (wasPending && needsUpdate) {
      this.context.router.history.push(
        `/eholdings/resources/${this.props.model.id}`,
        { eholdings: true, isFreshlySaved: true }
      );
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

  handleVisibilityToggle = (e) => {
    this.setState({
      managedResourceHidden: !e.target.checked
    });
  }

  commitSelectionToggle = () => {
    this.setState({
      showSelectionModal: false,
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
      managedResourceSelected,
      managedResourceHidden
    } = this.state;

    let actionMenuItems = [
      {
        label: 'Cancel editing',
        to: {
          pathname: `/eholdings/resources/${model.id}`,
          state: { eholdings: true }
        }
      }
    ];


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
                  htmlFor="managed-resource-holding-toggle-switch"
                >
                  <h4>{managedResourceSelected ? 'Selected' : 'Not selected'}</h4>
                  <br />
                  <Field
                    name="isSelected"
                    component={ToggleSwitch}
                    checked={managedResourceSelected}
                    onChange={this.handleSelectionToggle}
                    id="managed-resource-holding-toggle-switch"
                  />
                </label>
              </DetailsViewSection>
              <DetailsViewSection
                label="Visibility"
              >
                <label
                  data-test-eholdings-resource-toggle-visibility
                  htmlFor="managed-resource-visibility-toggle-switch"
                >
                  <h4>
                    {managedResourceHidden
                      ? 'Hidden from patrons'
                    : 'Visible to patrons'}
                  </h4>
                  <br />
                  {managedResourceSelected ? (
                    <Field
                      name="isHidden"
                      component={ToggleSwitch}
                      checked={!managedResourceHidden}
                      onChange={this.handleVisibilityToggle}
                      id="managed-resource-visibility-toggle-switch"
                    />) : null}
                </label>
              </DetailsViewSection>
              <DetailsViewSection
                label="Coverage dates"
              >
                {managedResourceSelected ? (
                  <CustomCoverageFields
                    initialValue={initialValues.customCoverages}
                  />
                ) : (
                  <p>Add the resource to holdings to set custom coverage dates.</p>
                )}
              </DetailsViewSection>
              <DetailsViewSection
                label="Coverage statement"
              >
                {managedResourceSelected ? (
                  <CoverageStatementFields />
                  ) : (
                    <p>Add the resource to holdings to set coverage statement.</p>
                  )}
              </DetailsViewSection>
              <DetailsViewSection
                label="Embargo period"
              >
                {managedResourceSelected ? (
                  <CustomEmbargoFields
                    change={change}
                    showInputs={(initialValues.customEmbargoValue > 0)}
                    initialValue={{
                    customEmbargoValue: initialValues.customEmbargoValue,
                    customEmbargoUnit: initialValues.customEmbargoUnit
                  }}
                  />
                  ) : (
                    <p>Add the resource to holdings to set custom embargo.</p>
                  )}
              </DetailsViewSection>
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
                    disabled={pristine || model.update.isPending || model.destroy.isPending}
                    type="submit"
                    buttonStyle="primary"
                  >
                    {model.update.isPending || model.destroy.isPending ? 'Saving' : 'Save'}
                  </Button>
                </div>
                {model.update.isPending && (
                  <Icon icon="spinner-ellipsis" />
                )}
              </div>
              <NavigationModal when={!pristine && !model.update.isPending} />
            </form>
          )}
        />

        <Modal
          open={showSelectionModal}
          size="small"
          label="Remove title from holdings?"
          scope="root"
          id="eholdings-resource-confirmation-modal"
          footer={(
            <div>
              <Button
                buttonStyle="primary"
                onClick={this.commitSelectionToggle}
                data-test-eholdings-resource-deselection-confirmation-modal-yes
              >
                Yes, remove
              </Button>
              <Button
                onClick={this.cancelSelectionToggle}
                data-test-eholdings-resource-deselection-confirmation-modal-no
              >
                No, do not remove
              </Button>
            </div>
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

export default reduxForm({
  validate,
  enableReinitialize: true,
  form: 'ResourceEditManagedTitle',
  destroyOnUnmount: false,
})(ResourceEditManagedTitle);
