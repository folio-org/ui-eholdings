import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import isEqual from 'lodash/isEqual';

import {
  Button,
  Icon,
  IconButton,
  KeyValue
} from '@folio/stripes-components';

import CustomEmbargoFields, { validate as validateEmbargo } from '../custom-embargo-fields';
import styles from './custom-embargo-form.css';

const cx = classNames.bind(styles);

class CustomEmbargoForm extends Component {
  static propTypes = {
    initialValues: PropTypes.shape({
      customEmbargoValue: PropTypes.number,
      customEmbargoUnit: PropTypes.string
    }).isRequired,
    isEditable: PropTypes.bool,
    onEdit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    isPending: PropTypes.bool,
    handleSubmit: PropTypes.func,
    initialize: PropTypes.func,
    pristine: PropTypes.bool,
    change: PropTypes.func
  };

  state = {
    isEditing: !!this.props.isEditable
  };

  componentWillReceiveProps(nextProps) {
    let wasPending = this.props.isPending && !nextProps.isPending;
    let needsUpdate = !isEqual(this.props.initialValues, nextProps.initialValues);

    if (wasPending && needsUpdate) {
      this.toggleEditing(false);
    }
  }

  toggleEditing(isEditing = !this.state.isEditing) {
    if (this.props.onEdit) {
      this.props.onEdit(isEditing);
    } else {
      this.setState({ isEditing });
    }
  }

  handleEditCustomEmbargo = (e) => {
    e.preventDefault();
    this.toggleEditing(true);
  }

  handleCancelCustomEmbargo = (e) => {
    e.preventDefault();
    this.toggleEditing(false);
    this.props.initialize(this.props.initialValues);
  }

  render() {
    let {
      pristine,
      isPending,
      isEditable = this.state.isEditing,
      change,
      handleSubmit,
      onSubmit
    } = this.props;
    const {
      customEmbargoValue,
      customEmbargoUnit
    } = this.props.initialValues;
    let contents;

    if (isEditable) {
      contents = (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            data-test-eholdings-customer-resource-custom-embargo-form
            className={styles['custom-embargo-form-editing']}
          >
            <CustomEmbargoFields change={change} />
            <div className={styles['custom-embargo-action-buttons']}>
              <div
                data-test-eholdings-customer-resource-cancel-custom-embargo-button
                className={styles['custom-embargo-action-button']}
              >
                <Button
                  disabled={isPending}
                  type="button"
                  onClick={this.handleCancelCustomEmbargo}
                  marginBottom0 // gag
                >
                  Cancel
                </Button>
              </div>
              <div
                data-test-eholdings-customer-resource-save-custom-embargo-button
                className={styles['custom-embargo-action-button']}
              >
                <Button
                  disabled={pristine || isPending}
                  type="submit"
                  buttonStyle="primary"
                  marginBottom0 // gag
                >
                  {isPending ? 'Saving' : 'Save'}
                </Button>
              </div>
              {isPending && (
                <Icon icon="spinner-ellipsis" />
              )}
            </div>
          </div>
        </form>
      );
    } else if (customEmbargoValue && customEmbargoUnit) {
      contents = (
        <div className={styles['custom-embargo-display']}>
          <KeyValue label="Custom">
            <span data-test-eholdings-customer-resource-custom-embargo-display>
              {customEmbargoValue} {customEmbargoUnit}
            </span>
          </KeyValue>
          <div data-test-eholdings-customer-resource-edit-custom-embargo-button>
            <IconButton icon="edit" onClick={this.handleEditCustomEmbargo} />
          </div>
        </div>
      );
    } else {
      contents = (
        <div data-test-eholdings-customer-resource-add-custom-embargo-button>
          <Button
            type="button"
            onClick={this.handleEditCustomEmbargo}
          >
            Set custom embargo period
          </Button>
        </div>
      );
    }

    return (
      <div
        data-test-eholdings-embargo-form
        className={cx(styles['custom-embargo-form'], {
          'is-editing': isEditable
        })}
      >
        {contents}
      </div>
    );
  }
}

const validate = (values) => {
  return validateEmbargo(values);
};

export default reduxForm({
  validate,
  enableReinitialize: true,
  form: 'CustomEmbargo',
  destroyOnUnmount: false
})(CustomEmbargoForm);
