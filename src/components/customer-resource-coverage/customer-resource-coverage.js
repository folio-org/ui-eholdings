import React, { Component } from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames/bind';

import Datepicker from '@folio/stripes-components/lib/Datepicker';
import Button from '@folio/stripes-components/lib/Button';
import Icon from '@folio/stripes-components/lib/Icon';
import IconButton from '@folio/stripes-components/lib/IconButton';
import CoverageDateList from '../coverage-date-list';
import KeyValueLabel from '../key-value-label';
import styles from './customer-resource-coverage.css';

const cx = classNames.bind(styles);

class CustomerResourceCoverage extends Component {
  static propTypes = {
    initialValues: PropTypes.shape({
      customCoverages: PropTypes.array,
    }).isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    isPending: PropTypes.bool,
    initialize: PropTypes.func,
    locale: PropTypes.string // eslint-disable-line react/no-unused-prop-types
  };

  state = {
    isEditing: false,
  };

  componentWillReceiveProps(nextProps) {
    let wasPending = this.props.isPending && !nextProps.isPending;
    let needsUpdate = !isEqual(this.props.initialValues, nextProps.initialValues);

    if (wasPending || needsUpdate) {
      this.setState({ isEditing: false });
    }
  }

  handleEdit = (e) => {
    e.preventDefault();
    this.setState({ isEditing: true });
  }

  handleCancel = (e) => {
    e.preventDefault();
    this.setState({
      isEditing: false
    });
    this.props.initialize(this.props.initialValues);
  }

  renderDatepicker = ({ input, label, meta }) => {
    return (
      <Datepicker
        label={label}
        input={input}
        meta={meta}
      />
    );
  }

  renderCoverageFields = ({ fields }) => {
    return (
      <div>
        {fields.length === 0 ? (
          <p data-test-eholdings-coverage-form-no-rows-left>
            No date ranges set. Saving will remove all custom coverage.
          </p>
        ) : (
          <ul className={styles['coverage-form-date-range-rows']}>
            {fields.map((dateRange, index) => (
              <li
                data-test-eholdings-coverage-form-date-range-row
                key={index}
                className={styles['coverage-form-date-range-row']}
              >
                <div
                  data-test-eholdings-coverage-form-date-range-begin
                  className={styles['coverage-form-datepicker']}
                >
                  <Field
                    name={`${dateRange}.beginCoverage`}
                    type="text"
                    component={this.renderDatepicker}
                    label="Start date"
                  />
                </div>
                <div
                  data-test-eholdings-coverage-form-date-range-end
                  className={styles['coverage-form-datepicker']}
                >
                  <Field
                    name={`${dateRange}.endCoverage`}
                    type="text"
                    component={this.renderDatepicker}
                    label="End date"
                  />
                </div>

                <div
                  data-test-eholdings-coverage-form-remove-row-button
                  className={styles['coverage-form-date-range-clear-row']}
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

        <div
          className={styles['coverage-form-add-row-button']}
          data-test-eholdings-coverage-form-add-row-button
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
    );
  };

  render() {
    let { pristine, isPending, handleSubmit, onSubmit } = this.props;
    let { customCoverages } = this.props.initialValues;
    let contents;

    if (this.state.isEditing) {
      contents = (
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldArray name="customCoverages" component={this.renderCoverageFields} />
          <div className={styles['coverage-form-action-buttons']}>
            <div
              data-test-eholdings-coverage-form-cancel-button
              className={styles['coverage-form-action-button']}
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
              data-test-eholdings-coverage-form-save-button
              className={styles['coverage-form-action-button']}
            >
              <Button
                disabled={pristine || isPending}
                type="submit"
                role="button"
                buttonStyle="primary"
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
        <div
          className={styles['coverage-form-display']}
        >
          <KeyValueLabel label="Custom">
            <span data-test-eholdings-coverage-form-display>
              <CoverageDateList
                coverageArray={customCoverages}
              />
            </span>
          </KeyValueLabel>
          <div data-test-eholdings-coverage-form-edit-button>
            <IconButton icon="edit" onClick={this.handleEdit} />
          </div>
        </div>
      );
    } else {
      contents = (
        <div
          data-test-eholdings-coverage-form-add-button
          className={styles['coverage-form-add-button']}
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

    return (
      <div
        data-test-eholdings-coverage-form
        className={cx(styles['coverage-form'], {
          'is-editing': this.state.isEditing
        })}
      >
        <h4 className={styles['coverage-form-legend']}>Coverage dates</h4>
        {contents}
      </div>
    );
  }
}

const validate = (values, props) => {
  moment.locale(props.locale);
  let dateFormat = moment.localeData()._longDateFormat.L;
  let errors = [];

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
};

export default reduxForm({
  validate,
  enableReinitialize: true,
  form: 'Coverage',
  destroyOnUnmount: false
})(CustomerResourceCoverage);
