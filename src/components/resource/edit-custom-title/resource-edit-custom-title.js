import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import isEqual from 'lodash/isEqual';
import { intlShape, injectIntl, FormattedMessage } from 'react-intl';

import {
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
import DetailsViewSection from '../../details-view-section';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import PaneHeaderButton from '../../pane-header-button';

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
      intl,
      change
    } = this.props;

    let {
      showSelectionModal,
      resourceSelected
    } = this.state;

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

    if (resourceSelected === true) {
      actionMenuItems.push({
        'label': <FormattedMessage id="ui-eholdings.resource.actionMenu.removeHolding" />,
        'state': { eholdings: true },
        'onClick': this.handleRemoveResourceFromHoldings,
        'data-test-eholdings-remove-resource-from-holdings': true
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
                <DetailsViewSection
                  label={<FormattedMessage id="ui-eholdings.label.holdingStatus" />}
                >
                  <label
                    data-test-eholdings-resource-holding-status
                    htmlFor="custom-resource-holding-status"
                  >
                    <h4>{resourceSelected ?
                      (<FormattedMessage id="ui-eholdings.selected" />)
                      :
                      (<FormattedMessage id="ui-eholdings.notSelected" />)}
                    </h4>
                    <br />
                  </label>
                </DetailsViewSection>
                <DetailsViewSection label={<FormattedMessage id="ui-eholdings.resource.resourceSettings" />}>
                  {resourceSelected ? (
                    <Fragment>
                      <VisibilityField disabled={visibilityMessage} />
                      <CustomUrlFields />
                    </Fragment>
                  ) : (
                    <p data-test-eholdings-resource-edit-settings-message>
                      <FormattedMessage id="ui-eholdings.resource.resourceSettings.notSelected" />
                    </p>
                  )}
                </DetailsViewSection>

                <DetailsViewSection
                  label={<FormattedMessage id="ui-eholdings.label.coverageSettings" />}
                >
                  {resourceSelected ? (
                    <Fragment>
                      <h4><FormattedMessage id="ui-eholdings.label.dates" /></h4>
                      <CustomCoverageFields
                        initialValue={initialValues.customCoverages}
                        model={model}
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
    validateCoverageStatement(values, props),
    validateUrlFields(values, props),
    validateEmbargo(values, props));
};

export default injectIntl(reduxForm({
  validate,
  enableReinitialize: true,
  form: 'ResourceEditCustomTitle',
  destroyOnUnmount: false,
})(ResourceEditCustomTitle));
