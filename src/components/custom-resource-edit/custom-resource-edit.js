import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import isEqual from 'lodash/isEqual';

import {
  Button,
  Icon
} from '@folio/stripes-components';
import { processErrors } from '../utilities';

import DetailsView from '../details-view';
import ResourceNameField, { validate as validateName } from '../resource-name-field';
import ResourceCoverageFields, { validate as validateCoverageDates } from '../resource-coverage-fields';
import CoverageStatementFields, { validate as validateCoverageStatement } from '../coverage-statement-fields';
import DetailsViewSection from '../details-view-section';
import NavigationModal from '../navigation-modal';
import Toaster from '../toaster';
import styles from './custom-resource-edit.css';

class CustomResourceEdit extends Component {
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
    }).isRequired
  };

  componentWillReceiveProps(nextProps) {
    let wasPending = this.props.model.update.isPending && !nextProps.model.update.isPending;
    let needsUpdate = !isEqual(this.props.initialValues, nextProps.initialValues);

    if (wasPending && needsUpdate) {
      this.context.router.history.push(
        `/eholdings/resources/${this.props.model.id}`,
        { eholdings: true }
      );
    }
  }

  handleCancel = () => {
    this.context.router.history.push(
      `/eholdings/resources/${this.props.model.id}`,
      { eholdings: true }
    );
  }

  render() {
    let {
      model,
      handleSubmit,
      onSubmit,
      pristine,
    } = this.props;

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
          paneTitle={model.name}
          paneSub={model.packageName}
          actionMenuItems={actionMenuItems}
          bodyContent={(
            <form onSubmit={handleSubmit(onSubmit)}>
              <DetailsViewSection
                label="Resource information"
              >
                <ResourceNameField />
              </DetailsViewSection>
              <DetailsViewSection
                label="Coverage dates"
              >
                <ResourceCoverageFields />
              </DetailsViewSection>
              <DetailsViewSection
                label="Coverage statement"
              >
                <CoverageStatementFields />
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
  return Object.assign({}, validateName(values), validateCoverageDates(values, props), validateCoverageStatement(values));
};

export default reduxForm({
  validate,
  enableReinitialize: true,
  form: 'CustomResourceEdit',
  destroyOnUnmount: false,
})(CustomResourceEdit);
