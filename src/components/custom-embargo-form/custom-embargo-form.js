import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import isEqual from 'lodash/isEqual';

import {
  Button,
  IconButton,
  KeyValue
} from '@folio/stripes-components';

import CustomEmbargoFields, { validate as validateEmbargo } from '../custom-embargo-fields';
import InlineForm from '../inline-form';
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

  handleEdit = (e) => {
    e.preventDefault();
    this.toggleEditing(true);
  }

  handleCancel = (e) => {
    e.preventDefault();
    this.toggleEditing(false);
    this.props.initialize(this.props.initialValues);
  }

  renderEditingForm() {
    let {
      change,
      pristine,
      isPending,
      handleSubmit,
      onSubmit
    } = this.props;

    return (
      <InlineForm
        data-test-eholdings-custom-coverage-form
        onSubmit={handleSubmit(onSubmit)}
        onCancel={this.handleCancel}
        pristine={pristine}
        isPending={isPending}
      >
        <CustomEmbargoFields change={change} />
      </InlineForm>
    );
  }

  renderEmbargo() {
    const {
      customEmbargoValue,
      customEmbargoUnit
    } = this.props.initialValues;

    return (
      <div className={styles['custom-embargo-display']}>
        <KeyValue label="Custom">
          <span data-test-eholdings-customer-resource-custom-embargo-display>
            {customEmbargoValue} {customEmbargoUnit}
          </span>
        </KeyValue>
        <div data-test-eholdings-customer-resource-edit-custom-embargo-button>
          <IconButton icon="edit" onClick={this.handleEdit} />
        </div>
      </div>
    );
  }

  renderSetEmbargo() {
    return (
      <div data-test-eholdings-customer-resource-add-custom-embargo-button>
        <Button
          type="button"
          onClick={this.handleEdit}
        >
          Set custom embargo period
        </Button>
      </div>
    );
  }

  render() {
    let {
      isEditable = this.state.isEditing
    } = this.props;
    const {
      customEmbargoValue,
      customEmbargoUnit
    } = this.props.initialValues;
    let contents;

    if (isEditable) {
      contents = this.renderEditingForm();
    } else if (customEmbargoValue && customEmbargoUnit) {
      contents = this.renderEmbargo();
    } else {
      contents = this.renderSetEmbargo();
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
