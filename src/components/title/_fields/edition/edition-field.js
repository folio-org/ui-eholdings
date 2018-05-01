import React from 'react';
import { Field } from 'redux-form';

import { TextField } from '@folio/stripes-components';
import styles from './edition-field.css';

export default function EditionField() {
  return (
    <div
      data-test-eholdings-edition-field
      className={styles['edition-field']}
    >
      <Field
        name="edition"
        component={TextField}
        label="Edition"
      />
    </div>
  );
}

export function validate(values) {
  const errors = {};

  if (values.edition && values.edition.trim() === '') {
    errors.edition = 'Invalid value.';
  }

  if (values.edition && values.edition.length > 250) {
    errors.edition = 'Value exceeds the 250 character limit.';
  }

  return errors;
}
