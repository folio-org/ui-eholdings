import PropTypes from 'prop-types';

import PackageSelectField from '../_fields/package-select';
import CustomUrlFields from '../../custom-url-fields';

const AddTitleToPackage = ({
  packageOptions,
  onPackageFilter,
  loadingOptions,
}) => {
  const filteredPackageOptions = packageOptions.filter(pkg => pkg.label !== '');
  return (
    <>
      <PackageSelectField
        options={filteredPackageOptions}
        onFilter={onPackageFilter}
        loadingOptions={loadingOptions}
      />
      <CustomUrlFields
        onBlur={null} // preventing validation that is in onBlur
      />
    </>
  );
};

AddTitleToPackage.propTypes = {
  loadingOptions: PropTypes.bool.isRequired,
  onPackageFilter: PropTypes.func.isRequired,
  packageOptions: PropTypes.arrayOf(PropTypes.shape({
    disabled: PropTypes.bool.isRequired,
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
};

export default AddTitleToPackage;
