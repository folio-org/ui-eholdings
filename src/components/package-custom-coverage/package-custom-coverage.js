import React, { Component } from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames/bind';

import {
  Button,
  Datepicker,
  Icon,
  IconButton
} from '@folio/stripes-components';
import KeyValueLabel from '../key-value-label';
import styles from './package-custom-coverage.css';
import { formatISODateWithoutTime } from '../utilities';

const cx = classNames.bind(styles);

class PackageCustomCoverage extends Component {
  static propTypes = {
    initialValues: PropTypes.shape({
      customCoverages: PropTypes.array
    }).isRequired,
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

  renderCoverageFields = ({ fields }) => {
    return (
      <div>
        {fields.length === 0 ? (
          <div>
            <p data-test-eholdings-custom-coverage-no-rows-left>
              No date range set. Saving will remove custom coverage.
            </p>
            <div
              className={styles['custom-coverage-add-row-button']}
              data-test-eholdings-custom-coverage-add-row-button
            >
              <Button
                disabled={this.props.isPending}
                type="button"
                role="button"
                onClick={() => fields.push({})}
              >
                + Add date range
              </Button>
            </div>
          </div>
        ) : (
          <ul className={styles['custom-coverage-date-range-rows']}>
            {fields.map((dateRange, index) => (
              <li
                data-test-eholdings-custom-coverage-date-range-row
                key={index}
                className={styles['custom-coverage-date-range-row']}
              >
                <div
                  data-test-eholdings-custom-coverage-date-range-begin
                  className={styles['custom-coverage-datepicker']}
                >
                  <Field
                    name={`${dateRange}.beginCoverage`}
                    type="text"
                    component={Datepicker}
                    label="Start date"
                  />
                </div>
                <div
                  data-test-eholdings-custom-coverage-date-range-end
                  className={styles['custom-coverage-datepicker']}
                >
                  <Field
                    name={`${dateRange}.endCoverage`}
                    type="text"
                    component={Datepicker}
                    label="End date"
                  />
                </div>

                <div
                  data-test-eholdings-custom-coverage-remove-row-button
                  className={styles['custom-coverage-date-range-clear-row']}
                >
                  <IconButton
                    disabled={this.props.isPending}
                    icon="hollowX"
                    onClick={() => fields.remove(index)}
                    size="small"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

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

  render() {
    let { pristine, isPending, handleSubmit, onSubmit } = this.props;
    let { intl } = this.context;
    let contents;
    let { customCoverages } = this.props.initialValues;

    if (this.state.isEditing) {
      contents = (
        <form
          data-test-eholdings-custom-coverage-form
          onSubmit={handleSubmit(onSubmit)}
        >
          <FieldArray name="customCoverages" component={this.renderCoverageFields} />
          <div className={styles['custom-coverage-action-buttons']}>
            <div
              data-test-eholdings-package-details-cancel-custom-coverage-button
              className={styles['custom-coverage-action-button']}
            >
              <Button
                disabled={isPending}
                type="button"
                role="button"
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
                role="button"
                marginBottom0 // gag
              >
                {isPending ? 'Saving' : 'Save' }
              </Button>
            </div>
            {isPending && (
              <Icon icon="spinner-ellipsis" />
            )}
          </div>
        </form>
      );
    } else if (customCoverages.length && customCoverages[0].beginCoverage !== '') {
      contents = (
        <div className={styles['custom-coverage-date-display']}>
          <KeyValueLabel label="Custom">
            <div data-test-eholdings-package-details-custom-coverage-display className={styles['custom-coverage-dates']}>
              {formatISODateWithoutTime(customCoverages[0].beginCoverage, intl)} - {formatISODateWithoutTime(customCoverages[0].endCoverage, intl) || 'Present'}
            </div>
          </KeyValueLabel>
          <div data-test-eholdings-package-details-edit-custom-coverage-button>
            <IconButton icon="edit" onClick={this.handleEditCustomCoverage} />
          </div>
        </div>
      );
    } else {
      contents = (
        <div data-test-eholdings-package-details-custom-coverage-button>
          <Button
            type="button"
            onClick={this.handleEditCustomCoverage}
          >
            Set custom coverage
          </Button>
        </div>
      );
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

// this function is a special function used by redux-form for form validation
// the values from the from are passed into this function and then
// validated based on the matching field with the same 'name' as value
function validate(values, props) {
  moment.locale(props.locale);
  let dateFormat = moment.localeData()._longDateFormat.L;
  const errors = {};

  values.customCoverages.forEach((dateRange, index) => {
    let dateRangeErrors = {};

    if (!dateRange.beginCoverage || !moment(dateRange.beginCoverage).isValid()) {
      dateRangeErrors.beginCoverage = `Enter date in ${dateFormat} format.`;
    }

    if (dateRange.endCoverage && moment(dateRange.beginCoverage).isAfter(moment(dateRange.endCoverage))) {
      dateRangeErrors.beginCoverage = 'Start date must be before end date.';
    }

    errors[index] = dateRangeErrors;
  });

  return { customCoverages: errors };
}

export default reduxForm({
  validate,
  enableReinitialize: true,
  form: 'PackageCustomCoverage',
  destroyOnUnmount: false
})(PackageCustomCoverage);
