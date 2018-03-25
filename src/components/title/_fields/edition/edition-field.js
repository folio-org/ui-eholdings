import React from 'react';
import { Field } from 'redux-form';

import { TextField } from '@folio/stripes-components';
import { injectIntl, intlShape } from 'react-intl';

function EditionField({ intl }) {
  return (
    <div data-test-eholdings-edition-field>
      <Field
        name="edition"
        component={TextField}
        label={intl.formatMessage({ id: 'ui-eholdings.title.edition' })}
      />
    </div>
  );
}

EditionField.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(EditionField);

export function validate(values) {
  const errors = {};

  if (values.edition && values.edition.trim() === '') {
    errors.edition = 'Invalid value.';
  }

  if (values.edition && values.edition.length > 250) {
    errors.edition = 'Value exceeds the 250 character limit.';
  }

  return errors;
}
