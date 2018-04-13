import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames/bind';

import {
  Button,
  IconButton,
  KeyValue
} from '@folio/stripes-components';

import CoverageFields, { validate as validateCoverage } from '../../_fields/custom-coverage';
import InlineForm from '../../../inline-form';
import styles from './package-custom-coverage.css';
import { formatISODateWithoutTime } from '../../../utilities';

const cx = classNames.bind(styles);

class PackageCustomCoverage extends Component {
  static propTypes = {
    initialValues: PropTypes.shape({
      customCoverages: PropTypes.array
    }).isRequired,
    isEditable: PropTypes.bool,
    onEdit: PropTypes.func,
    handleSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    initialize: PropTypes.func,
    isPending: PropTypes.bool,
    locale: PropTypes.string // eslint-disable-line react/no-unused-prop-types
  }

  static contextTypes = {
    intl: PropTypes.object
  }

  state = {
    isEditing: !!this.props.isEditable
  }

  componentWillReceiveProps(nextProps) {
    let wasPending = this.props.isPending && !nextProps.isPending;
    let needsUpdate = !isEqual(this.props.initialValues, nextProps.initialValues);

    if (wasPending || needsUpdate) {
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

  handleCancel = (event) => {
    event.preventDefault();
    this.toggleEditing(false);
    this.props.initialize(this.props.initialValues);
  }

  renderEditingForm() {
    let {
      handleSubmit,
      onSubmit,
      pristine,
      isPending,
    } = this.props;

    return (
      <InlineForm
        data-test-eholdings-custom-coverage-form
        onSubmit={handleSubmit(onSubmit)}
        onCancel={this.handleCancel}
        pristine={pristine}
        isPending={isPending}
      >
        <CoverageFields />
      </InlineForm>
    );
  }

  renderCoverageDates() {
    let { customCoverages } = this.props.initialValues;
    let { intl } = this.context;

    return (
      <div className={styles['custom-coverage-date-display']}>
        <KeyValue label="Custom">
          <div data-test-eholdings-package-details-custom-coverage-display className={styles['custom-coverage-dates']}>
            {formatISODateWithoutTime(customCoverages[0].beginCoverage, intl)} - {formatISODateWithoutTime(customCoverages[0].endCoverage, intl) || 'Present'}
          </div>
        </KeyValue>
        <div data-test-eholdings-package-details-edit-custom-coverage-button>
          <IconButton icon="edit" onClick={this.handleEdit} />
        </div>
      </div>
    );
  }

  renderSetCoverageDates() {
    return (
      <div data-test-eholdings-package-details-custom-coverage-button>
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
        data-test-eholdings-package-custom-coverage-form
        className={cx(styles['custom-coverage-form'], {
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
  form: 'PackageCustomCoverage',
  destroyOnUnmount: false
})(PackageCustomCoverage);
