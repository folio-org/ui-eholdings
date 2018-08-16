import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { injectIntl, intlShape } from 'react-intl';

import { Select } from '@folio/stripes-components';

function PackageSelectField({ intl, options }) {
  let optionsWithPlaceholder = [{
    label: options.length ?
      intl.formatMessage({ id: 'ui-eholdings.title.chooseAPackage' }) :
      intl.formatMessage({ id: 'ui-eholdings.search.loading' }),
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

export function validate(values, props) {
  let errors = {};

  if (!values.packageId) {
    errors.packageId = props.intl.formatMessage({ id: 'ui-eholdings.validate.errors.packageSelect.required' });
  }

  return errors;
}
