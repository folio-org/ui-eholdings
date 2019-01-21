import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Field,
  Form
} from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import createFocusDecorator from 'final-form-focus';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Button,
  Headline,
  Icon,
  KeyValue,
  Modal,
  ModalFooter,
  RadioButton,
} from '@folio/stripes/components';

import { processErrors } from '../../utilities';

import DetailsView from '../../details-view';
import NameField from '../_fields/name';
import CoverageFields from '../_fields/custom-coverage';
import ContentTypeField from '../_fields/content-type';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import PaneHeaderButton from '../../pane-header-button';
import SelectionStatus from '../selection-status';
import ProxySelectField from '../../proxy-select';
import FullViewLink from '../../full-view-link';
import styles from './custom-package-edit.css';

const focusOnErrors = createFocusDecorator();

export default class CustomPackageEdit extends Component {
  static propTypes = {
    addPackageToHoldings: PropTypes.func.isRequired,
    fullViewLink: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    initialValues: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
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

  cancelSelectionToggle = (change) => {
    this.setState({
      showSelectionModal: false,
      packageSelected: true,
    }, () => {
      change('isSelected', true);
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

  getActionMenu = ({ onToggle }) => {
    const {
      fullViewLink,
      onCancel
    } = this.props;

    const { packageSelected } = this.state;

    return (
      <Fragment>
        <Button
          data-test-eholdings-package-cancel-action
          buttonStyle="dropdownItem fullWidth"
          onClick={() => {
            onToggle();
            onCancel();
          }}
        >
          <FormattedMessage id="ui-eholdings.actionMenu.cancelEditing" />
        </Button>

        {fullViewLink && (
          <FullViewLink to={fullViewLink} />
        )}

        {packageSelected && (
          <Button
            data-test-eholdings-package-remove-from-holdings-action
            buttonStyle="dropdownItem fullWidth"
            onClick={() => {
              onToggle();
              this.handleDeleteAction();
            }}
          >
            <FormattedMessage id="ui-eholdings.package.deletePackage" />
          </Button>
        )}
      </Fragment>
    );
  }

  render() {
    let {
      model,
      initialValues,
      proxyTypes,
      provider
    } = this.props;

    let {
      showSelectionModal,
      packageSelected,
      sections,
    } = this.state;

    let visibilityMessage = model.visibilityData.reason && `(${model.visibilityData.reason})`;

    return (
      <Form
        onSubmit={this.handleOnSubmit}
        decorators={[focusOnErrors]}
        mutators={{ ...arrayMutators }}
        initialValues={initialValues}
        render={({ handleSubmit, pristine, form: { change } }) => (
          <div>
            <Toaster toasts={processErrors(model)} position="bottom" />
            <form onSubmit={handleSubmit}>
              <DetailsView
                type="package"
                model={model}
                paneTitle={model.name}
                actionMenu={this.getActionMenu}
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
                            <fieldset
                              data-test-eholdings-package-visibility-field
                              className={styles['visibility-radios']}
                            >
                              <Headline tag="legend" size="small" margin="x-large">
                                <FormattedMessage id="ui-eholdings.package.visibility" />
                              </Headline>

                              <Field
                                component={RadioButton}
                                format={value => value.toString()}
                                label={<FormattedMessage id="ui-eholdings.yes" />}
                                name="isVisible"
                                parse={value => value === 'true'}
                                type="radio"
                                value="true"
                              />

                              <Field
                                component={RadioButton}
                                format={value => value.toString()}
                                label={
                                  <FormattedMessage
                                    id="ui-eholdings.package.visibility.no"
                                    values={{ visibilityMessage }}
                                  />
                                }
                                name="isVisible"
                                parse={value => value === 'true'}
                                type="radio"
                                value="false"
                              />

                            </fieldset>
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
                          initial={initialValues.customCoverages}
                        />) : (
                          <p><FormattedMessage id="ui-eholdings.package.customCoverage.notSelected" /></p>
                      )}
                    </Accordion>
                  </Fragment>
                )}
              />
            </form>

            <NavigationModal when={!pristine && !model.update.isPending && !model.update.isResolved} />

            <Modal
              open={showSelectionModal}
              size="small"
              label={<FormattedMessage id="ui-eholdings.package.modal.header.isCustom" />}
              id="eholdings-package-confirmation-modal"
              footer={(
                <ModalFooter>
                  <Button
                    data-test-eholdings-package-deselection-confirmation-modal-yes
                    buttonStyle="primary"
                    disabled={model.destroy.isPending}
                    onClick={this.commitSelectionToggle}
                  >
                    {(model.destroy.isPending ?
                      <FormattedMessage id="ui-eholdings.package.modal.buttonWorking.isCustom" /> :
                      <FormattedMessage id="ui-eholdings.package.modal.buttonConfirm.isCustom" />)}
                  </Button>
                  <Button
                    data-test-eholdings-package-deselection-confirmation-modal-no
                    onClick={() => this.cancelSelectionToggle(change)}
                  >
                    <FormattedMessage id="ui-eholdings.package.modal.buttonCancel.isCustom" />
                  </Button>
                </ModalFooter>
              )}
            >
              <FormattedMessage id="ui-eholdings.package.modal.body.isCustom" />
            </Modal>
          </div>
        )}
      />
    );
  }
}
