import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { Select } from '@folio/stripes-components';
import styles from './package-select-field.css';

export default function PackageSelectField({ options }) {
  let optionsWithPlaceholder = [{
    label: options.length ? 'Choose a package' : '...Loading',
    disabled: true,
    value: ''
  }, ...options];

  return (
    <div
      data-test-eholdings-package-select-field
      className={styles['package-select-field']}
    >
      <Field
        name="packageId"
        component={Select}
        label={<FormattedMessage id="ui-eholdings.title.package.isRequired" />}
        dataOptions={optionsWithPlaceholder}
      />
    </div>
  );
}

PackageSelectField.propTypes = {
  options: PropTypes.array.isRequired
};

export function validate(values) {
  let errors = {};

  if (!values.packageId) {
    errors.packageId = 'Custom titles must belong to a package.';
  }

  return errors;
}
