import React from 'react';
import { Field } from 'redux-form';

import { TextArea } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

function DescriptionField() {
  return (
    <div data-test-eholdings-description-textarea>
      <Field
        name="description"
        component={TextArea}
        label={<FormattedMessage id="ui-eholdings.title.description" />}
      />
    </div>
  );
}

export default DescriptionField;

export function validate(values) {
  const errors = {};

  if (values.description && values.description.length > 1500) {
    errors.description = <FormattedMessage id="ui-eholdings.validate.errors.title.description.length" />;
  }

  return errors;
}
