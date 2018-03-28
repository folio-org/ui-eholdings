import React, { Component } from 'react';
import { Field, FieldArray } from 'redux-form';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
  Button,
  Datepicker,
  IconButton
} from '@folio/stripes-components';

import styles from './customer-resource-coverage-fields.css';
import { formatISODateWithoutTime } from '../utilities';

export default class CustomerResourceCoverageFields extends Component {
  static propTypes = {
    packageCoverage: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
    locale: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    intl: PropTypes.object // eslint-disable-line react/no-unused-prop-types
  };

  renderCoverageFields = ({ fields }) => {
    return (
      <div className={styles['coverage-fields']}>
        {fields.length === 0 ? (
          <p data-test-eholdings-coverage-fields-no-rows-left>
            No date ranges set. Saving will remove all custom coverage.
          </p>
        ) : (
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
                    label="Start date"
                    id="begin-coverage"
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
                    label="End date"
                    id="end-coverage"
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
    return (
      <FieldArray name="customCoverages" component={this.renderCoverageFields} />
    );
  }
}

/**
 * Validator to ensure start date comes before end date chronologically
 * @param {} dateRange - coverage date range to validate
 * @returns {} - an error object if errors are found, or `false` otherwise
 */
const validateStartDateBeforeEndDate = (dateRange) => {
  const message = 'Start date must be before end date';

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
const validateDateFormat = (dateRange, locale) => {
  moment.locale(locale);
  let dateFormat = moment.localeData()._longDateFormat.L;
  const message = `Enter date in ${dateFormat} format.`;

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
 * @param {} intl - object containing locale-specific data & formatting
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

    const message = `Dates must be within package's date range (${
      formatISODateWithoutTime(packageBeginCoverageDate.format('YYYY-MM-DD'), intl)
    } - ${
      packageEndCoverage
        ? formatISODateWithoutTime(packageEndCoverageDate.format('YYYY-MM-DD'), intl)
        : 'Present'
    }).`;

    let beginDateOutOfRange = !packageRange.contains(beginCoverageDate);
    let endDateOutOfRange = !packageRange.contains(endCoverageDate);
    if (beginDateOutOfRange || endDateOutOfRange) {
      return {
        beginCoverage: beginDateOutOfRange ? message : false,
        endCoverage: endDateOutOfRange ? message : false
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
 * @param {} intl - object containing locale-specific data & formatting
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

    const message = `Date range overlaps with ${
      overlapRange.beginCoverage &&
        formatISODateWithoutTime(overlapCoverageBeginDate.format('YYYY-MM-DD'), intl)
    } - ${
      overlapRange.endCoverage
        ? formatISODateWithoutTime(overlapCoverageEndDate.format('YYYY-MM-DD'), intl)
        : 'Present'
    }`;

    if (overlapCoverageRange.overlaps(coverageRange)
        || overlapCoverageRange.isEqual(coverageRange)
        || overlapCoverageRange.contains(coverageRange)) {
      // set endCoverage: true to make box red without message
      return { beginCoverage: message, endCoverage: true };
    }
  }

  return false;
};

export function validate(values, props) {
  let errors = [];
  let { intl, packageCoverage, locale } = props;

  values.customCoverages.forEach((dateRange, index) => {
    let dateRangeErrors = {};

    dateRangeErrors =
      validateDateFormat(dateRange, locale) ||
      validateStartDateBeforeEndDate(dateRange) ||
      validateNoRangeOverlaps(dateRange, values.customCoverages, index, intl) ||
      validateWithinPackageRange(dateRange, packageCoverage, intl);

    errors[index] = dateRangeErrors;
  });

  return { customCoverages: errors };
}
