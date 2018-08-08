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

import styles from './package-coverage-fields.css';

class PackageCoverageFields extends Component {
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
      <div className={styles['coverage-fields']}>
        {fields.length === 0
          && initialValue.length > 0
          && initialValue[0].beginCoverage
          && (
          <p data-test-eholdings-package-coverage-fields-saving-will-remove>
            <FormattedMessage id="ui-eholdings.package.noCoverageDates" />
          </p>
        )}

        {fields.length === 0 ? (
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
                    label="End date"
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
      </div>
    );
  };

  render() {
    return (
      <FieldArray name="customCoverages" component={this.renderCoverageFields} />
    );
  }
}

export default injectIntl(PackageCoverageFields);

export function validate(values, props) {
  moment.locale(props.intl.locale);
  let dateFormat = moment.localeData()._longDateFormat.L;
  const errors = {};

  values.customCoverages.forEach((dateRange, index) => {
    let dateRangeErrors = {};
    let { intl } = props;

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
