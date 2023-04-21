import {
  useState,
  useMemo,
  useEffect,
} from 'react';

const getOptionsFromPackageList = packages => packages.map(({ id, packageName }) => ({ value: id, label: packageName }));

const usePackageFilterSelectOptions = (allPackages, selectedPackages) => {
  const [searchFilters, setSearchFilters] = useState({});
  const [selectedOptions, setSelectedOptions] = useState(null);
  const allOptions = useMemo(() => getOptionsFromPackageList(allPackages), [allPackages]);

  useEffect(() => {
    // set options only once to have initial options. Need to wait until the data is loaded and selectedPackages changes.
    if (!selectedOptions && selectedPackages.length) {
      const initialSelectedOptions = getOptionsFromPackageList(selectedPackages);

      setSelectedOptions(initialSelectedOptions);
    }
  }, [selectedPackages, selectedOptions]);

  return {
    allOptions,
    selectedOptions,
    setSelectedOptions,
    searchFilters,
    setSearchFilters,
  };
};

export default usePackageFilterSelectOptions;
