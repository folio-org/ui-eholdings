import React, { Component } from 'react';
import { Field, FieldArray } from 'redux-form';
import PropTypes from 'prop-types';
import moment from 'moment';

import Datepicker from '@folio/stripes-components/lib/Datepicker';
import Button from '@folio/stripes-components/lib/Button';
import IconButton from '@folio/stripes-components/lib/IconButton';

import styles from './package-coverage-fields.css';

export default class PackageCoverageFields extends Component {
  static propTypes = {
    packageCoverage: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
    locale: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    intl: PropTypes.object // eslint-disable-line react/no-unused-prop-types
  };

  renderCoverageFields = ({ fields }) => {
    return (
      <div className={styles['coverage-fields']}>
        {fields.length === 0 ? (
          <div>
            <p data-test-eholdings-coverage-fields-no-rows-left>
              No date range set. Saving will remove custom coverage.
            </p>
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

export function validate(values, props) {
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
