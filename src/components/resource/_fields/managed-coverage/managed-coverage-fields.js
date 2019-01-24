import React, { Component, Fragment } from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedDate, FormattedMessage, injectIntl, intlShape } from 'react-intl';

import {
  Datepicker,
  Icon,
  RadioButton,
  RepeatableField
} from '@folio/stripes/components';

import CoverageDateList from '../../../coverage-date-list';
import { isBookPublicationType } from '../../../utilities';
import styles from './managed-coverage-fields.css';

class ResourceCoverageFields extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    model: PropTypes.object.isRequired,
  };

  /**
   * Validator to ensure begin date is present and entered dates are valid
   * @param {} dateRange - coverage date range to validate
   * @returns {} - an error object if errors are found, or `false` otherwise
   */
  validateDateFormat = (dateRange) => {
    const { intl: { locale } } = this.props;
    moment.locale(locale);
    let dateFormat = moment.localeData()._longDateFormat.L;
    const message = <FormattedMessage id="ui-eholdings.validate.errors.dateRange.format" values={{ dateFormat }} />;

    if (!dateRange.beginCoverage || !moment.utc(dateRange.beginCoverage).isValid()) {
      return { beginCoverage: message };
    }

    return false;
  };

  /**
   * Validator to ensure start date comes before end date chronologically
   * @param {} dateRange - coverage date range to validate
   * @returns {} - an error object if errors are found, or `false` otherwise
   */
  validateStartDateBeforeEndDate = (dateRange) => {
    const message = <FormattedMessage id="ui-eholdings.validate.errors.dateRange.startDateBeforeEndDate" />;

    if (dateRange.endCoverage && moment.utc(dateRange.beginCoverage).isAfter(moment.utc(dateRange.endCoverage))) {
      return { beginCoverage: message };
    }

    return false;
  }

  /**
   * Validator to check that no date ranges overlap or are identical
   * @param {} dateRange - coverage date range to validate
   * @param {} customCoverages - all custom coverage ranges present in edit form
   * @param {} index - index in the field array indicating which coverage range is
   * presently being considered
   * @returns {} - an error object if errors are found, or `false` otherwise
   */
  validateNoRangeOverlaps = (dateRange, customCoverages, index) => {
    let present = moment.utc('9999-09-09T05:00:00.000Z');

    let beginCoverageDate = moment.utc(dateRange.beginCoverage);
    let endCoverageDate = dateRange.endCoverage ? moment.utc(dateRange.endCoverage) : present;
    let coverageRange = moment.range(beginCoverageDate, endCoverageDate);

    for (let overlapIndex = 0, len = customCoverages.length; overlapIndex < len; overlapIndex++) {
      let overlapRange = customCoverages[overlapIndex];

      // don't compare range to itself or to empty rows
      if (index === overlapIndex || !overlapRange.beginCoverage) {
        continue; // eslint-disable-line no-continue
      }

      let overlapCoverageBeginDate = moment.utc(overlapRange.beginCoverage);
      let overlapCoverageEndDate = overlapRange.endCoverage ? moment.utc(overlapRange.endCoverage) : present;
      let overlapCoverageRange = moment.range(overlapCoverageBeginDate, overlapCoverageEndDate);

      let startDate =
        <FormattedDate
          value={overlapRange.beginCoverage}
          timeZone="UTC"
          year="numeric"
          month="numeric"
          day="numeric"
        />;

      let endDate = overlapRange.endCoverage ?
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

    return false;
  }

  /**
   * Validator to ensure all coverage ranges are within the parent package's
   * custom coverage range if one is present
   * @param {} dateRange - coverage date range to validate
   * @returns {} - an error object if errors are found, or `false` otherwise
   */
  validateWithinPackageRange = (dateRange) => {
    const { model: { package: { customCoverage } } } = this.props;
    const {
      beginCoverage: packageBeginCoverage,
      endCoverage: packageEndCoverage
    } = customCoverage;
    // javascript/moment has no mechanism for "infinite", so we
    // use an absurd future date to represent the concept of "present"
    let present = moment.utc('9999-09-09T05:00:00.000Z');
    if (packageBeginCoverage) {
      let beginCoverageDate = moment.utc(dateRange.beginCoverage);
      let endCoverageDate = dateRange.endCoverage ? moment.utc(dateRange.endCoverage) : present;

      let packageBeginCoverageDate = moment.utc(packageBeginCoverage);
      let packageEndCoverageDate = packageEndCoverage ? moment.utc(packageEndCoverage) : moment.utc();
      let packageRange = moment.range(packageBeginCoverageDate, packageEndCoverageDate);

      let startDate =
        <FormattedDate
          value={packageBeginCoverageDate}
          timeZone="UTC"
          year="numeric"
          month="numeric"
          day="numeric"
        />;

      let endDate = packageEndCoverage ?
        <FormattedDate
          value={packageEndCoverageDate}
          timeZone="UTC"
          year="numeric"
          month="numeric"
          day="numeric"
        />
        : 'Present';

      const message = <FormattedMessage id="ui-eholdings.validate.errors.dateRange.packageRange" values={{ startDate, endDate }} />;

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
  }

  validateDateRange = (values) => {
    let errors = [];

    values.forEach((dateRange, index) => {
      let dateRangeErrors = {};

      dateRangeErrors =
        this.validateDateFormat(dateRange) ||
        this.validateStartDateBeforeEndDate(dateRange) ||
        this.validateNoRangeOverlaps(dateRange, values, index) ||
        this.validateWithinPackageRange(dateRange);

      errors[index] = dateRangeErrors;
    });

    return errors;
  }

  renderField = (dateRange) => {
    return (
      <Fragment>
        <div
          data-test-eholdings-coverage-fields-date-range-begin
          className={styles['coverage-fields-datepicker']}
        >
          <Field
            name={`${dateRange}.beginCoverage`}
            type="text"
            component={Datepicker}
            label={<FormattedMessage id="ui-eholdings.date.startDate" />}
            id="begin-coverage"
            format={(value) => (value ? moment.utc(value) : '')}
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
            label={<FormattedMessage id="ui-eholdings.date.endDate" />}
            id="end-coverage"
            format={(value) => (value ? moment.utc(value) : '')}
          />
        </div>
      </Fragment>
    );
  }

  renderCoverageFields = ({ fields, name, meta: { initial } }) => {
    const { model } = this.props;

    return (
      <fieldset>
        <div>
          <RadioButton
            label={<FormattedMessage id="ui-eholdings.label.managed.coverageDates" />}
            disabled={model.managedCoverages.length === 0}
            checked={fields.length === 0 && model.managedCoverages.length > 0}
            onChange={(e) => {
              if (e.target.value === 'on') {
                fields.removeAll();
              }
            }}
          />
          <div className={styles['coverage-fields-category']} data-test-eholdings-resource-edit-managed-coverage-list>
            {model.managedCoverages.length > 0 ? (
              <CoverageDateList
                coverageArray={model.managedCoverages}
                isYearOnly={isBookPublicationType(model.publicationType)}
              />
            ) : (
              <p><FormattedMessage id="ui-eholdings.resource.managedCoverageDates.notSet" /></p>
            )}
          </div>
        </div>
        <div>
          <RadioButton
            label={<FormattedMessage id="ui-eholdings.label.custom.coverageDates" />}
            checked={fields.length > 0}
            onChange={(e) => {
              if (e.target.value === 'on' && fields.length === 0) {
                fields.push({});
              }
            }}
          />
          <div className={styles['coverage-fields-category']}>
            <RepeatableField
              addLabel={
                <Icon icon="plus-sign">
                  <FormattedMessage id="ui-eholdings.package.coverage.addDateRange" />
                </Icon>
              }
              emptyMessage={
                initial.length > 0 && initial[0].beginCoverage ?
                  <FormattedMessage id="ui-eholdings.package.noCoverageDates" /> : ''
              }
              fields={fields}
              name={name}
              onAdd={() => fields.push({})}
              onRemove={(index) => fields.remove(index)}
              renderField={this.renderField}
            />
          </div>
        </div>
      </fieldset>
    );
  };

  render() {
    return (
      <div data-test-eholdings-resource-coverage-fields>
        <FieldArray
          component={this.renderCoverageFields}
          name="customCoverages"
          validate={this.validateDateRange}
        />
      </div>
    );
  }
}

export default injectIntl(ResourceCoverageFields);
