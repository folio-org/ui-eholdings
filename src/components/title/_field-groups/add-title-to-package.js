import PropTypes from 'prop-types';

import PackageSelectField from '../_fields/package-select';
import CustomUrlFields from '../../custom-url-fields';

const AddTitleToPackage = ({ packageOptions }) => {
  const filteredPackageOptions = packageOptions.filter(pkg => pkg.label !== '');
  return (
    <>
      <PackageSelectField options={filteredPackageOptions} />
      <CustomUrlFields
        onBlur={null} // preventing validation that is in onBlur
      />
    </>
  );
};

AddTitleToPackage.propTypes = {
  packageOptions: PropTypes.arrayOf(PropTypes.shape({
    disabled: PropTypes.bool.isRequired,
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })),
};

export default AddTitleToPackage;
