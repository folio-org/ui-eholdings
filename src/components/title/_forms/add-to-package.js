import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

import PackageSelectField, { validate } from '../_fields/package-select';

function AddTitleToPackageForm({ handleSubmit, onSubmit, packageOptions }) {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PackageSelectField options={packageOptions} />
    </form>
  );
}

AddTitleToPackageForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  packageOptions: PropTypes.array.isRequired
};

export default reduxForm({
  form: 'AppTitleToPackage',
  enableReinitialize: true,
  destroyOnUnmount: false,
  validate
})(AddTitleToPackageForm);
