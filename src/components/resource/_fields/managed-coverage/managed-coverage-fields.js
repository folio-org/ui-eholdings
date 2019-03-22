import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';

import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import moment from 'moment';
import isEqual from 'lodash/isEqual';

import {
  Datepicker,
  Icon,
  RadioButton,
  RepeatableField
} from '@folio/stripes/components';

import CoverageDateList from '../../../coverage-date-list';

import validateDateRange from '../validate-date-range';

import { isBookPublicationType } from '../../../utilities';

import styles from './managed-coverage-fields.css';

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
            id="begin-coverage"
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
            id="end-coverage"
            format={(value) => (value ? moment.utc(value) : '')}
          />
        </div>
      </Fragment>
    );
  }

  renderCoverageFields = ({ fields, name, meta: { initial } }) => {
    const { model } = this.props;

    return (
      <fieldset>
        <div>
          <RadioButton
            label={<FormattedMessage id="ui-eholdings.label.managed.coverageDates" />}
            disabled={model.managedCoverages.length === 0}
            checked={fields.length === 0 && model.managedCoverages.length > 0}
            onChange={(e) => {
              if (e.target.value === 'on') {
                fields.removeAll();
              }
            }}
          />
          <div className={styles['coverage-fields-category']} data-test-eholdings-resource-edit-managed-coverage-list>
            {model.managedCoverages.length > 0 ? (
              <CoverageDateList
                coverageArray={model.managedCoverages}
                isYearOnly={isBookPublicationType(model.publicationType)}
              />
            ) : (
              <p><FormattedMessage id="ui-eholdings.resource.managedCoverageDates.notSet" /></p>
            )}
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
                initial.length > 0 && initial[0].beginCoverage ?
                  <FormattedMessage id="ui-eholdings.package.noCoverageDates" /> : ''
              }
              fields={fields}
              name={name}
              onAdd={() => fields.push({})}
              onRemove={(index) => fields.remove(index)}
              renderField={this.renderField}
            />
          </div>
        </div>
      </fieldset>
    );
  };

  render() {
    return (
      <div data-test-eholdings-resource-coverage-fields>
        <FieldArray
          component={this.renderCoverageFields}
          isEqual={isEqual}
          name="customCoverages"
          validate={this.validateDateRange}
        />
      </div>
    );
  }
}

export default injectIntl(ResourceCoverageFields);
