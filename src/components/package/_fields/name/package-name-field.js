import React from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes/components';

const MAX_CHARACTER_LENGTH = 200;

const validate = (value) => {
  let errors;

  if (!value) {
    errors = <FormattedMessage id="ui-eholdings.validate.errors.customPackage.name" />;
  }

  if (value && value.length >= MAX_CHARACTER_LENGTH) {
    errors = (
      <FormattedMessage
        id="ui-eholdings.validate.errors.customPackage.name.length"
        values={{ amount: MAX_CHARACTER_LENGTH }}
      />
    );
  }

  return errors;
};

export default function PackageNameField() {
  return (
    <div data-test-eholdings-package-name-field>
      <FormattedMessage id="ui-eholdings.label.name">
        {(ariaLabel) => (
          <Field
            name="name"
            type="text"
            component={TextField}
            label={<FormattedMessage id="ui-eholdings.label.name.isRequired" />}
            validate={validate}
            ariaLabel={ariaLabel}
          />
        )}
      </FormattedMessage>
    </div>
  );
}
