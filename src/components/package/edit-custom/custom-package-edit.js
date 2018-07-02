import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import isEqual from 'lodash/isEqual';
import { intlShape, injectIntl, FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
  KeyValue,
  Modal,
  ModalFooter,
  RadioButton,
  RadioButtonGroup
} from '@folio/stripes-components';
import { processErrors } from '../../utilities';

import DetailsView from '../../details-view';
import NameField, { validate as validatePackageName } from '../_fields/name';
import CoverageFields, { validate as validateCoverageDates } from '../_fields/custom-coverage';
import ContentTypeField from '../_fields/content-type';
import DetailsViewSection from '../../details-view-section';
import NavigationModal from '../../navigation-modal';
import ToggleSwitch from '../../toggle-switch/toggle-switch';
import Toaster from '../../toaster';
import styles from './custom-package-edit.css';

class CustomPackageEdit extends Component {
  static propTypes = {
    change: PropTypes.func,
    handleSubmit: PropTypes.func,
    initialValues: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
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
    // these are used above in getDerivedStateFromProps
    packageVisible: this.props.initialValues.isVisible, // eslint-disable-line react/no-unused-state
    initialValues: this.props.initialValues // eslint-disable-line react/no-unused-state
  }

  static getDerivedStateFromProps(nextProps, prevState) {
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

    if (wasPending && needsUpdate) {
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
      search: this.context.router.route.location.search,
      state: { eholdings: true }
    });
  }

  handleSelectionToggle = (e) => {
    this.setState({
      packageSelected: e.target.checked
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

    let actionMenuItems = [
      {
        label: <FormattedMessage id="ui-eholdings.package.actionMenu.cancelEditing" />,
        to: {
          pathname: `/eholdings/packages/${model.id}`,
          search: router.route.location.search,
          state: { eholdings: true }
        }
      }
    ];

    if (queryParams.searchType) {
      actionMenuItems.push({
        label: <FormattedMessage id="ui-eholdings.package.actionMenu.fullView" />,
        to: {
          pathname: `/eholdings/packages/${model.id}/edit`,
          state: { eholdings: true }
        },
        className: styles['full-view-link']
      });
    }

    return (
      <div>
        <Toaster toasts={processErrors(model)} position="bottom" />
        <DetailsView
          type="package"
          model={model}
          paneTitle={model.name}
          actionMenuItems={actionMenuItems}
          bodyContent={(
            <form onSubmit={handleSubmit(this.handleOnSubmit)}>
              <DetailsViewSection
                label={intl.formatMessage({ id: 'ui-eholdings.package.packageInformation' })}
              >
                {packageSelected ? (
                  <NameField />
               ) : (
                 <KeyValue label={<FormattedMessage id="ui-eholdings.package.name" />}>
                   <div data-test-eholdings-package-readonly-name-field>
                     {model.name}
                   </div>
                 </KeyValue>

               )}
                {packageSelected ? (
                  <ContentTypeField />
               ) : (
                 <KeyValue label={<FormattedMessage id="ui-eholdings.package.contentType" />}>
                   <div data-test-eholdings-package-details-readonly-content-type>
                     {model.contentType}
                   </div>
                 </KeyValue>
               )}
              </DetailsViewSection>
              <DetailsViewSection
                label={intl.formatMessage({ id: 'ui-eholdings.package.holdingStatus' })}
              >
                <label
                  data-test-eholdings-package-details-selected
                  htmlFor="custom-package-details-toggle-switch"
                >
                  <h4>{packageSelected ?
                    (<FormattedMessage id="ui-eholdings.selected" />)
                    :
                    (<FormattedMessage id="ui-eholdings.notSelected" />)}
                  </h4>
                  <br />

                  <Field
                    name="isSelected"
                    component={ToggleSwitch}
                    checked={packageSelected}
                    onChange={this.handleSelectionToggle}
                    id="custom-package-details-toggle-switch"
                  />
                </label>
              </DetailsViewSection>
              <DetailsViewSection label={intl.formatMessage({ id: 'ui-eholdings.package.packageSettings' })}>
                {packageSelected ? (
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
                              label={
                                intl.formatMessage(
                                  { id: 'ui-eholdings.package.visibility.no' },
                                  { visibilityMessage }
                                )
                              }
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
                ) : (
                  <p><FormattedMessage id="ui-eholdings.package.packageSettings.notSelected" /></p>
                )}
              </DetailsViewSection>

              <DetailsViewSection
                label={intl.formatMessage({ id: 'ui-eholdings.package.coverageDates' })}
              >
                {packageSelected ? (
                  <CoverageFields
                    initialValue={initialValues.customCoverages}
                  />) : (
                    <p><FormattedMessage id="ui-eholdings.package.customCoverage.notSelected" /></p>
                )}
              </DetailsViewSection>

              <div className={styles['package-edit-action-buttons']}>
                <div
                  data-test-eholdings-package-cancel-button
                >
                  <Button
                    disabled={model.update.isPending}
                    type="button"
                    onClick={this.handleCancel}
                  >
                    <FormattedMessage id="ui-eholdings.cancel" />
                  </Button>
                </div>
                <div
                  data-test-eholdings-package-save-button
                >
                  <Button
                    disabled={pristine || model.update.isPending}
                    type="submit"
                    buttonStyle="primary"
                  >
                    {model.update.isPending ?
                    (<FormattedMessage id="ui-eholdings.saving" />)
                    :
                    (<FormattedMessage id="ui-eholdings.save" />)}
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
          label={intl.formatMessage({ id: 'ui-eholdings.package.modalMessageHeader.isCustom' })}
          id="eholdings-package-confirmation-modal"
          footer={(
            <ModalFooter
              primaryButton={{
                'label': intl.formatMessage({ id: 'ui-eholdings.package.modalMessageButtonConfirm.isCustom' }),
                'onClick': this.commitSelectionToggle,
                'data-test-eholdings-package-deselection-confirmation-modal-yes': true
              }}
              secondaryButton={{
                'label': intl.formatMessage({ id: 'ui-eholdings.package.modalMessageButtonCancel.isCustom' }),
                'onClick': this.cancelSelectionToggle,
                'data-test-eholdings-package-deselection-confirmation-modal-no': true
              }}
            />
          )}
        >
          <FormattedMessage id="ui-eholdings.package.modalMessageBody.isCustom" />
        </Modal>
      </div>
    );
  }
}

const validate = (values, props) => {
  return Object.assign({}, validatePackageName(values), validateCoverageDates(values, props));
};

export default injectIntl(reduxForm({
  validate,
  form: 'CustomPackageEdit',
  enableReinitialize: true,
  destroyOnUnmount: false,
})(CustomPackageEdit));
