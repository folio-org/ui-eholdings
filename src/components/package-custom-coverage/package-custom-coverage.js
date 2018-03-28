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

import PackageCoverageFields, { validate as validateCoverage } from '../package-coverage-fields';
import styles from './package-custom-coverage.css';
import { formatISODateWithoutTime } from '../utilities';

const cx = classNames.bind(styles);

class PackageCustomCoverage extends Component {
  static propTypes = {
    initialValues: PropTypes.shape({
      customCoverages: PropTypes.array
    }).isRequired,
    isEditable: PropTypes.bool,
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
    isEditing: false
  }

  componentWillReceiveProps(nextProps) {
    let wasPending = this.props.isPending && !nextProps.isPending;
    let needsUpdate = !isEqual(this.props.initialValues, nextProps.initialValues);

    if (wasPending || needsUpdate) {
      this.setState({ isEditing: false });
    }
  }

  handleEditCustomCoverage = (event) => {
    let isEditing = !this.state.isEditing;
    event.preventDefault();
    this.setState({ isEditing });
  }

  handleCancelCustomCoverage = (event) => {
    event.preventDefault();
    this.setState({
      isEditing: false
    });
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
      <form
        data-test-eholdings-custom-coverage-form
        onSubmit={handleSubmit(onSubmit)}
      >
        <PackageCoverageFields />
        <div className={styles['custom-coverage-action-buttons']}>
          <div
            data-test-eholdings-package-details-cancel-custom-coverage-button
            className={styles['custom-coverage-action-button']}
          >
            <Button
              disabled={isPending}
              type="button"
              onClick={this.handleCancelCustomCoverage}
              marginBottom0 // gag
            >
              Cancel
            </Button>
          </div>
          <div
            data-test-eholdings-package-details-save-custom-coverage-button
            className={styles['custom-coverage-action-button']}
          >
            <Button
              disabled={pristine || isPending}
              type="submit"
              buttonStyle="primary"
              marginBottom0 // gag
            >
              {isPending ? 'Saving' : 'Save' }
            </Button>
          </div>
        </div>
      </form>
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
          <IconButton icon="edit" onClick={this.handleEditCustomCoverage} />
        </div>
      </div>
    );
  }

  renderSetCoverageDates() {
    return (
      <div data-test-eholdings-package-details-custom-coverage-button>
        <Button
          type="button"
          onClick={this.handleEditCustomCoverage}
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
    let contents;
    let { customCoverages } = this.props.initialValues;

    if (isEditable) {
      contents = this.renderEditingForm();
    } else if (customCoverages.length && customCoverages[0].beginCoverage !== '') {
      contents = this.renderCoverageDates();
    } else {
      contents = this.renderSetCoverageDates();
    }

    return (
      <div
        className={cx(styles['custom-coverage-form'], {
          'is-editing': this.state.isEditing
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
