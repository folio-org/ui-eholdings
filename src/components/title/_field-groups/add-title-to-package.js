import React from 'react';
import PropTypes from 'prop-types';

import PackageSelectField from '../_fields/package-select';
import CustomURLField from '../_fields/custom-url';

function AddTitleToPackage({ packageOptions }) {
  const filteredPackageOptions = packageOptions.filter(pkg => pkg.label !== '');
  return (
    <>
      <PackageSelectField options={filteredPackageOptions} />
      <CustomURLField />
    </>
  );
}

AddTitleToPackage.propTypes = {
  packageOptions: PropTypes.array.isRequired
};

export default AddTitleToPackage;
