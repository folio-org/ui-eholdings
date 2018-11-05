import React, { Component, Fragment } from 'react';
import { Field, FieldArray } from 'redux-form';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import {
  Datepicker,
  RepeatableField
} from '@folio/stripes/components';

import styles from './package-coverage-fields.css';

class PackageCoverageFields extends Component {
  static propTypes = {
    initialValue: PropTypes.array,
    intl: intlShape
  };

  static defaultProps = {
    initialValue: []
  };

  validateCoverageDate = (value) => {
    const { intl } = this.props;
    moment.locale(intl.locale);
    let dateFormat = moment.localeData()._longDateFormat.L;
    let errors;

    if (value && !moment.utc(value).isValid()) {
      errors = <FormattedMessage id="ui-eholdings.validate.errors.dateRange.format" values={{ dateFormat }} />;
    }

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
            format={(value) => (value ? moment.utc(value) : '')}
            validate={this.validateCoverageDate}
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
            format={(value) => (value ? moment.utc(value) : '')}
            validate={this.validateCoverageDate}
          />
        </div>
      </Fragment>
    );
  }

  render() {
    const { initialValue } = this.props;

    return (
      <div data-test-eholdings-package-coverage-fields>
        <FieldArray
          addLabel={<FormattedMessage id="ui-eholdings.package.coverage.addDateRange" />}
          component={RepeatableField}
          emptyMessage={
            initialValue.length > 0 && initialValue[0].beginCoverage ?
              <FormattedMessage id="ui-eholdings.package.noCoverageDates" /> : ''
          }
          name="customCoverages"
          renderField={this.renderField}
        />
      </div>
    );
  }
}

export default injectIntl(PackageCoverageFields);

export function validate(values) {
  const errors = {};

  values.customCoverages.forEach((dateRange, index) => {
    let dateRangeErrors = {};

    if (dateRange.endCoverage && moment.utc(dateRange.beginCoverage).isAfter(moment.utc(dateRange.endCoverage))) {
      dateRangeErrors.beginCoverage = <FormattedMessage id="ui-eholdings.validate.errors.dateRange.startDateBeforeEndDate" />;
    }

    errors[index] = dateRangeErrors;
  });

  return { customCoverages: errors };
}
