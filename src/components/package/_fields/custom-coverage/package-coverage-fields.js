import { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import moment from 'moment';
import isEqual from 'lodash/isEqual';

import {
  Datepicker,
  RepeatableField,
  Col,
  Row,
} from '@folio/stripes/components';
import {
  BACKEND_DATE_STANDARD,
  TIME_ZONE,
} from '../../../../constants';

class PackageCoverageFields extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
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

  renderField = (dateRange, index) => {
    return (
      <Row data-testid="coverage-field">
        <Col
          md
          xs={12}
          data-test-eholdings-coverage-fields-date-range-begin
        >
          <Field
            name={`${dateRange}.beginCoverage`}
            validate={this.validateCoverageDate}
            timeZone={TIME_ZONE}
            render={({ input, meta }) => (
              <Datepicker
                backendDateStandard={BACKEND_DATE_STANDARD}
                error={meta.error}
                id={`begin-coverage-${index}`}
                data-testid={`begin-coverage-${index}`}
                input={input}
                label={<FormattedMessage id="ui-eholdings.date.startDate" />}
                useInput
                usePortal
              />
            )}
          />
        </Col>
        <Col
          md
          xs={12}
          data-test-eholdings-coverage-fields-date-range-end
        >
          <Field
            name={`${dateRange}.endCoverage`}
            validate={this.validateCoverageDate}
            timeZone={TIME_ZONE}
            render={({ input, meta }) => (
              <Datepicker
                backendDateStandard={BACKEND_DATE_STANDARD}
                error={meta.error}
                id={`end-coverage-${index}`}
                data-testid={`end-coverage-${index}`}
                input={input}
                label={<FormattedMessage id="ui-eholdings.date.endDate" />}
                useInput
                usePortal
              />
            )}
          />
        </Col>
      </Row>
    );
  }

  renderRepeatableField = ({ fields, meta: { initial } }) => {
    const hasAddButton = fields.length === 0;
    const hasEmptyMessage = initial && initial.length > 0 && initial[0].beginCoverage;
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
