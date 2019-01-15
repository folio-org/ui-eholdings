import React, { Component, Fragment } from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import moment from 'moment';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';

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
    let errorArray = [];

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
    let dateFormat = moment.localeData()._longDateFormat.L;
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
            format={formatField}
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
            format={formatField}
            validate={this.validateCoverageDate}
          />
        </div>
      </Fragment>
    );
  }

  renderRepeatableField = ({ fields, name, meta: { initial } }) => {
    const hasAddButton = fields.length === 0 || (fields.length === 1 && !initial[0]);
    const hasEmptyMessage = initial.length > 0 && initial[0].beginCoverage;
    const addLabel = hasAddButton
      ? <Icon icon="plus-sign"><FormattedMessage id="ui-eholdings.package.coverage.addDateRange" /></Icon>
      : null;

    const emptyMessage = hasEmptyMessage
      ? <FormattedMessage id="ui-eholdings.package.noCoverageDates" />
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
          name="customCoverages"
          validate={this.validateDateRange}
        />
      </div>
    );
  }
}

export default injectIntl(PackageCoverageFields);
