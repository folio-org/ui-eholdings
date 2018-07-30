import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { injectIntl, intlShape } from 'react-intl';

import { Select } from '@folio/stripes-components';

function PackageSelectField({ intl, options }) {
  let optionsWithPlaceholder = [{
    label: options.length ? 'Choose a package' : '...Loading',
    disabled: true,
    value: ''
  }, ...options];

  return (
    <div data-test-eholdings-package-select-field>
      <Field
        name="packageId"
        component={Select}
        label={intl.formatMessage({ id: 'ui-eholdings.title.package.isRequired' })}
        dataOptions={optionsWithPlaceholder}
      />
    </div>
  );
}

PackageSelectField.propTypes = {
  intl: intlShape.isRequired,
  options: PropTypes.array.isRequired
};

export default injectIntl(PackageSelectField);

export function validate(values) {
  let errors = {};

  if (!values.packageId) {
    errors.packageId = 'Custom titles must belong to a package.';
  }

  return errors;
}
