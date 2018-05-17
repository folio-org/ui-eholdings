import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import isEqual from 'lodash/isEqual';

import {
  Button,
  Icon,
  KeyValue
} from '@folio/stripes-components';
import { processErrors } from '../../utilities';

import DetailsView from '../../details-view';
import NameField, { validate as validatePackageName } from '../_fields/name';
import CoverageFields, { validate as validateCoverageDates } from '../_fields/custom-coverage';
import ContentTypeField from '../_fields/content-type';
import DetailsViewSection from '../../details-view-section';
import NavigationModal from '../../navigation-modal';
import ToggleSwitch from '../../toggle-switch/toggle-switch';
import Modal from '../../modal/modal';
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
    packageVisible: this.props.initialValues.isVisible,
    formValues: {}
  }

  componentWillReceiveProps(nextProps) {
    let wasPending = this.props.model.update.isPending && !nextProps.model.update.isPending;
    let needsUpdate = !isEqual(this.props.model, nextProps.model);
    let { router } = this.context;

    if ((nextProps.initialValues.isSelected !== this.props.initialValues.isSelected) ||
    (nextProps.initialValues.isVisible !== this.props.initialValues.isVisible)) {
      this.setState({
        ...this.state,
        packageSelected: nextProps.initialValues.isSelected,
        packageVisible: nextProps.initialValues.isVisible
      });
    }

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

  handleVisibilityToggle = (e) => {
    this.setState({
      packageVisible: e.target.checked
    });
  }

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
    } = this.props;

    let {
      showSelectionModal,
      packageSelected,
      packageVisible
    } = this.state;

    let {
      queryParams,
      router
    } = this.context;

    let actionMenuItems = [
      {
        label: 'Cancel editing',
        to: {
          pathname: `/eholdings/packages/${model.id}`,
          search: router.route.location.search,
          state: { eholdings: true }
        }
      }
    ];

    if (queryParams.searchType) {
      actionMenuItems.push({
        label: 'Full view',
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
                label="Package information"
              >
                {packageSelected ? (
                  <NameField />
               ) : (
                 <KeyValue label="Name">
                   <div data-test-eholdings-package-readonly-name-field>
                     {model.name}
                   </div>
                 </KeyValue>

               )}
                {packageSelected ? (
                  <ContentTypeField />
               ) : (
                 <KeyValue label="Content type">
                   <div data-test-eholdings-package-details-readonly-content-type>
                     {model.contentType}
                   </div>
                 </KeyValue>
               )}
              </DetailsViewSection>
              <DetailsViewSection
                label="Holding status"
              >
                <label
                  data-test-eholdings-package-details-selected
                  htmlFor="custom-package-details-toggle-switch"
                >
                  <h4>{packageSelected ? 'Selected' : 'Not selected'}</h4>
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
              <DetailsViewSection label="Visibility">
                {packageSelected ? (
                  <div>
                    <label
                      data-test-eholdings-package-details-visible
                      htmlFor="custom-package-details-toggle-visible-switch"
                    >
                      <h4>
                        {packageVisible
                          ? 'Visible to patrons'
                          : 'Hidden from patrons'}
                      </h4>
                      <br />
                      <Field
                        name="isVisible"
                        component={ToggleSwitch}
                        checked={packageVisible}
                        onChange={this.handleVisibilityToggle}
                        id="custom-package-details-toggle-visible-switch"
                      />
                    </label>

                    {!packageVisible && (
                      <div data-test-eholdings-package-details-is-hidden-reason>
                        {model.visibilityData.reason}
                      </div>
                    )}
                  </div>
                ) : (
                  <p>Not shown to patrons.</p>
                )}
              </DetailsViewSection>

              <DetailsViewSection
                label="Coverage dates"
              >
                {packageSelected ? (
                  <CoverageFields
                    initialValue={initialValues.customCoverages}
                  />) : (
                    <p>Add the package to holdings to set custom coverage dates.</p>
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
                    Cancel
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
                    {model.update.isPending ? 'Saving' : 'Save'}
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
          label="Remove package from holdings?"
          scope="root"
          id="eholdings-package-confirmation-modal"
          footer={(
            <div>
              <Button
                buttonStyle="primary"
                onClick={this.commitSelectionToggle}
                data-test-eholdings-package-deselection-confirmation-modal-yes
              >
                Yes, remove
              </Button>
              <Button
                onClick={this.cancelSelectionToggle}
                data-test-eholdings-package-deselection-confirmation-modal-no
              >
                No, do not remove
              </Button>
            </div>
          )}
        >
           Are you sure you want to remove this package and all its titles from your holdings? All customizations will be lost.
        </Modal>
      </div>
    );
  }
}

const validate = (values, props) => {
  return Object.assign({}, validatePackageName(values), validateCoverageDates(values, props));
};

export default reduxForm({
  validate,
  form: 'CustomPackageEdit',
  enableReinitialize: true,
  destroyOnUnmount: false,
})(CustomPackageEdit);
