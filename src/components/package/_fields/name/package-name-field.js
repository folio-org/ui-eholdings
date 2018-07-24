import React from 'react';
import { Field } from 'redux-form';
import { injectIntl, intlShape } from 'react-intl';

import { TextField } from '@folio/stripes-components';
import styles from './package-name-field.css';

function PackageNameField({ intl }) {
  return (
    <div
      data-test-eholdings-package-name-field
      className={styles['package-name-field']}
    >
      <Field
        name="name"
        type="text"
        component={TextField}
        label={intl.formatMessage({ id: 'ui-eholdings.name.isRequired' })}
      />
    </div>
  );
}

PackageNameField.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(PackageNameField);

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
