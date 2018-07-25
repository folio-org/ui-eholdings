import React from 'react';
import { Field } from 'redux-form';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

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
        label={intl.formatMessage({ id: 'ui-eholdings.label.name.isRequired' })}
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
    errors.name = <FormattedMessage id="ui-eholdings.validate.errors.customPackage.name" />;
  }

  if (values.name.length >= 300) {
    errors.name = <FormattedMessage id="ui-eholdings.validate.errors.customPackage.name.length" />;
  }

  return errors;
}
