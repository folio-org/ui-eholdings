import React from 'react';
import { Field } from 'redux-form';
import { injectIntl, intlShape } from 'react-intl';

import { TextField } from '@folio/stripes-components';

function PackageNameField({ intl }) {
  return (
    <div data-test-eholdings-package-name-field>
      <Field
        name="name"
        type="text"
        component={TextField}
        label={intl.formatMessage({ id: 'ui-eholdings.label.name.isRequired' })}
      />
    </div>
  );
}

PackageNameField.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(PackageNameField);

export function validate(values, props) {
  let errors = {};

  if (values.name === '') {
    errors.name = props.intl.formatMessage({ id: 'ui-eholdings.validate.errors.customPackage.name' });
  }

  if (values.name.length >= 300) {
    errors.name = props.intl.formatMessage({ id: 'ui-eholdings.validate.errors.customPackage.name.length' });
  }

  return errors;
}
