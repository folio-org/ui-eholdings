import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import isEqual from 'lodash/isEqual';

import {
  Button,
  Icon,
} from '@folio/stripes-components';
import { processErrors } from '../../utilities';

import DetailsView from '../../details-view';
import CoverageFields, { validate as validateCoverageDates } from '../_fields/custom-coverage';
import DetailsViewSection from '../../details-view-section';
import NavigationModal from '../../navigation-modal';
import Toaster from '../../toaster';
import styles from './managed-package-edit.css';

class ManagedPackageEdit extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool
  };

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired
      }).isRequired
    }).isRequired,
    queryParams: PropTypes.object
  };

  componentWillReceiveProps(nextProps) {
    let wasPending = this.props.model.update.isPending && !nextProps.model.update.isPending;
    let needsUpdate = !isEqual(this.props.initialValues, nextProps.initialValues);
    let { router } = this.context;

    if (wasPending && needsUpdate) {
      router.history.push({
        pathname: `/eholdings/packages/${this.props.model.id}`,
        search: router.route.location.search,
        state: { eholdings: true }
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

  render() {
    let {
      model,
      initialValues,
      handleSubmit,
      onSubmit,
      pristine
    } = this.props;

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

    if (queryParams) {
      actionMenuItems.push({
        label: 'Full view',
        to: {
          pathname: `/eholdings/packages/${model.id}/edit`,
          state: { eholdings: true }
        }
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <DetailsViewSection
                label="Coverage dates"
              >
                <CoverageFields
                  initialValue={initialValues.customCoverages}
                />
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
      </div>
    );
  }
}

const validate = (values, props) => {
  return validateCoverageDates(values, props);
};

export default reduxForm({
  validate,
  enableReinitialize: true,
  form: 'ManagedPackageEdit',
  destroyOnUnmount: false,
})(ManagedPackageEdit);
