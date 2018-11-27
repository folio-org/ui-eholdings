import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import PackageSelectField from '../_fields/package-select';
import CustomURLField from '../_fields/custom-url';

function AddTitleToPackage({ packageOptions }) {
  let filteredPackageOptions = packageOptions.filter(pkg => pkg.label !== '');
  return (
    <Fragment>
      <PackageSelectField options={filteredPackageOptions} />
      <CustomURLField />
    </Fragment>
  );
}

AddTitleToPackage.propTypes = {
  packageOptions: PropTypes.array.isRequired
};

export default AddTitleToPackage;
