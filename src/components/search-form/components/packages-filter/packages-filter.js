import {
  useEffect,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import { Icon } from '@folio/stripes/components';

import PackagesFilterAccordion from '../packages-filter-accordion';

const propTypes = {
  activeFilters: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  prevDataOfOptedPackage: PropTypes.object.isRequired,
  results: PropTypes.object.isRequired,
  titlesFacets: PropTypes.object.isRequired,
};

const PackagesFilter = ({
  activeFilters,
  disabled,
  params,
  titlesFacets,
  prevDataOfOptedPackage,
  results,
  onUpdate,
}) => {
  const initialTitlesFacets = useRef(titlesFacets).current;
  const { packageIds: selectedPackageId = '' } = activeFilters;

  const [dataOptions, setDataOptions] = useState([]);
  const [prevPackageId, setPrevPackageId] = useState('');

  const handleUpdate = (filters) => {
    setPrevPackageId(selectedPackageId);
    onUpdate(filters);
  };

  useEffect(() => {
    // We block changing dataOptions when changing the `Packages` filter, because the newly selected package
    // will be counted for the subsequent option.count and it won't match total results.
    const isFirstPackageSelection = !prevPackageId && selectedPackageId;
    const isNotFirstPackageSelection = prevPackageId && selectedPackageId && (prevPackageId !== selectedPackageId);

    if (isFirstPackageSelection || isNotFirstPackageSelection) {
      return;
    }

    // when the option is missing, set dataOptions to 0 for the totalRecords, or reset dataOptions.
    if (!titlesFacets.packages) {
      const missingOption = [{
        value: prevDataOfOptedPackage.id,
        label: prevDataOfOptedPackage.name,
        totalRecords: 0,
      }];

      const options = selectedPackageId ? missingOption : [];

      setDataOptions(options);

      return;
    }

    const options = titlesFacets.packages.map(({ id, name, count }) => ({
      value: id.toString(),
      label: name,
      totalRecords: count,
    }));

    setDataOptions(options);
  }, [titlesFacets.packages, selectedPackageId, prevPackageId, prevDataOfOptedPackage]);

  // this happens when the user returns to the Titles tab from Packages/Providers or from the result view.
  const areStaleFacets = initialTitlesFacets === titlesFacets;

  const noResults = params.q && !results.length && !results.isLoading;
  const isFirstResultsLoading = !activeFilters.packageIds && results.isLoading && !results.length;

  if (!params.q || (noResults && !activeFilters.packageIds)) {
    return null;
  }

  if (areStaleFacets || isFirstResultsLoading) {
    return <Icon icon="spinner-ellipsis" />;
  }

  return (
    <PackagesFilterAccordion
      activeFilters={activeFilters}
      dataOptions={dataOptions}
      disabled={disabled}
      isLoading={results.isLoading}
      onUpdate={handleUpdate}
    />
  );
};

PackagesFilter.propTypes = propTypes;

export default PackagesFilter;
