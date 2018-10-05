import React from 'react';
import { Field } from 'redux-form';
import { injectIntl, intlShape } from 'react-intl';

import { TextField } from '@folio/stripes/components';

function TitleNameField({ intl }) {
  return (
    <div data-test-eholdings-title-name-field>
      <Field
        name="name"
        type="text"
        component={TextField}
        label={intl.formatMessage({ id: 'ui-eholdings.label.name.isRequired' })}
      />
    </div>
  );
}

TitleNameField.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(TitleNameField);

export function validate(values, props) {
  let errors = {};

  if (values.name === '') {
    errors.name = props.intl.formatMessage({ id: 'ui-eholdings.validate.errors.customTitle.name' });
  }

  if (values.name.length >= 400) {
    errors.name = props.intl.formatMessage({ id: 'ui-eholdings.validate.errors.customTitle.name.length' });
  }

  return errors;
}
