import React, { Component } from 'react';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes-components';
import styles from './title-name-field.css';

export default class TitleNameField extends Component {
  render() {
    return (
      <div
        data-test-eholdings-title-name-field
        className={styles['title-name-field']}
      >
        <Field
          name="name"
          type="text"
          component={TextField}
          label={<FormattedMessage id="ui-eholdings.title.name.isRequired" />}
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
