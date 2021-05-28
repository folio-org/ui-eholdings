import PropTypes from 'prop-types';

import PackageSelectField from '../_fields/package-select';
import CustomUrlFields from '../../custom-url-fields';

function AddTitleToPackage({ packageOptions }) {
  const filteredPackageOptions = packageOptions.filter(pkg => pkg.label !== '');
  return (
    <>
      <PackageSelectField options={filteredPackageOptions} />
      <CustomUrlFields
        onBlur={null} // preventing validation that is in onBlur
      />
    </>
  );
}

AddTitleToPackage.propTypes = {
  packageOptions: PropTypes.array.isRequired
};

export default AddTitleToPackage;
