import React, { Component } from 'react';
import { Field } from 'redux-form';

import { TextField } from '@folio/stripes-components';
import styles from './resource-name-field.css';

export default class ResourceNameField extends Component {
  render() {
    return (
      <div
        data-test-eholdings-resource-name-field
        className={styles['resource-name-field']}
      >
        <Field
          name="name"
          type="text"
          component={TextField}
          label="Name"
        />
      </div>
    );
  }
}

export function validate(values) {
  let errors = {};

  if (values.name === '') {
    errors.name = 'Custom titles must have a name.';
  }

  if (values.name.length >= 400) {
    errors.name = 'Must be less than 400 characters.';
  }

  return errors;
}
