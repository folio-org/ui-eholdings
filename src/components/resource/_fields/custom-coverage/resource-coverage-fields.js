import React, { Component } from 'react';
import { Field, FieldArray } from 'redux-form';
import PropTypes from 'prop-types';
import moment from 'moment';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

import {
  Button,
  Datepicker,
  IconButton
} from '@folio/stripes-components';

import styles from './resource-coverage-fields.css';

class ResourceCoverageFields extends Component {
  static propTypes = {
    initialValue: PropTypes.array,
    intl: intlShape.isRequired
  };

  static defaultProps = {
    initialValue: []
  };

  renderCoverageFields = ({ fields }) => {
    let { initialValue, intl } = this.props;
    return (
      <div>
        {fields.length === 0
          && initialValue.length > 0
          && initialValue[0].beginCoverage
          && (
          <p data-test-eholdings-coverage-fields-saving-will-remove>
            <FormattedMessage id="ui-eholdings.package.noCoverageDates" />
          </p>
        )}

        {fields.length > 0 && (
          <ul className={styles['coverage-fields-date-range-rows']}>
            {fields.map((dateRange, index) => (
              <li
                data-test-eholdings-coverage-fields-date-range-row
                key={index}
                className={styles['coverage-fields-date-range-row']}
              >
                <div
                  data-test-eholdings-coverage-fields-date-range-begin
                  className={styles['coverage-fields-datepicker']}
                >
                  <Field
                    name={`${dateRange}.beginCoverage`}
                    type="text"
                    component={Datepicker}
                    label={intl.formatMessage({ id: 'ui-eholdings.date.startDate' })}
                    id="begin-coverage"
                    format={(value) => (value ? intl.formatDate(value, { timeZone: 'UTC' }) : '')}
                  />
                </div>
                <div
                  data-test-eholdings-coverage-fields-date-range-end
                  className={styles['coverage-fields-datepicker']}
                >
                  <Field
                    name={`${dateRange}.endCoverage`}
                    type="text"
                    component={Datepicker}
                    label={intl.formatMessage({ id: 'ui-eholdings.date.endDate' })}
                    id="end-coverage"
                    format={(value) => (value ? intl.formatDate(value, { timeZone: 'UTC' }) : '')}
                  />
                </div>

                <div
                  data-test-eholdings-coverage-fields-remove-row-button
                  className={styles['coverage-fields-date-range-clear-row']}
                >
                  <IconButton
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
          className={styles['coverage-fields-add-row-button']}
          data-test-eholdings-coverage-fields-add-row-button
        >
          <Button
            type="button"
            onClick={() => fields.push({})}
          >
            <FormattedMessage id="ui-eholdings.package.coverage.addDateRange" />
          </Button>
        </div>
      </div>
    );
  };

  render() {
    return (
      <FieldArray name="customCoverages" component={this.renderCoverageFields} />
    );
  }
}

export default injectIntl(ResourceCoverageFields);

/**
 * Validator to ensure start date comes before end date chronologically
 * @param {} dateRange - coverage date range to validate
 * @returns {} - an error object if errors are found, or `false` otherwise
 */
const validateStartDateBeforeEndDate = (dateRange, intl) => {
  const message = intl.formatMessage({ id: 'ui-eholdings.validate.errors.dateRange.startDateBeforeEndDate' });

  if (dateRange.endCoverage && moment(dateRange.beginCoverage).isAfter(moment(dateRange.endCoverage))) {
    return { beginCoverage: message };
  }

  return false;
};

/**
 * Validator to ensure begin date is present and entered dates are valid
 * @param {} dateRange - coverage date range to validate
 * @returns {} - an error object if errors are found, or `false` otherwise
 */
const validateDateFormat = (dateRange, intl) => {
  moment.locale(intl.locale);
  let dateFormat = moment.localeData()._longDateFormat.L;
  const message = intl.formatMessage({ id: 'ui-eholdings.validate.errors.dateRange.format' }, { dateFormat });

  if (!dateRange.beginCoverage || !moment(dateRange.beginCoverage).isValid()) {
    return { beginCoverage: message };
  }

  return false;
};

/**
 * Validator to ensure all coverage ranges are within the parent package's
 * custom coverage range if one is present
 * @param {} dateRange - coverage date range to validate
 * @param {} packageCoverage - parent package's custom coverage range
 * @returns {} - an error object if errors are found, or `false` otherwise
 */
const validateWithinPackageRange = (dateRange, packageCoverage, intl) => {
  // javascript/moment has no mechanism for "infinite", so we
  // use an absurd future date to represent the concept of "present"
  let present = moment('9999-09-09T05:00:00.000Z');
  if (packageCoverage && packageCoverage.beginCoverage) {
    let {
      beginCoverage: packageBeginCoverage,
      endCoverage: packageEndCoverage
    } = packageCoverage;

    let beginCoverageDate = moment(dateRange.beginCoverage);
    let endCoverageDate = dateRange.endCoverage ? moment(dateRange.endCoverage) : present;

    let packageBeginCoverageDate = moment(packageBeginCoverage);
    let packageEndCoverageDate = packageEndCoverage ? moment(packageEndCoverage) : moment();
    let packageRange = moment.range(packageBeginCoverageDate, packageEndCoverageDate);

    let startDate = intl.formatDate(
      packageBeginCoverageDate,
      {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      }
    );

    let endDate = packageEndCoverage ?
      intl.formatDate(
        packageEndCoverage,
        {
          timeZone: 'UTC',
          year: 'numeric',
          month: 'numeric',
          day: 'numeric'
        }
      )
      : 'Present';

    const message = intl.formatMessage({ id: 'ui-eholdings.validate.errors.dateRange.packageRange' }, { startDate, endDate });

    let beginDateOutOfRange = !packageRange.contains(beginCoverageDate);
    let endDateOutOfRange = !packageRange.contains(endCoverageDate);
    if (beginDateOutOfRange || endDateOutOfRange) {
      return {
        beginCoverage: beginDateOutOfRange ? message : '',
        endCoverage: endDateOutOfRange ? message : ''
      };
    }
  }
  return false;
};


/**
 * Validator to check that no date ranges overlap or are identical
 * @param {} dateRange - coverage date range to validate
 * @param {} customCoverages - all custom coverage ranges present in edit form
 * @param {} index - index in the field array indicating which coverage range is
 * presently being considered
 * @returns {} - an error object if errors are found, or `false` otherwise
 */
const validateNoRangeOverlaps = (dateRange, customCoverages, index, intl) => {
  let present = moment('9999-09-09T05:00:00.000Z');

  let beginCoverageDate = moment(dateRange.beginCoverage);
  let endCoverageDate = dateRange.endCoverage ? moment(dateRange.endCoverage) : present;
  let coverageRange = moment.range(beginCoverageDate, endCoverageDate);

  for (let overlapIndex = 0, len = customCoverages.length; overlapIndex < len; overlapIndex++) {
    let overlapRange = customCoverages[overlapIndex];

    // don't compare range to itself or to empty rows
    if (index === overlapIndex || !overlapRange.beginCoverage) {
      continue; // eslint-disable-line no-continue
    }

    let overlapCoverageBeginDate = moment(overlapRange.beginCoverage);
    let overlapCoverageEndDate = overlapRange.endCoverage ? moment(overlapRange.endCoverage) : present;
    let overlapCoverageRange = moment.range(overlapCoverageBeginDate, overlapCoverageEndDate);

    let startDate = intl.formatDate(
      overlapRange.beginCoverage,
      {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      }
    );

    let endDate = overlapRange.endCoverage ?
      intl.formatDate(
        overlapRange.endCoverage,
        {
          timeZone: 'UTC',
          year: 'numeric',
          month: 'numeric',
          day: 'numeric'
        }
      )
      : 'Present';

    const message = intl.formatMessage({ id: 'ui-eholdings.validate.errors.dateRange.overlap' }, { startDate, endDate });

    if (overlapCoverageRange.overlaps(coverageRange)
        || overlapCoverageRange.isEqual(coverageRange)
        || overlapCoverageRange.contains(coverageRange)) {
      return { beginCoverage: message, endCoverage: message };
    }
  }

  return false;
};

export function validate(values, props) {
  let errors = [];
  let { intl, model } = props;

  let packageCoverage = model.package.customCoverage;

  values.customCoverages.forEach((dateRange, index) => {
    let dateRangeErrors = {};

    dateRangeErrors =
      validateDateFormat(dateRange, intl) ||
      validateStartDateBeforeEndDate(dateRange, intl) ||
      validateNoRangeOverlaps(dateRange, values.customCoverages, index, intl) ||
      validateWithinPackageRange(dateRange, packageCoverage, intl);

    errors[index] = dateRangeErrors;
  });

  return { customCoverages: errors };
}
