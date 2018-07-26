import React from 'react';
import { Field } from 'redux-form';

import { TextField } from '@folio/stripes-components';
import { injectIntl, intlShape } from 'react-intl';
import styles from './publisher-name.css';

function PublisherNameField({ intl }) {
  return (
    <div
      data-test-eholdings-publisher-name-field
      className={styles['publisher-name-field']}
    >
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

export function validate(values) {
  const errors = {};

  if (values.publisherName && values.publisherName.length > 250) {
    errors.publisherName = 'The value entered exceeds the 250 character limit. Please enter a value that does not exceed 250 characters.';
  }

  return errors;
}
