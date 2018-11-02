import React from 'react';
import { Field } from 'redux-form';

import { TextField } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

function PublisherNameField() {
  return (
    <div data-test-eholdings-publisher-name-field>
      <Field
        name="publisherName"
        component={TextField}
        label={<FormattedMessage id="ui-eholdings.title.publisherName" />}
      />
    </div>
  );
}

export default PublisherNameField;

export function validate(values) {
  const errors = {};

  if (values.publisherName && values.publisherName.length > 250) {
    errors.publisherName = <FormattedMessage id="ui-eholdings.validate.errors.publisherName.length" />;
  }

  return errors;
}
