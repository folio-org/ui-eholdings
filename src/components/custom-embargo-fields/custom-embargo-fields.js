import React, { Component } from 'react';
import { Field } from 'redux-form';

import TextField from '@folio/stripes-components/lib/TextField';
import Select from '@folio/stripes-components/lib/Select';
import styles from './custom-embargo-fields.css';

export default class CustomEmbargoFields extends Component {
  render() {
    return (
      <div className={styles['custom-embargo-fields']}>
        <div
          data-test-eholdings-custom-embargo-textfield
          className={styles['custom-embargo-text-field']}
        >
          <Field
            name="customEmbargoValue"
            component={TextField}
            type="number"
            parse={value => (!value ? null : (Number.isNaN(Number(value)) ? '' : Number(value)))}
          />
        </div>

        <div
          data-test-eholdings-custom-embargo-select
          className={styles['custom-embargo-select']}
        >
          <Field
            name="customEmbargoUnit"
            component={Select}
            dataOptions={[
              { value: '', label: 'None' },
              { value: 'Days', label: 'Days' },
              { value: 'Weeks', label: 'Weeks' },
              { value: 'Months', label: 'Months' },
              { value: 'Years', label: 'Years' }
            ]}
          />
        </div>
      </div>
    );
  }
}

export function validate(values) {
  const errors = {};

  if (Number.isNaN(Number(values.customEmbargoValue))) {
    errors.customEmbargoValue = 'Must be a number';
  }

  if (values.customEmbargoValue === null) {
    errors.customEmbargoValue = 'Value cannot be null';
  }

  if (values.customEmbargoValue < 0 || (values.customEmbargoValue === 0 && values.customEmbargoUnit !== '')) {
    errors.customEmbargoValue = 'Enter value greater than 0';
  }

  if (values.customEmbargoValue > 0 && values.customEmbargoUnit === '') {
    errors.customEmbargoUnit = 'Select a valid unit';
  }
  return errors;
}
