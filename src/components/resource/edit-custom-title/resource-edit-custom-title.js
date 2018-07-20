import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import isEqual from 'lodash/isEqual';
import { intlShape, injectIntl } from 'react-intl';

import {
  Accordion,
  Button,
  Icon,
  Modal,
  ModalFooter
} from '@folio/stripes-components';
import { processErrors } from '../../utilities';

import DetailsView from '../../details-view';
import VisibilityField from '../_fields/visibility';
import CustomCoverageFields, { validate as validateCoverageDates } from '../_fields/custom-coverage';
import CustomUrlFields, { validate as validateUrlFields } from '../_fields/custom-url';
import CoverageStatementFields, { validate as validateCoverageStatement } from '../_fields/coverage-statement';
import CustomEmbargoFields, { validate as validateEmbargo } from '../_fields/custom-embargo';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import styles from './resource-edit-custom-title.css';

class ResourceEditCustomTitle extends Component {
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
    resourceSelected: this.props.initialValues.isSelected,
    showSelectionModal: false,
    allowFormToSubmit: false,
    formValues: {},
    // this is used above in getDerivedStateFromProps
    // eslint-disable-next-line react/no-unused-state
    initialValues: this.props.initialValues
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.model.destroy.errors.length) {
      return {
        showSelectionModal: false
      };
    }

    if (nextProps.initialValues.isSelected !== prevState.initialValues.isSelected) {
      return {
        ...prevState,
        initialValues: {
          ...prevState.initialValues,
          isSelected: nextProps.initialValues.isSelected
        },
        resourceSelected: nextProps.initialValues.isSelected
      };
    }
    return prevState;
  }

  componentDidUpdate(prevProps) {
    let wasPending = prevProps.model.update.isPending && !this.props.model.update.isPending;
    let needsUpdate = !isEqual(prevProps.model, this.props.model);
    let { router } = this.context;

    if (wasPending && needsUpdate) {
      router.history.push(
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

  handleRemoveResourceFromHoldings = () => {
    this.setState({
      formValues: {
        isSelected: false
      }
    }, () => { this.handleOnSubmit(this.state.formValues); });
  }

  handleSelectionToggle = (e) => {
    this.setState({
      resourceSelected: e.target.checked
    });
  }

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
      resourceSelected
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

    if (resourceSelected === true) {
      actionMenuItems.push({
        'label': 'Remove title from holdings',
        'state': { eholdings: true },
        'onClick': this.handleRemoveResourceFromHoldings,
        'data-test-eholdings-remove-resource-from-holdings': true
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
              <Accordion
                label="Holding status"
              >
                <label
                  data-test-eholdings-resource-holding-status
                  htmlFor="custom-resource-holding-status"
                >
                  <p><strong>{resourceSelected ? 'Selected' : 'Not selected'}</strong></p>
                  <br />
                </label>
              </Accordion>
              <Accordion label="Resource settings">
                {resourceSelected ? (
                  <Fragment>
                    <VisibilityField disabled={visibilityMessage} />
                    <CustomUrlFields />
                  </Fragment>
                ) : (
                  <p data-test-eholdings-resource-edit-settings-message>
                    Add the resource to holdings to customize resource settings.
                  </p>
                )}
              </Accordion>

              <Accordion
                label="Coverage dates"
              >
                {resourceSelected ? (
                  <CustomCoverageFields
                    initialValue={initialValues.customCoverages}
                  />
                  ) : (
                    <p>Add the resource to holdings to set custom coverage dates.</p>
                )}
              </Accordion>
              <Accordion
                label="Coverage statement"
              >
                {resourceSelected ? (
                  <CoverageStatementFields />
                  ) : (
                    <p>Add the resource to holdings to set coverage statement.</p>
                  )}
              </Accordion>
              <Accordion
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
                  <p data-test-eholdings-resource-embargo-not-shown-label>Add the resource to holdings to set custom embargo.</p>
                )}

              </Accordion>
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
          id="eholdings-resource-confirmation-modal"
          footer={(
            <ModalFooter
              primaryButton={{
                'label': model.destroy.isPending ? 'Removing...' : 'Yes, remove',
                'onClick': this.commitSelectionToggle,
                'disabled': model.destroy.isPending,
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

export default injectIntl(reduxForm({
  validate,
  enableReinitialize: true,
  form: 'ResourceEditCustomTitle',
  destroyOnUnmount: false,
})(ResourceEditCustomTitle));
