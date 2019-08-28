import React, { Component, Fragment } from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';

import moment from 'moment';
import isEqual from 'lodash/isEqual';

import {
  Datepicker,
  Icon,
  RepeatableField,
} from '@folio/stripes/components';

import styles from './package-coverage-fields.css';

class PackageCoverageFields extends Component {
  static propTypes = {
    intl: intlShape,
  };

  validateDateRange = (values) => {
    const errorArray = [];

    values.forEach(({ beginCoverage, endCoverage }) => {
      const errors = {};

      if (endCoverage && !moment.utc(endCoverage).isAfter(moment.utc(beginCoverage))) {
        errors.beginCoverage = <FormattedMessage id="ui-eholdings.validate.errors.dateRange.startDateBeforeEndDate" />;
      }

      errorArray.push(errors);
    });

    return errorArray;
  }

  validateCoverageDate = (value) => {
    const { intl } = this.props;
    moment.locale(intl.locale);
    const dateFormat = moment.localeData()._longDateFormat.L;
    let errors;

    if (value && !moment.utc(value).isValid()) {
      errors = (
        <FormattedMessage
          id="ui-eholdings.validate.errors.dateRange.format"
          values={{ dateFormat }}
        />
      );
    }

    return errors;
  }

  renderField = (dateRange) => {
    const formatField = value => (value ? moment.utc(value) : '');

    return (
      <div className={styles['coverage-fields']}>
        <div
          data-test-eholdings-coverage-fields-date-range-begin
          className={styles['coverage-fields-datepicker']}
        >
          <Field
            name={`${dateRange}.beginCoverage`}
            type="text"
            component={Datepicker}
            label={<FormattedMessage id="ui-eholdings.date.startDate" />}
            format={formatField}
            validate={this.validateCoverageDate}
            timeZone="UTC"
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
            format={formatField}
            validate={this.validateCoverageDate}
            timeZone="UTC"
          />
        </div>
      </div>
    );
  }

  renderRepeatableField = ({ fields, name, meta: { initial } }) => {
    const hasAddButton = fields.length === 0 || (fields.length === 1 && !initial[0]);
    const hasEmptyMessage = initial.length > 0 && initial[0].beginCoverage;
    const addLabel = hasAddButton
      ? <FormattedMessage id="ui-eholdings.package.coverage.addDateRange" />
      : null;

    const emptyMessage = hasEmptyMessage
      ? <FormattedMessage id="ui-eholdings.package-resource.coverageDates.savingWillRemove" />
      : null;

    return (
      <RepeatableField
        addLabel={addLabel}
        emptyMessage={emptyMessage}
        fields={fields}
        name={name}
        onAdd={() => fields.push({})}
        onRemove={(index) => fields.remove(index)}
        renderField={this.renderField}
      />
    );
  };

  render() {
    return (
      <div data-test-eholdings-package-coverage-fields>
        <FieldArray
          component={this.renderRepeatableField}
          isEqual={isEqual}
          name="customCoverages"
          validate={this.validateDateRange}
        />
      </div>
    );
  }
}

export default injectIntl(PackageCoverageFields);
