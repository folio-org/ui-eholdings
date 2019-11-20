import React from 'react';
import {
  FormattedMessage,
  FormattedDate,
} from 'react-intl';

import moment from 'moment';

/**
   * Validator to ensure begin date is present and entered dates are valid
   * @param {} dateRange - coverage date range to validate
   * @returns {} - an error object if errors are found, or `undefined` otherwise
   */
const validateDateFormat = (dateRange, locale) => {
  moment.locale(locale);
  const dateFormat = moment.localeData()._longDateFormat.L;
  const message = <FormattedMessage id="ui-eholdings.validate.errors.dateRange.format" values={{ dateFormat }} />;

  if (!dateRange.beginCoverage || !moment.utc(dateRange.beginCoverage).isValid()) {
    return { beginCoverage: message };
  }

  return undefined;
};

/**
 * Validator to ensure start date comes before end date chronologically
 * @param {} dateRange - coverage date range to validate
 * @returns {} - an error object if errors are found, or `undefined` otherwise
 */
const validateStartDateBeforeEndDate = (dateRange) => {
  const message = <FormattedMessage id="ui-eholdings.validate.errors.dateRange.startDateBeforeEndDate" />;

  if (dateRange.endCoverage && moment.utc(dateRange.beginCoverage).isAfter(moment.utc(dateRange.endCoverage))) {
    return { beginCoverage: message };
  }

  return undefined;
};

/**
 * Validator to check that no date ranges overlap or are identical
 * @param {} dateRange - coverage date range to validate
 * @param {} customCoverages - all custom coverage ranges present in edit form
 * @param {} index - index in the field array indicating which coverage range is
 * presently being considered
 * @returns {} - an error object if errors are found, or `undefined` otherwise
 */
const validateNoRangeOverlaps = (dateRange, customCoverages, index) => {
  const present = moment.utc('9999-09-09T05:00:00.000Z');

  const beginCoverageDate = moment.utc(dateRange.beginCoverage);
  const endCoverageDate = dateRange.endCoverage ? moment.utc(dateRange.endCoverage) : present;
  const coverageRange = moment.range(beginCoverageDate, endCoverageDate);

  for (let overlapIndex = 0, len = customCoverages.length; overlapIndex < len; overlapIndex++) {
    const overlapRange = customCoverages[overlapIndex];

    // don't compare range to itself or to empty rows
    if (index === overlapIndex || !overlapRange.beginCoverage) {
      continue; // eslint-disable-line no-continue
    }

    const overlapCoverageBeginDate = moment.utc(overlapRange.beginCoverage);
    const overlapCoverageEndDate = overlapRange.endCoverage ? moment.utc(overlapRange.endCoverage) : present;
    const overlapCoverageRange = moment.range(overlapCoverageBeginDate, overlapCoverageEndDate);

    const startDate =
      <FormattedDate
        value={overlapRange.beginCoverage}
        timeZone="UTC"
        year="numeric"
        month="numeric"
        day="numeric"
      />;

    const endDate = overlapRange.endCoverage ?
      <FormattedDate
        value={overlapRange.endCoverage}
        timeZone="UTC"
        year="numeric"
        month="numeric"
        day="numeric"
      />
      : 'Present';

    const message = <FormattedMessage id="ui-eholdings.validate.errors.dateRange.overlap" values={{ startDate, endDate }} />;

    if (overlapCoverageRange.overlaps(coverageRange)
      || overlapCoverageRange.isEqual(coverageRange)
      || overlapCoverageRange.contains(coverageRange)) {
      return { beginCoverage: message, endCoverage: message };
    }
  }

  return undefined;
};

/**
 * Validator to ensure all coverage ranges are within the parent package's
 * custom coverage range if one is present
 * @param {} resourceDateRange - coverage date range to validate
 * @returns {} - an error object if errors are found, or `undefined` otherwise
 */
const validateWithinPackageRange = (resourceDateRange, packageDateRange) => {
  const {
    beginCoverage: packageBeginCoverage,
    endCoverage: packageEndCoverage
  } = packageDateRange;
  // javascript/moment has no mechanism for "infinite", so we
  // use an absurd future date to represent the concept of "present"
  const present = moment.utc('9999-09-09T05:00:00.000Z');
  if (packageBeginCoverage) {
    const beginCoverageDate = moment.utc(resourceDateRange.beginCoverage);
    const endCoverageDate = resourceDateRange.endCoverage ? moment.utc(resourceDateRange.endCoverage) : present;

    const packageBeginCoverageDate = moment.utc(packageBeginCoverage);
    const packageEndCoverageDate = packageEndCoverage ? moment.utc(packageEndCoverage) : moment.utc();
    const packageRange = moment.range(packageBeginCoverageDate, packageEndCoverageDate);

    const startDate =
      <FormattedDate
        value={packageBeginCoverageDate}
        timeZone="UTC"
        year="numeric"
        month="numeric"
        day="numeric"
      />;

    const endDate = packageEndCoverage ?
      <FormattedDate
        value={packageEndCoverageDate}
        timeZone="UTC"
        year="numeric"
        month="numeric"
        day="numeric"
      />
      : 'Present';

    const message = <FormattedMessage id="ui-eholdings.validate.errors.dateRange.packageRange" values={{ startDate, endDate }} />;

    const beginDateOutOfRange = !packageRange.contains(beginCoverageDate);
    const endDateOutOfRange = !packageRange.contains(endCoverageDate);
    if (beginDateOutOfRange || endDateOutOfRange) {
      return {
        beginCoverage: beginDateOutOfRange ? message : '',
        endCoverage: endDateOutOfRange ? message : ''
      };
    }
  }
  return undefined;
};

const validateDateRange = (values, locale, packageDateRange) => {
  const errors = [];

  values.forEach((dateRange, index) => {
    const dateRangeErrors =
      validateDateFormat(dateRange, locale)
      || validateStartDateBeforeEndDate(dateRange)
      || validateNoRangeOverlaps(dateRange, values, index)
      || validateWithinPackageRange(dateRange, packageDateRange);

    errors[index] = dateRangeErrors;
  });

  return errors;
};

export default validateDateRange;
