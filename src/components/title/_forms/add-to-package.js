import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

import PackageSelectField from '../_fields/package-select';
import CustomURLField from '../../resource/_fields/custom-url';

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

export default reduxForm({
  form: 'AddTitleToPackage',
  enableReinitialize: true,
  destroyOnUnmount: false
})(AddTitleToPackageForm);
