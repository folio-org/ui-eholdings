import React, { Component } from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';

import isEqual from 'lodash/isEqual';

import {
  Button,
  IconButton,
  Select,
  TextField,
} from '@folio/stripes/components';

import styles from './custom-embargo-fields.css';

function validateEmbargoValue(value) {
  let error;
  const customEmbargoValueIsDecimal = Number(value) % 1 !== 0
    || (value && value.toString().indexOf('.') !== -1);

  if (value <= 0) {
    error = <FormattedMessage id="ui-eholdings.validate.errors.embargoPeriod.moreThanZero" />;
  }

  if (customEmbargoValueIsDecimal) {
    error = <FormattedMessage id="ui-eholdings.validate.errors.embargoPeriod.decimal" />;
  }

  if (Number.isNaN(Number(value))) {
    error = <FormattedMessage id="ui-eholdings.validate.errors.embargoPeriod.number" />;
  }

  return error;
}

function validateEmbargoUnit(embargoUnit, { customEmbargoPeriod }) {
  let error;
  const embargoValueIsSet = customEmbargoPeriod.length && customEmbargoPeriod[0].embargoValue > 0;

  if (embargoValueIsSet && !embargoUnit) {
    error = <FormattedMessage id="ui-eholdings.validate.errors.embargoPeriod.unit" />;
  }

  return error;
}

export default class CustomEmbargoFields extends Component {
  renderEmbargoUnitField({ name: fieldsName }) {
    return (
      <div
        data-test-eholdings-custom-embargo-select
        className={styles['custom-embargo-select']}
      >
        <FormattedMessage id="ui-eholdings.label.selectTimePeriod">
          {placeholder => (
            <Field
              name={`${fieldsName}[0].embargoUnit`}
              component={Select}
              validate={validateEmbargoUnit}
              placeholder={placeholder}
            >
              <FormattedMessage id="ui-eholdings.label.days">
                {(message) => <option value="Days">{message}</option>}
              </FormattedMessage>
              <FormattedMessage id="ui-eholdings.label.weeks">
                {(message) => <option value="Weeks">{message}</option>}
              </FormattedMessage>
              <FormattedMessage id="ui-eholdings.label.months">
                {(message) => <option value="Months">{message}</option>}
              </FormattedMessage>
              <FormattedMessage id="ui-eholdings.label.years">
                {(message) => <option value="Years">{message}</option>}
              </FormattedMessage>
            </Field>
          )}
        </FormattedMessage>
      </div>
    );
  }

  renderEmbargoValueField(fields, initialValues) {
    return (
      <div
        data-test-eholdings-custom-embargo-textfield
        className={styles['custom-embargo-text-field']}
      >
        <FormattedMessage id="ui-eholdings.number">
          {placeholder => (
            <Field
              name={`${fields.name}[0].embargoValue`}
              component={TextField}
              placeholder={placeholder}
              autoFocus={!initialValues.length}
              validate={validateEmbargoValue}
            />
          )}
        </FormattedMessage>
      </div>
    );
  }

  renderRemoveButton(fields) {
    return (
      <div
        data-test-eholdings-custom-embargo-remove-row-button
        className={styles['custom-embargo-clear-row']}
      >
        <FormattedMessage id="ui-eholdings.resource.embargoPeriod.clear">
          {ariaLabel => (
            <IconButton
              icon="trash"
              onClick={fields.pop}
              ariaLabel={ariaLabel}
            />
          )}
        </FormattedMessage>
      </div>
    );
  }

  renderInputs(fields, initialValues) {
    return (
      <div className={styles['custom-embargo-fields']}>
        {this.renderEmbargoValueField(fields, initialValues)}
        {this.renderEmbargoUnitField(fields)}
        {this.renderRemoveButton(fields)}
      </div>
    );
  }

  renderAddButton(fields, initialValues) {
    const removalWarning = (
      <p data-test-eholdings-embargo-fields-saving-will-remove>
        <FormattedMessage id="ui-eholdings.resource.embargoPeriod.saveWillRemove" />
      </p>
    );

    return (
      <div>
        {!!initialValues.length && removalWarning}
        <div
          className={styles['custom-embargo-add-row-button']}
          data-test-eholdings-custom-embargo-add-row-button
        >
          <Button
            type="button"
            onClick={() => { fields.push({ embargoValue: 0 }); }}
          >
            <FormattedMessage id="ui-eholdings.resource.embargoPeriod.addCustom" />
          </Button>
        </div>
      </div>
    );
  }

  renderEmbargoField = ({ fields, meta: { initial: initialValues } }) => {
    const fieldsData = [
      fields,
      initialValues,
    ];

    return fields.value.length
      ? this.renderInputs(...fieldsData)
      : this.renderAddButton(...fieldsData);
  }

  render() {
    return (
      <FieldArray
        isEqual={isEqual}
        render={this.renderEmbargoField}
        name="customEmbargoPeriod"
      />
    );
  }
}
