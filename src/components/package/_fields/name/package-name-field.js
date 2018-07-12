import React, { Component } from 'react';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes-components';
import styles from './package-name-field.css';

export default class PackageNameField extends Component {
  render() {
    return (
      <div
        data-test-eholdings-package-name-field
        className={styles['package-name-field']}
      >
        <Field
          name="name"
          type="text"
          component={TextField}
          label={<FormattedMessage id="ui-eholdings.package.name.isRequired" />}
        />
      </div>
    );
  }
}

export function validate(values) {
  let errors = {};

  if (values.name === '') {
    errors.name = 'Custom packages must have a name.';
  }

  if (values.name.length >= 300) {
    errors.name = 'Must be less than 300 characters.';
  }

  return errors;
}
