import React, { Component, Fragment } from 'react';
import { Field, FieldArray } from 'redux-form';
import PropTypes from 'prop-types';
import moment from 'moment';
import { injectIntl, intlShape } from 'react-intl';

import {
  Datepicker
} from '@folio/stripes-components';

import RepeatableField from '../../../repeatable-field';
import styles from './package-coverage-fields.css';

class PackageCoverageFields extends Component {
  static propTypes = {
    initialValue: PropTypes.array,
    intl: intlShape.isRequired
  };

  static defaultProps = {
    initialValue: []
  };

  renderField = (dateRange) => {
    const { intl } = this.props;

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
            label={intl.formatMessage({ id: 'ui-eholdings.date.startDate' })}
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
            format={(value) => (value ? intl.formatDate(value, { timeZone: 'UTC' }) : '')}
          />
        </div>
      </Fragment>
    );
  }

  render() {
    const { initialValue, intl } = this.props;

    return (
      <div data-test-eholdings-package-coverage-fields>
        <FieldArray
          addLabel={intl.formatMessage({ id: 'ui-eholdings.package.coverage.addDateRange' })}
          component={RepeatableField}
          emptyMessage={
            initialValue.length > 0 && initialValue[0].beginCoverage ?
              intl.formatMessage({ id: 'ui-eholdings.package.noCoverageDates' }) : ''
          }
          name="customCoverages"
          renderField={this.renderField}
        />
      </div>
    );
  }
}

export default injectIntl(PackageCoverageFields);

export function validate(values, props) {
  moment.locale(props.intl.locale);
  let dateFormat = moment.localeData()._longDateFormat.L;
  const errors = {};
  let { intl } = props;

  values.customCoverages.forEach((dateRange, index) => {
    let dateRangeErrors = {};

    if (dateRange.beginCoverage && !moment(dateRange.beginCoverage).isValid()) {
      dateRangeErrors.beginCoverage = intl.formatMessage({ id: 'ui-eholdings.validate.errors.dateRange.format' }, { dateFormat });
    }

    if (dateRange.endCoverage && !dateRange.beginCoverage) {
      dateRangeErrors.beginCoverage = intl.formatMessage({ id: 'ui-eholdings.validate.errors.dateRange.format' }, { dateFormat });
    }

    if (dateRange.endCoverage && moment(dateRange.beginCoverage).isAfter(moment(dateRange.endCoverage))) {
      dateRangeErrors.beginCoverage = intl.formatMessage({ id: 'ui-eholdings.validate.errors.dateRange.startDateBeforeEndDate' });
    }

    errors[index] = dateRangeErrors;
  });

  return { customCoverages: errors };
}
