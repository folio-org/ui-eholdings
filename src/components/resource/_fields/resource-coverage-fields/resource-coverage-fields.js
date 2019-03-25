import React, {
  Component,
  Fragment
} from 'react';

import PropTypes from 'prop-types';
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
  Icon,
  RepeatableField,
  Datepicker,
  RadioButton,
} from '@folio/stripes/components';

import CoverageDateList from '../../../coverage-date-list';

import validateDateRange from '../validate-date-range';
import { isBookPublicationType } from '../../../utilities';

import styles from './resource-coverage-fields.css';

class ResourceCoverageFields extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
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
  }

  renderCustomCoverageFields = ({ fields, name: fieldsName, meta: { initial: initialValues } }) => {
    return (
      <RepeatableField
        addLabel={
          <Icon icon="plus-sign">
            <FormattedMessage id="ui-eholdings.package.coverage.addDateRange" />
          </Icon>
        }
        emptyMessage={
          initialValues.length > 0 && initialValues[0].beginCoverage
            ? <FormattedMessage id="ui-eholdings.package.noCoverageDates" />
            : ''
        }
        fields={fields}
        name={fieldsName}
        onAdd={() => fields.push({})}
        onRemove={index => fields.remove(index)}
        renderField={this.renderField}
      />
    );
  }

  renderManagedCoverageFields = ({ fields, name: fieldsName, meta: { initial: initialValues } }) => {
    const { model } = this.props;
    const managedCoveragesExist = model.managedCoverages.length > 0;
    return (
      <fieldset>
        <div>
          <RadioButton
            label={<FormattedMessage id="ui-eholdings.label.managed.coverageDates" />}
            disabled={!managedCoveragesExist}
            checked={fields.length === 0 && managedCoveragesExist}
            onChange={(e) => {
              if (e.target.value === 'on') {
                fields.removeAll();
              }
            }}
          />
          <div
            className={styles['coverage-fields-category']}
            data-test-eholdings-resource-edit-managed-coverage-list
          >
            {managedCoveragesExist
              ? (
                <CoverageDateList
                  coverageArray={model.managedCoverages}
                  isYearOnly={isBookPublicationType(model.publicationType)}
                />
              )
              : (
                <p><FormattedMessage id="ui-eholdings.resource.managedCoverageDates.notSet" /></p>
              )
            }
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
                initialValues.length > 0 && initialValues[0].beginCoverage
                  ? <FormattedMessage id="ui-eholdings.package.noCoverageDates" />
                  : ''
              }
              fields={fields}
              name={fieldsName}
              onAdd={() => fields.push({})}
              onRemove={(index) => fields.remove(index)}
              renderField={this.renderField}
            />
          </div>
        </div>
      </fieldset>
    );
  };

  renderField = (dateRange) => {
    const className = this.props.model.isTitleCustom
      ? 'custom-coverage-fields-datepicker'
      : 'managed-coverage-fields-datepicker';

    return (
      <Fragment>
        <div
          data-test-eholdings-coverage-fields-date-range-begin
          className={styles[className]}
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
          className={styles[className]}
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

  render() {
    const { model } = this.props;
    const renderCoverageFields = model.isTitleCustom
      ? this.renderCustomCoverageFields
      : this.renderManagedCoverageFields;

    return (
      <div data-test-eholdings-resource-coverage-fields>
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
