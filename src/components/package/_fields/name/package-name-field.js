import React from 'react';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes/components';

function PackageNameField() {
  return (
    <div data-test-eholdings-package-name-field>
      <Field
        name="name"
        type="text"
        component={TextField}
        label={<FormattedMessage id="ui-eholdings.label.name.isRequired" />}
      />
    </div>
  );
}

export default PackageNameField;

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
