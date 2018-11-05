import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { reduxForm, Field } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';

import {
  Accordion,
  Headline,
  Icon,
  KeyValue,
  Modal,
  ModalFooter,
  RadioButton,
  RadioButtonGroup
} from '@folio/stripes/components';

import { processErrors } from '../../utilities';

import DetailsView from '../../details-view';
import NameField, { validate as validatePackageName } from '../_fields/name';
import CoverageFields, { validate as validateCoverageDates } from '../_fields/custom-coverage';
import ContentTypeField from '../_fields/content-type';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import PaneHeaderButton from '../../pane-header-button';
import SelectionStatus from '../selection-status';
import ProxySelectField from '../../proxy-select';
import styles from './custom-package-edit.css';

class CustomPackageEdit extends Component {
  static propTypes = {
    addPackageToHoldings: PropTypes.func.isRequired,
    change: PropTypes.func,
    fullViewLink: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    handleSubmit: PropTypes.func,
    initialValues: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    provider: PropTypes.object.isRequired,
    proxyTypes: PropTypes.object.isRequired
  };

  state = {
    showSelectionModal: false,
    allowFormToSubmit: false,
    packageSelected: this.props.initialValues.isSelected,
    formValues: {},
    initialValues: this.props.initialValues,
    sections: {
      packageHoldingStatus: true,
      packageInfo: true,
      packageSettings: true,
      packageCoverageSettings: true,
    }
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
        packageSelected: nextProps.initialValues.isSelected
      });
    }

    return stateUpdates;
  }

  handleDeleteAction = () => {
    this.setState({
      formValues: {
        isSelected: false
      }
    }, () => this.handleOnSubmit(this.state.formValues));
  };

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
  };

  toggleSection = ({ id: sectionId }) => {
    this.setState((prevState) => {
      const { sections } = prevState;
      const sectionIsExpanded = sections[sectionId];
      return {
        sections: {
          ...sections,
          [sectionId]: !sectionIsExpanded
        }
      };
    });
  };

  toggleAllSections = (sections) => {
    this.setState({ sections });
  };

  getSectionHeader(translationKey) {
    return (
      <Headline
        size="large"
        tag="h3"
      >
        <FormattedMessage id={translationKey} />
      </Headline>
    );
  }

  render() {
    let {
      model,
      initialValues,
      handleSubmit,
      pristine,
      proxyTypes,
      provider,
      onCancel,
      fullViewLink
    } = this.props;

    let {
      showSelectionModal,
      packageSelected,
      sections,
    } = this.state;

    let visibilityMessage = model.visibilityData.reason && `(${model.visibilityData.reason})`;

    let actionMenuItems = [
      {
        'label': <FormattedMessage id="ui-eholdings.actionMenu.cancelEditing" />,
        'onClick': onCancel,
        'data-test-eholdings-package-cancel-action': true
      }
    ];

    if (fullViewLink) {
      actionMenuItems.push({
        label: <FormattedMessage id="ui-eholdings.actionMenu.fullView" />,
        to: fullViewLink,
        className: styles['full-view-link']
      });
    }

    if (packageSelected) {
      actionMenuItems.push({
        'label': <FormattedMessage id="ui-eholdings.package.deletePackage" />,
        'state': { eholdings: true },
        'data-test-eholdings-package-remove-from-holdings-action': true,
        'onClick': this.handleDeleteAction
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
            handleExpandAll={this.toggleAllSections}
            sections={sections}
            lastMenu={(
              <Fragment>
                {model.update.isPending && (
                  <Icon icon="spinner-ellipsis" />
                )}
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
              </Fragment>
            )}
            bodyContent={(
              <Fragment>
                <Accordion
                  label={this.getSectionHeader('ui-eholdings.label.holdingStatus')}
                  open={sections.packageHoldingStatus}
                  id="packageHoldingStatus"
                  onToggle={this.toggleSection}
                >
                  <SelectionStatus
                    model={model}
                    onAddToHoldings={this.props.addPackageToHoldings}
                  />
                </Accordion>

                <Accordion
                  label={this.getSectionHeader('ui-eholdings.label.packageInformation')}
                  open={sections.packageInfo}
                  id="packageInfo"
                  onToggle={this.toggleSection}
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
                </Accordion>

                <Accordion
                  label={this.getSectionHeader('ui-eholdings.package.packageSettings')}
                  open={sections.packageSettings}
                  id="packageSettings"
                  onToggle={this.toggleSection}
                >
                  {packageSelected ? (
                    <div className={styles['visibility-radios']}>
                      {this.props.initialValues.isVisible != null ? (
                        <Fragment>
                          <div data-test-eholdings-package-visibility-field>
                            <Field
                              label={<FormattedMessage id="ui-eholdings.package.visibility" />}
                              name="isVisible"
                              component={RadioButtonGroup}
                            >
                              <RadioButton label={<FormattedMessage id="ui-eholdings.yes" />} value="true" />
                              <RadioButton
                                label={
                                  <FormattedMessage
                                    id="ui-eholdings.package.visibility.no"
                                    values={{ visibilityMessage }}
                                  />
                                }
                                value="false"
                              />
                            </Field>
                          </div>
                        </Fragment>
                      ) : (
                        <div
                          data-test-eholdings-package-details-visibility
                          htmlFor="managed-package-details-visibility-switch"
                        >
                          <Icon icon="spinner-ellipsis" />
                        </div>

                      )}
                      {(proxyTypes.request.isResolved && provider.data.isLoaded) ? (
                        <div data-test-eholdings-package-proxy-select-field>
                          <ProxySelectField
                            proxyTypes={proxyTypes}
                            inheritedProxyId={provider.proxy.id}
                          />
                        </div>
                      ) : (
                        <Icon icon="spinner-ellipsis" />
                      )}
                    </div>
                  ) : (
                    <p><FormattedMessage id="ui-eholdings.package.packageSettings.notSelected" /></p>
                  )}
                </Accordion>

                <Accordion
                  label={this.getSectionHeader('ui-eholdings.package.coverageSettings')}
                  open={sections.packageCoverageSettings}
                  id="packageCoverageSettings"
                  onToggle={this.toggleSection}
                >
                  {packageSelected ? (
                    <CoverageFields
                      initialValue={initialValues.customCoverages}
                    />) : (
                      <p><FormattedMessage id="ui-eholdings.package.customCoverage.notSelected" /></p>
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
          label={<FormattedMessage id="ui-eholdings.package.modal.header.isCustom" />}
          id="eholdings-package-confirmation-modal"
          footer={(
            <ModalFooter
              primaryButton={{
                'label': model.destroy.isPending ?
                  <FormattedMessage id="ui-eholdings.package.modal.buttonWorking.isCustom" /> :
                  <FormattedMessage id="ui-eholdings.package.modal.buttonConfirm.isCustom" />,
                'onClick': this.commitSelectionToggle,
                'disabled': model.destroy.isPending,
                'data-test-eholdings-package-deselection-confirmation-modal-yes': true
              }}
              secondaryButton={{
                'label': <FormattedMessage id="ui-eholdings.package.modal.buttonCancel.isCustom" />,
                'onClick': this.cancelSelectionToggle,
                'data-test-eholdings-package-deselection-confirmation-modal-no': true
              }}
            />
          )}
        >
          <FormattedMessage id="ui-eholdings.package.modal.body.isCustom" />
        </Modal>
      </div>
    );
  }
}

const validate = (values, props) => {
  return Object.assign({}, validatePackageName(values), validateCoverageDates(values, props));
};


export default compose(
  injectIntl,
  reduxForm({
    validate,
    form: 'CustomPackageEdit',
    enableReinitialize: true,
    destroyOnUnmount: false,
  })
)(CustomPackageEdit);
