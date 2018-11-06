import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { Select } from '@folio/stripes/components';

function validate(value) {
  return value ? undefined : <FormattedMessage id="ui-eholdings.validate.errors.packageSelect.required" />;
}

function PackageSelectField({ options }) {
  return (
    <div data-test-eholdings-package-select-field>
      <Field
        name="packageId"
        component={Select}
        label={<FormattedMessage id="ui-eholdings.title.package.isRequired" />}
        validate={validate}
      >
        {options.length ? (
          <FormattedMessage id="ui-eholdings.title.chooseAPackage">
            {option => (
              <option value="" disabled>{option}</option>
            )}
          </FormattedMessage>
        ) : (
          <FormattedMessage id="ui-eholdings.search.loading">
            {option => (
              <option value="" disabled>{option}</option>
            )}
          </FormattedMessage>
        )}
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
