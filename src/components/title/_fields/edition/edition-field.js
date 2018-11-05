import React from 'react';
import { Field } from 'redux-form';

import { TextField } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

function EditionField() {
  return (
    <div data-test-eholdings-edition-field>
      <Field
        name="edition"
        component={TextField}
        label={<FormattedMessage id="ui-eholdings.title.edition" />}
      />
    </div>
  );
}

export default EditionField;

export function validate(values) {
  const errors = {};

  if (values.edition && values.edition.trim() === '') {
    errors.edition = <FormattedMessage id="ui-eholdings.validate.errors.edition.value" />;
  }

  if (values.edition && values.edition.length > 250) {
    errors.edition = <FormattedMessage id="ui-eholdings.validate.errors.edition.length" />;
  }

  return errors;
}
