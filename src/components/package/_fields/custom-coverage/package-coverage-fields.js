import React, { Component, Fragment } from 'react';
import { Field, FieldArray } from 'redux-form';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';

import {
  Datepicker,
  RepeatableField
} from '@folio/stripes/components';

import styles from './package-coverage-fields.css';

class PackageCoverageFields extends Component {
  static propTypes = {
    initialValue: PropTypes.array
  };

  static defaultProps = {
    initialValue: []
  };

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

export default PackageCoverageFields;

export function validate(values, props) {
  let { intl } = props;
  moment.locale(intl.locale);
  let dateFormat = moment.localeData()._longDateFormat.L;
  const errors = {};

  values.customCoverages.forEach((dateRange, index) => {
    let dateRangeErrors = {};

    if (dateRange.beginCoverage && !moment.utc(dateRange.beginCoverage).isValid()) {
      dateRangeErrors.beginCoverage = <FormattedMessage id="ui-eholdings.validate.errors.dateRange.format" values={{ dateFormat }} />;
    }

    if (dateRange.endCoverage && !dateRange.beginCoverage) {
      dateRangeErrors.beginCoverage = <FormattedMessage id="ui-eholdings.validate.errors.dateRange.format" values={{ dateFormat }} />;
    }

    if (dateRange.endCoverage && moment.utc(dateRange.beginCoverage).isAfter(moment.utc(dateRange.endCoverage))) {
      dateRangeErrors.beginCoverage = <FormattedMessage id="ui-eholdings.validate.errors.dateRange.startDateBeforeEndDate" />;
    }

    errors[index] = dateRangeErrors;
  });

  return { customCoverages: errors };
}
