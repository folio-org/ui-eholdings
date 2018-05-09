import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

import PackageSelectField, { validate as validatePackage } from '../_fields/package-select';
import CustomURLField, { validate as validateURL } from '../../resource/_fields/custom-url';

function AddTitleToPackageForm({ handleSubmit, onSubmit, packageOptions }) {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PackageSelectField options={packageOptions} />
      <CustomURLField />
    </form>
  );
}

AddTitleToPackageForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  packageOptions: PropTypes.array.isRequired
};

function validate(values) {
  return Object.assign({},
    validatePackage(values),
    validateURL(values));
}

export default reduxForm({
  form: 'AppTitleToPackage',
  enableReinitialize: true,
  destroyOnUnmount: false,
  validate
})(AddTitleToPackageForm);
