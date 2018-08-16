import React from 'react';
import { Field } from 'redux-form';

import { TextField } from '@folio/stripes-components';
import { injectIntl, intlShape } from 'react-intl';

function PublisherNameField({ intl }) {
  return (
    <div data-test-eholdings-publisher-name-field>
      <Field
        name="publisherName"
        component={TextField}
        label={intl.formatMessage({ id: 'ui-eholdings.title.publisherName' })}
      />
    </div>
  );
}

PublisherNameField.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(PublisherNameField);

export function validate(values, { intl }) {
  const errors = {};

  if (values.publisherName && values.publisherName.length > 250) {
    errors.publisherName = intl.formatMessage({ id: 'ui-eholdings.validate.errors.publisherName.length' });
  }

  return errors;
}
