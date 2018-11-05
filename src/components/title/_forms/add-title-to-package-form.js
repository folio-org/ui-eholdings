import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import PackageSelectField from '../_fields/package-select';
import CustomURLField from '../_fields/custom-url';

function AddTitleToPackageForm({ packageOptions }) {
  let filteredPackageOptions = packageOptions.filter(pkg => pkg.label !== '');
  return (
    <Fragment>
      <PackageSelectField options={filteredPackageOptions} />
      <CustomURLField />
    </Fragment>
  );
}

AddTitleToPackageForm.propTypes = {
  packageOptions: PropTypes.array.isRequired
};

export default AddTitleToPackageForm;
