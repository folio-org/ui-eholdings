import { Component } from 'react';

import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import isEqual from 'lodash/isEqual';
import has from 'lodash/has';

import {
  RepeatableField,
  Datepicker,
  RadioButton,
  Row,
  Col,
} from '@folio/stripes/components';

import CoverageDateList from '../../../coverage-date-list';

import validateDateRange from '../validate-date-range';
import { isBookPublicationType } from '../../../utilities';
import {
  BACKEND_DATE_STANDARD,
  TIME_ZONE,
} from '../../../../constants';

import styles from './resource-coverage-fields.css';

class ResourceCoverageFields extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
  };

  validateDateRange = (values) => {
    const {
      intl: { locale },
      model: {
        package: {
          customCoverage: packageDateRange
        },
      },
    } = this.props;

    return validateDateRange(values, locale, packageDateRange);
  };

  renderCustomCoverageFields = (formData) => {
    const {
      fields,
      name: fieldsName,
      meta: {
        initial: initialValues,
      },
    } = formData;

    return (
      <RepeatableField
        addLabel={<FormattedMessage id="ui-eholdings.package.coverage.addDateRange" />}
        emptyMessage={this.renderEmptyMessage(initialValues)}
        fields={fields}
        name={fieldsName}
        onAdd={() => fields.push({})}
        onRemove={index => fields.remove(index)}
        renderField={this.renderField}
      />
    );
  };

  renderManagedCoverageFields = (formData) => {
    const { model } = this.props;
    const {
      fields,
      name: fieldsName,
      meta: {
        initial: initialValues,
      },
    } = formData;

    const managedCoveragesExist = !!model.managedCoverages.length;

    const switchToManagedCoverages = (e) => {
      if (e.target.checked) {
        fields.removeAll();
      }
    };

    const switchToCustomCoverages = (e) => {
      if (e.target.checked && !fields.length) {
        fields.push({});
      }
    };

    return (
      <fieldset>
        <div>
          <RadioButton
            label={<FormattedMessage id="ui-eholdings.label.managed.coverageDates" />}
            disabled={!managedCoveragesExist}
            checked={fields.length === 0 && managedCoveragesExist}
            onChange={switchToManagedCoverages}
            value="managed-coverages"
          />
          <div
            className={styles['coverage-fields-category']}
            data-test-eholdings-resource-edit-managed-coverage-list
            data-testid="resource-edit-managed-coverage-list"
          >
            {managedCoveragesExist
              ? (
                <CoverageDateList
                  isManagedCoverage
                  coverageArray={model.managedCoverages}
                  isYearOnly={isBookPublicationType(model.publicationType)}
                />
              )
              : <p><FormattedMessage id="ui-eholdings.resource.managedCoverageDates.notSet" /></p>}
          </div>
        </div>
        <div>
          <RadioButton
            label={<FormattedMessage id="ui-eholdings.label.edit.custom.coverageDates" />}
            checked={fields.length > 0}
            onChange={switchToCustomCoverages}
            value="custom-coverages"
          />
          <div className={styles['coverage-fields-category']}>
            <RepeatableField
              addLabel={<FormattedMessage id="ui-eholdings.package.coverage.addDateRange" />}
              emptyMessage={this.renderEmptyMessage(initialValues)}
              fields={fields}
              name={fieldsName}
              onAdd={() => fields.push({})}
              onRemove={fields.remove}
              renderField={this.renderField}
            />
          </div>
        </div>
      </fieldset>
    );
  };

  renderField = (dateRange, index) => {
    return (
      <Row data-testid="coverage-field">
        <Col
          md
          xs={12}
          data-test-eholdings-coverage-fields-date-range-begin
          data-testid="coverage-fields-date-range-begin"
        >
          <Field
            name={`${dateRange}.beginCoverage`}
            timeZone={TIME_ZONE}
            render={({ input, meta }) => (
              <Datepicker
                backendDateStandard={BACKEND_DATE_STANDARD}
                error={meta.error}
                id={`begin-coverage-${index}`}
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
          data-testid="coverage-fields-date-range-end"
        >
          <Field
            name={`${dateRange}.endCoverage`}
            timeZone={TIME_ZONE}
            render={({ input, meta }) => (
              <Datepicker
                backendDateStandard={BACKEND_DATE_STANDARD}
                error={meta.error}
                id={`end-coverage-${index}`}
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
  };

  renderEmptyMessage(initialValues) {
    const isCoverageDatesRemoved = has(initialValues, '[0].beginCoverage');

    return isCoverageDatesRemoved
      ? <FormattedMessage id="ui-eholdings.package-resource.coverageDates.savingWillRemove" />
      : '';
  }

  render() {
    const { model } = this.props;
    const renderCoverageFields = model.isTitleCustom
      ? this.renderCustomCoverageFields
      : this.renderManagedCoverageFields;

    return (
      <div
        data-test-eholdings-resource-coverage-fields
        data-testid="resource-coverage-fields"
      >
        <FieldArray
          component={renderCoverageFields}
          isEqual={isEqual}
          name="customCoverages"
          validate={this.validateDateRange}
        />
      </div>
    );
  }
}

export default injectIntl(ResourceCoverageFields);
