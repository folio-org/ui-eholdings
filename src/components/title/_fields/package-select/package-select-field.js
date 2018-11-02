import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { Select } from '@folio/stripes/components';

function PackageSelectField({ options }) {
  return (
    <div data-test-eholdings-package-select-field>
      <Field
        name="packageId"
        component={Select}
        label={<FormattedMessage id="ui-eholdings.title.package.isRequired" />}
      >
        <option value="" disabled>
          {options.length ? (
            <FormattedMessage id="ui-eholdings.title.chooseAPackage" />
          ) : (
            <FormattedMessage id="ui-eholdings.search.loading" />
          )}
        </option>
        {options.map(({ disabled, label, value }) => (
          <option disabled={disabled} key={value} value={value}>{label}</option>
        ))}
      </Field>
    </div>
  );
}

PackageSelectField.propTypes = {
  options: PropTypes.array.isRequired
};

export default PackageSelectField;

export function validate(values) {
  let errors = {};

  if (!values.packageId) {
    errors.packageId = <FormattedMessage id="ui-eholdings.validate.errors.packageSelect.required" />;
  }

  return errors;
}
