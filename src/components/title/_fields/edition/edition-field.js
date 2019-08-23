import React from 'react';
import { Field } from 'react-final-form';

import { TextField } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

function validate(value) {
  let errors;

  if (value && value.trim() === '') {
    errors = <FormattedMessage id="ui-eholdings.validate.errors.edition.value" />;
  }

  if (value && value.length > 250) {
    errors = <FormattedMessage id="ui-eholdings.validate.errors.edition.length" />;
  }

  return errors;
}

export default function EditionField() {
  return (
    <div data-test-eholdings-edition-field>
      <FormattedMessage id="ui-eholdings.title.edition">
        {(fieldName) => (
          <Field
            name="edition"
            component={TextField}
            label={fieldName}
            validate={validate}
            ariaLabel={fieldName}
          />
        )}
      </FormattedMessage>
    </div>
  );
}
