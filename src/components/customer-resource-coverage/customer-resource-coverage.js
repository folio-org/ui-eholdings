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

import CoverageDateList from '../coverage-date-list';
import CustomerResourceCoverageFields, { validate as validateCoverage } from '../customer-resource-coverage-fields';
import InlineForm from '../inline-form';
import styles from './customer-resource-coverage.css';

const cx = classNames.bind(styles);

class CustomerResourceCoverage extends Component {
  static propTypes = {
    initialValues: PropTypes.shape({
      customCoverages: PropTypes.array
    }).isRequired,
    packageCoverage: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
    isEditable: PropTypes.bool,
    onEdit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    isPending: PropTypes.bool,
    initialize: PropTypes.func,
    locale: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    intl: PropTypes.object // eslint-disable-line react/no-unused-prop-types
  };

  state = {
    isEditing: !!this.props.isEditable
  };

  componentWillReceiveProps(nextProps) {
    let wasPending = this.props.isPending && !nextProps.isPending;
    let needsUpdate = !isEqual(this.props.initialValues.customCoverages, nextProps.initialValues.customCoverages);

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
        <CustomerResourceCoverageFields />
      </InlineForm>
    );
  }

  renderCoverageDates() {
    let { customCoverages } = this.props.initialValues;

    return (
      <div
        className={styles['coverage-form-display']}
      >
        <KeyValue label="Custom">
          <span data-test-eholdings-coverage-form-display>
            <CoverageDateList
              coverageArray={customCoverages}
            />
          </span>
        </KeyValue>
        <div data-test-eholdings-coverage-form-edit-button>
          <IconButton icon="edit" onClick={this.handleEdit} />
        </div>
      </div>
    );
  }

  renderSetCoverageDates() {
    return (
      <div
        data-test-eholdings-coverage-form-add-button
      >
        <Button
          type="button"
          onClick={this.handleEdit}
        >
          Set custom coverage dates
        </Button>
      </div>
    );
  }

  render() {
    let {
      isEditable = this.state.isEditing
    } = this.props;
    let { customCoverages } = this.props.initialValues;
    let contents;

    if (isEditable) {
      contents = this.renderEditingForm();
    } else if (customCoverages.length && customCoverages[0].beginCoverage !== '') {
      contents = this.renderCoverageDates();
    } else {
      contents = this.renderSetCoverageDates();
    }

    return (
      <div
        data-test-eholdings-coverage-form
        className={cx(styles['coverage-form'], {
          'is-editing': isEditable
        })}
      >
        {contents}
      </div>
    );
  }
}

const validate = (values, props) => {
  return validateCoverage(values, props);
};

export default reduxForm({
  validate,
  enableReinitialize: true,
  form: 'Coverage',
  destroyOnUnmount: false
})(CustomerResourceCoverage);
