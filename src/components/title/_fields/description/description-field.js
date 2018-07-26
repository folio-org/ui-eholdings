import React from 'react';
import { Field } from 'redux-form';

import { TextArea } from '@folio/stripes-components';
import { injectIntl, intlShape } from 'react-intl';
import styles from './description-field.css';

function DescriptionField({ intl }) {
  return (
    <div
      data-test-eholdings-description-textarea
      className={styles['description-textarea']}
    >
      <Field
        name="description"
        component={TextArea}
        label={intl.formatMessage({ id: 'ui-eholdings.title.description' })}
      />
    </div>
  );
}

DescriptionField.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(DescriptionField);

export function validate(values) {
  const errors = {};

  if (values.description && values.description.length > 1500) {
    errors.description = 'The value entered exceeds the 1500 character limit. Please enter a value that does not exceed 1500 characters.';
  }

  return errors;
}
