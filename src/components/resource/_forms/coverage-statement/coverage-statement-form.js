import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import isEqual from 'lodash/isEqual';

import {
  Button,
  IconButton
} from '@folio/stripes-components';

import CoverageStatementFields, { validate as validateCoverageStatement } from '../../_fields/coverage-statement';
import InlineForm from '../../../inline-form';
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

  renderEditingForm() {
    let {
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
        <CoverageStatementFields />
      </InlineForm>
    );
  }

  renderCoverageStatement() {
    const {
      coverageStatement
    } = this.props.initialValues;

    return (
      <div className={styles['coverage-statement-display']}>
        <span data-test-eholdings-resource-coverage-statement-display>
          {coverageStatement}
        </span>
        <div data-test-eholdings-resource-edit-coverage-statement-button>
          <IconButton icon="edit" onClick={this.handleEdit} />
        </div>
      </div>
    );
  }

  renderSetCoverage() {
    return (
      <div data-test-eholdings-resource-add-coverage-statement-button>
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
        data-test-eholdings-resource-coverage-statement-form
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
