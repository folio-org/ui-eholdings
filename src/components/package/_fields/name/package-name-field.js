import React from 'react';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes/components';

const validate = (value) => {
  let errors;

  if (value === '') {
    errors = <FormattedMessage id="ui-eholdings.validate.errors.customPackage.name" />;
  }

  if (value.length >= 300) {
    errors = <FormattedMessage id="ui-eholdings.validate.errors.customPackage.name.length" />;
  }

  return errors;
};

export default function PackageNameField() {
  return (
    <div data-test-eholdings-package-name-field>
      <Field
        name="name"
        type="text"
        component={TextField}
        label={<FormattedMessage id="ui-eholdings.label.name.isRequired" />}
        validate={validate}
      />
    </div>
  );
}
