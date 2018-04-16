import React, { Component } from 'react';
import { Field } from 'redux-form';

import { TextArea } from '@folio/stripes-components';
import styles from './description-field.css';

export default class DescriptionField extends Component {
  render() {
    return (
      <div
        data-test-eholdings-description-textarea
        className={styles['description-textarea']}
      >
        <Field
          name="decriptionField"
          component={TextArea}
          label="Description"
        />
      </div>
    );
  }
}

export function validate(values) {
  const errors = {};

  if (values.description && values.description.length > 1500) {
    errors.description = 'The value entered exceeds the 1500 character limit. Please enter a value that does not exceed 1500 characters.';
  }

  return errors;
}
