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
import CustomCoverageFields, { validate as validateCoverageDates } from '../_fields/custom-coverage';
import CustomUrlFields, { validate as validateUrlFields } from '../_fields/custom-url';
import CoverageStatementFields, { validate as validateCoverageStatement } from '../_fields/coverage-statement';
import CustomEmbargoFields, { validate as validateEmbargo } from '../_fields/custom-embargo';
import DetailsViewSection from '../../details-view-section';
import NavigationModal from '../../navigation-modal';
import ToggleSwitch from '../../toggle-switch/toggle-switch';
import Modal from '../../modal/modal';
import Toaster from '../../toaster';
import styles from './resource-edit-custom-title.css';

class ResourceEditCustomTitle extends Component {
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
    resourceSelected: this.props.initialValues.isSelected,
    resourceVisible: this.props.initialValues.isVisible,
    showSelectionModal: false,
    allowFormToSubmit: false,
    formValues: {}
  }

  componentWillReceiveProps(nextProps) {
    let wasPending = this.props.model.update.isPending && !nextProps.model.update.isPending;
    let needsUpdate = !isEqual(this.props.model, nextProps.model);

    if ((nextProps.initialValues.isSelected !== this.props.initialValues.isSelected) ||
    (nextProps.initialValues.isVisible !== this.props.initialValues.isVisible)) {
      this.setState({
        ...this.state,
        resourceSelected: nextProps.initialValues.isSelected,
        resourceVisible: nextProps.initialValues.isVisible
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
      resourceSelected: e.target.checked
    });
  }

  handleVisibilityToggle = (e) => {
    this.setState({
      resourceVisible: e.target.checked
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
      resourceSelected,
      resourceVisible
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
                label="Resource information"
              >
                {resourceSelected ? (
                  <CustomUrlFields />
                    ) : (
                      <p>Add the resource to holdings to set custom url.</p>
                  )}
              </DetailsViewSection>
              <DetailsViewSection
                label="Holding status"
              >
                <label
                  data-test-eholdings-resource-holding-status
                  htmlFor="custom-resource-holding-toggle-switch"
                >
                  <h4>{resourceSelected ? 'Selected' : 'Not selected'}</h4>
                  <br />
                  <Field
                    name="isSelected"
                    component={ToggleSwitch}
                    checked={resourceSelected}
                    onChange={this.handleSelectionToggle}
                    id="custom-resource-holding-toggle-switch"
                  />
                </label>
              </DetailsViewSection>
              <DetailsViewSection
                label="Visibility"
              >
                {resourceSelected ? (
                  <div>
                    <label
                      data-test-eholdings-resource-toggle-visibility
                      htmlFor="custom-resource-visibility-toggle-switch"
                    >
                      <h4>
                        {resourceVisible
                      ? 'Visible to patrons'
                    : 'Hidden from patrons'}
                      </h4>
                      <br />
                      <Field
                        name="isVisible"
                        component={ToggleSwitch}
                        checked={resourceVisible}
                        onChange={this.handleVisibilityToggle}
                        id="custom-resource-visibility-toggle-switch"
                      />
                    </label>

                    {!resourceVisible && (
                    <div data-test-eholdings-resource-toggle-hidden-reason>
                      {model.package.visibilityData.isHidden
                           ? 'All titles in this package are hidden.'
                           : model.visibilityData.reason}
                    </div>
                     )}
                  </div>
                 ) : (
                   <p data-test-eholdings-resource-not-shown-label>Not shown to patrons.</p>
                 )}
              </DetailsViewSection>
              <DetailsViewSection
                label="Coverage dates"
              >
                {resourceSelected ? (
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
                {resourceSelected ? (
                  <CoverageStatementFields />
                  ) : (
                    <p>Add the resource to holdings to set coverage statement.</p>
                  )}
              </DetailsViewSection>
              <DetailsViewSection
                label="Embargo period"
              >
                {resourceSelected ? (
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
                {(model.update.isPending || model.destroy.isPending) && (
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
          {
              /*
                we use <= here to account for the case where a user
                selects and then immediately deselects the
                resource
              */
              model.title.resources.length <= 1 ? (
                <span data-test-eholdings-deselect-final-title-warning>
                  Are you sure you want to remove this title from your holdings?
                  It is also the last title selected in this package. By removing
                  this title, you will also remove this package from your holdings
                  and all customizations will be lost.
                </span>
              ) : (
                <span data-test-eholdings-deselect-title-warning>
                Are you sure you want to remove this title from your holdings? By removing this title, you will lose all customization to this title in this package only.
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

export default reduxForm({
  validate,
  enableReinitialize: true,
  form: 'ResourceEditCustomTitle',
  destroyOnUnmount: false,
})(ResourceEditCustomTitle);
