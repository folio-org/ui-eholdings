import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { Select } from '@folio/stripes-components';
import styles from './package-select-field.css';

export default function PackageSelectField({ packages }) {
  let options = packages.map(pkg => ({ label: pkg.name, value: pkg.id }));

  options.unshift({
    label: options.length ? 'Choose a package' : '...Loading',
    disabled: true,
    value: ''
  });

  return (
    <div
      data-test-eholdings-package-select-field
      className={styles['package-select-field']}
    >
      <Field
        name="packageId"
        component={Select}
        label="Package"
        dataOptions={options}
      />
    </div>
  );
}

PackageSelectField.propTypes = {
  packages: PropTypes.object.isRequired
};

export function validate(values) {
  let errors = {};

  if (!values.packageId) {
    errors.packageId = 'Custom titles must belong to a package.';
  }

  return errors;
}
