import React from 'react';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes/components';

function TitleNameField() {
  return (
    <div data-test-eholdings-title-name-field>
      <Field
        name="name"
        type="text"
        component={TextField}
        label={<FormattedMessage id="ui-eholdings.label.name.isRequired" />}
      />
    </div>
  );
}

export default TitleNameField;

export function validate(values) {
  let errors = {};

  if (values.name === '') {
    errors.name = <FormattedMessage id="ui-eholdings.validate.errors.customTitle.name" />;
  }

  if (values.name.length >= 400) {
    errors.name = <FormattedMessage id="ui-eholdings.validate.errors.customTitle.name.length" />;
  }

  return errors;
}
