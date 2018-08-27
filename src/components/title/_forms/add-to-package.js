import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

import PackageSelectField, { validate as validatePackage } from '../_fields/package-select';
import CustomURLField, { validate as validateURL } from '../../resource/_fields/custom-url';

function AddTitleToPackageForm({ handleSubmit, onSubmit, packageOptions }) {
  let filteredPackageOptions = packageOptions.filter(pkg => pkg.label !== '');
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PackageSelectField options={filteredPackageOptions} />
      <CustomURLField />
    </form>
  );
}

AddTitleToPackageForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  packageOptions: PropTypes.array.isRequired
};

function validate(values, props) {
  return Object.assign({},
    validatePackage(values, props),
    validateURL(values, props));
}

export default reduxForm({
  form: 'AddTitleToPackage',
  enableReinitialize: true,
  destroyOnUnmount: false,
  validate
})(AddTitleToPackageForm);
