import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import isEqual from 'lodash/isEqual';

import Button from '@folio/stripes-components/lib/Button';
import Icon from '@folio/stripes-components/lib/Icon';
import IconButton from '@folio/stripes-components/lib/IconButton';

import CoverageStatementFields, { validate as validateCoverageStatement } from '../coverage-statement-fields';
import styles from './coverage-statement-form.css';

const cx = classNames.bind(styles);

class CoverageStatementForm extends Component {
  static propTypes = {
    initialValues: PropTypes.shape({
      coverageStatement: PropTypes.string
    }).isRequired,
    isEditable: PropTypes.bool,
    onEdit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    isPending: PropTypes.bool,
    handleSubmit: PropTypes.func,
    initialize: PropTypes.func,
    pristine: PropTypes.bool
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

  renderCoverageStatement() {
    const {
      coverageStatement
    } = this.props.initialValues;

    return (
      <div className={styles['coverage-statement-display']}>
        <span data-test-eholdings-customer-resource-coverage-statement-display>
          {coverageStatement}
        </span>
        <div data-test-eholdings-customer-resource-edit-coverage-statement-button>
          <IconButton icon="edit" onClick={this.handleEdit} />
        </div>
      </div>
    );
  }

  renderEditingForm() {
    let {
      pristine,
      isPending,
      handleSubmit,
      onSubmit
    } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          data-test-eholdings-customer-resource-coverage-statement-form
          className={styles['coverage-statement-form-editing']}
        >
          <CoverageStatementFields />
          <div className={styles['coverage-statement-action-buttons']}>
            <div
              data-test-eholdings-customer-resource-cancel-coverage-statement-button
              className={styles['coverage-statement-action-button']}
            >
              <Button
                disabled={isPending}
                type="button"
                role="button"
                onClick={this.handleCancel}
                marginBottom0 // gag
              >
                Cancel
              </Button>
            </div>
            <div
              data-test-eholdings-customer-resource-save-coverage-statement-button
              className={styles['coverage-statement-action-button']}
            >
              <Button
                disabled={pristine || isPending}
                type="submit"
                role="button"
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
  }

  renderSetCoverage() {
    return (
      <div data-test-eholdings-customer-resource-add-coverage-statement-button>
        <Button
          type="button"
          onClick={this.handleEdit}
        >
          Set coverage statement
        </Button>
      </div>
    );
  }

  render() {
    let {
      isEditable = this.state.isEditing
    } = this.props;
    const {
      coverageStatement
    } = this.props.initialValues;
    let contents;

    if (isEditable) {
      contents = this.renderEditingForm();
    } else if (coverageStatement) {
      contents = this.renderCoverageStatement();
    } else {
      contents = this.renderSetCoverage();
    }

    return (
      <div
        data-test-eholdings-embargo-form
        className={cx(styles['coverage-statement-form'], {
          'is-editing': isEditable
        })}
      >
        {contents}
      </div>
    );
  }
}

const validate = (values) => {
  return validateCoverageStatement(values);
};

export default reduxForm({
  validate,
  enableReinitialize: true,
  form: 'CoverageStatement',
  destroyOnUnmount: false
})(CoverageStatementForm);
