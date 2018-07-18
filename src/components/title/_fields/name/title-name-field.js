import React from 'react';
import { Field } from 'redux-form';
import { injectIntl, intlShape } from 'react-intl';

import { TextField } from '@folio/stripes-components';
import styles from './title-name-field.css';

function TitleNameField({ intl }) {
  return (
    <div
      data-test-eholdings-title-name-field
      className={styles['title-name-field']}
    >
      <Field
        name="name"
        type="text"
        component={TextField}
        label={intl.formatMessage({ id: 'ui-eholdings.title.name.isRequired' })}
      />
    </div>
  );
}

TitleNameField.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(TitleNameField);

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
