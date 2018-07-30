import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import isEqual from 'lodash/isEqual';
import { intlShape, injectIntl, FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
  Modal,
  ModalFooter,
  RadioButton,
  RadioButtonGroup
} from '@folio/stripes-components';
import { processErrors } from '../../utilities';

import DetailsView from '../../details-view';
import CoverageFields, { validate as validateCoverageDates } from '../_fields/custom-coverage';
import DetailsViewSection from '../../details-view-section';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import PaneHeaderButton from '../../pane-header-button';
import styles from './managed-package-edit.css';

class ManagedPackageEdit extends Component {
  static propTypes = {
    change: PropTypes.func,
    model: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    intl: intlShape.isRequired
  };

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired
      }).isRequired
    }).isRequired,
    queryParams: PropTypes.object
  };

  state = {
    showSelectionModal: false,
    allowFormToSubmit: false,
    packageSelected: this.props.initialValues.isSelected,
    formValues: {},
    // these are used in getDerivedStateFromProps
    packageVisible: this.props.initialValues.isVisible, // eslint-disable-line react/no-unused-state
    initialValues: this.props.initialValues // eslint-disable-line react/no-unused-state
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.model.update.errors.length) {
      return { showSelectionModal: false };
    }

    if (nextProps.initialValues.isSelected !== prevState.initialValues.isSelected) {
      return {
        ...prevState,
        initialValues: {
          ...prevState.initialValues,
          isSelected: nextProps.initialValues.isSelected
        },
        packageSelected: nextProps.initialValues.isSelected
      };
    }
    return prevState;
  }

  componentDidUpdate(prevProps) {
    let wasPending = prevProps.model.update.isPending && !this.props.model.update.isPending;
    let needsUpdate = !isEqual(prevProps.model, this.props.model);
    let { router } = this.context;

    let wasUnSelected = prevProps.model.isSelected && !this.props.model.isSelected;
    let isCurrentlySelected = prevProps.model.isSelected && this.props.model.isSelected;

    if (wasPending && needsUpdate && (wasUnSelected || isCurrentlySelected)) {
      router.history.push({
        pathname: `/eholdings/packages/${this.props.model.id}`,
        search: router.route.location.search,
        state: { eholdings: true, isFreshlySaved: true }
      });
    }
  }

  handleCancel = () => {
    let { router } = this.context;

    router.history.push({
      pathname: `/eholdings/packages/${this.props.model.id}`,
      search: router.route.location.search,
      state: { eholdings: true }
    });
  }

  handleSelectionAction = () => {
    this.setState({
      packageSelected: true,
      formValues: {
        allowKbToAddTitles: true,
        isSelected: true
      }
    }, () => this.handleOnSubmit(this.state.formValues));
  }

  handleDeselectionAction = () => {
    this.setState({
      formValues: {
        isSelected: false
      }
    }, () => this.handleOnSubmit(this.state.formValues));
  }

  commitSelectionToggle = () => {
    this.setState({
      allowFormToSubmit: true
    }, () => { this.handleOnSubmit(this.state.formValues); });
  };

  cancelSelectionToggle = () => {
    this.setState({
      showSelectionModal: false,
      packageSelected: true,
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
      intl
    } = this.props;

    let {
      showSelectionModal,
      packageSelected
    } = this.state;

    let {
      queryParams,
      router
    } = this.context;

    let visibilityMessage = model.visibilityData.reason && `(${model.visibilityData.reason})`;
    let packageSelectionPending = model.update.isPending && 'isSelected' in model.update.changedAttributes;

    let actionMenuItems = [
      {
        'label': <FormattedMessage id="ui-eholdings.actionMenu.cancelEditing" />,
        'to': {
          pathname: `/eholdings/packages/${model.id}`,
          search: router.route.location.search,
          state: { eholdings: true }
        },
        'data-test-eholdings-package-cancel-action': true
      }
    ];

    if (queryParams.searchType) {
      actionMenuItems.push({
        label: <FormattedMessage id="ui-eholdings.actionMenu.fullView" />,
        to: {
          pathname: `/eholdings/packages/${model.id}/edit`,
          state: { eholdings: true }
        },
        className: styles['full-view-link']
      });
    }

    if (packageSelected) {
      actionMenuItems.push({
        'label': 'Remove from holdings',
        'state': { eholdings: true },
        'data-test-eholdings-package-remove-from-holdings-action': true,
        'onClick': this.handleDeselectionAction
      });
    } else {
      actionMenuItems.push({
        'label': 'Add to holdings',
        'state': { eholdings: true },
        'data-test-eholdings-package-add-to-holdings-action': true,
        'onClick': this.handleSelectionAction
      });
    }

    return (
      <div>
        <Toaster toasts={processErrors(model)} position="bottom" />
        <form onSubmit={handleSubmit(this.handleOnSubmit)}>
          <DetailsView
            type="package"
            model={model}
            paneTitle={model.name}
            actionMenuItems={actionMenuItems}
            lastMenu={(
              <Fragment>
                {model.update.isPending && (
                  <Icon icon="spinner-ellipsis" />
                )}
                {model.isSelected && (
                  <PaneHeaderButton
                    disabled={pristine || model.update.isPending}
                    type="submit"
                    buttonStyle="primary"
                    data-test-eholdings-package-save-button
                  >
                    {model.update.isPending ?
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
                  label={intl.formatMessage({ id: 'ui-eholdings.label.holdingStatus' })}
                >
                  <label
                    data-test-eholdings-package-details-selected
                    htmlFor="managed-package-details-toggle-switch"
                  >
                    { packageSelectionPending ? (
                      <Icon icon="spinner-ellipsis" />
                    ) : (
                      <h4>
                        {packageSelected ?
                          (<FormattedMessage id="ui-eholdings.selected" />) :
                          (<FormattedMessage id="ui-eholdings.notSelected" />)
                        }
                      </h4>
                    )}
                    <br />

                    {((!packageSelected && !packageSelectionPending) ||
                      (!this.props.model.isSelected && packageSelectionPending)) &&
                      <Button
                        type="button"
                        buttonStyle="primary"
                        disabled={packageSelectionPending}
                        onClick={this.handleSelectionAction}
                        data-test-eholdings-package-add-to-holdings-button
                      >
                        <FormattedMessage id="ui-eholdings.package.addToHoldings" />
                      </Button>
                    }
                  </label>
                </DetailsViewSection>
                {packageSelected && (
                  <div>
                    <DetailsViewSection label={intl.formatMessage({ id: 'ui-eholdings.package.packageSettings' })}>
                      <div className={styles['visibility-radios']}>
                        {this.props.initialValues.isVisible != null ? (
                          <Fragment>
                            <div data-test-eholdings-package-visibility-field>
                              <Field
                                label={intl.formatMessage({ id: 'ui-eholdings.package.visibility' })}
                                name="isVisible"
                                component={RadioButtonGroup}
                              >
                                <RadioButton label={intl.formatMessage({ id: 'ui-eholdings.yes' })} value="true" />
                                <RadioButton
                                  label={intl.formatMessage(
                                    { id: 'ui-eholdings.package.visibility.no' },
                                    { visibilityMessage }
                                  )}
                                  value="false"
                                />
                              </Field>
                            </div>
                          </Fragment>
                        ) : (
                          <label
                            data-test-eholdings-package-details-visibility
                            htmlFor="managed-package-details-visibility-switch"
                          >
                            <Icon icon="spinner-ellipsis" />
                          </label>
                        )}
                      </div>
                      <div className={styles['title-management-radios']}>
                        {this.props.initialValues.allowKbToAddTitles != null ? (
                          <Fragment>
                            <Field
                              label={intl.formatMessage({ id: 'ui-eholdings.package.packageAllowToAddTitles' })}
                              name="allowKbToAddTitles"
                              data-test-eholdings-allow-kb-to-add-titles-radios
                              component={RadioButtonGroup}
                            >
                              <RadioButton
                                label={intl.formatMessage({ id: 'ui-eholdings.yes' })}
                                value="true"
                                data-test-eholdings-allow-kb-to-add-titles-radio-yes
                              />
                              <RadioButton
                                label={intl.formatMessage({ id: 'ui-eholdings.no' })}
                                value="false"
                                data-test-eholdings-allow-kb-to-add-titles-radio-no
                              />
                            </Field>
                          </Fragment>
                        ) : (
                          <label
                            data-test-eholdings-package-details-allow-add-new-titles
                            htmlFor="managed-package-details-toggle-allow-add-new-titles-switch"
                          >
                            <Icon icon="spinner-ellipsis" />
                          </label>
                        )}
                      </div>
                    </DetailsViewSection>
                    <DetailsViewSection
                      label={intl.formatMessage({ id: 'ui-eholdings.package.coverageSettings' })}
                    >
                      <CoverageFields
                        initialValue={initialValues.customCoverages}
                      />
                    </DetailsViewSection>
                  </div>
                )}
                <NavigationModal when={!pristine && !model.update.isPending} />
              </Fragment>
            )}
          />
        </form>
        <Modal
          open={showSelectionModal}
          size="small"
          label={intl.formatMessage({ id: 'ui-eholdings.package.modal.header' })}
          id="eholdings-package-confirmation-modal"
          footer={(
            <ModalFooter
              primaryButton={{
                'label': model.update.isPending ?
                  intl.formatMessage({ id: 'ui-eholdings.package.modal.buttonWorking' }) :
                  intl.formatMessage({ id: 'ui-eholdings.package.modal.buttonConfirm' }),
                'onClick': this.commitSelectionToggle,
                'disabled': model.update.isPending,
                'data-test-eholdings-package-deselection-confirmation-modal-yes': true
              }}
              secondaryButton={{
                'label': intl.formatMessage({ id: 'ui-eholdings.package.modal.buttonCancel' }),
                'onClick': this.cancelSelectionToggle,
                'data-test-eholdings-package-deselection-confirmation-modal-no': true
              }}
            />
          )}
        >
          <FormattedMessage id="ui-eholdings.package.modal.body" />
        </Modal>
      </div>
    );
  }
}

const validate = (values, props) => {
  return validateCoverageDates(values, props);
};

export default injectIntl(reduxForm({
  validate,
  enableReinitialize: true,
  form: 'ManagedPackageEdit',
  destroyOnUnmount: false,
})(ManagedPackageEdit));
