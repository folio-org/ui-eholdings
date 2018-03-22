import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import isEqual from 'lodash/isEqual';

import Button from '@folio/stripes-components/lib/Button';
import Icon from '@folio/stripes-components/lib/Icon';

import DetailsView from '../details-view';
import CustomEmbargoFields, { validate as validateEmbargo } from '../custom-embargo-fields';
import DetailsViewSection from '../details-view-section';
import NavigationModal from '../navigation-modal';
import styles from './customer-resource-edit.css';

class CustomerResourceEdit extends Component {
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
      this.context.router.history.push(`/eholdings/customer-resources/${this.props.model.id}`);
    }
  }

  handleCancel = () => {
    this.context.router.history.push(`/eholdings/customer-resources/${this.props.model.id}`);
  }

  render() {
    let {
      model,
      handleSubmit,
      onSubmit,
      pristine
    } = this.props;

    let actionMenuItems = [
      {
        label: 'Cancel Editing',
        to: `/eholdings/customer-resources/${model.id}`
      }
    ];

    return (
      <DetailsView
        type="resource"
        model={model}
        paneTitle={model.name}
        paneSub={model.packageName}
        actionMenuItems={actionMenuItems}
        bodyContent={(
          <form onSubmit={handleSubmit(onSubmit)}>
            <DetailsViewSection
              label="Embargo period"
            >
              <CustomEmbargoFields />
            </DetailsViewSection>
            <div className={styles['customer-resource-edit-action-buttons']}>
              <div
                data-test-eholdings-customer-resource-save-button
              >
                <Button
                  disabled={model.update.isPending}
                  type="button"
                  role="button"
                  onClick={this.handleCancel}
                >
                  Cancel
                </Button>
              </div>
              <div
                data-test-eholdings-customer-resource-cancel-button
              >
                <Button
                  disabled={pristine || model.update.isPending}
                  type="submit"
                  role="button"
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
    );
  }
}

const validate = (values) => {
  return validateEmbargo(values);
};

export default reduxForm({
  validate,
  enableReinitialize: true,
  form: 'CustomerResourceEdit',
  destroyOnUnmount: false,
})(CustomerResourceEdit);
