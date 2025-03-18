import {
  useMemo,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import { Icon } from '@folio/stripes/components';

import PackagesFilterAccordion from '../packages-filter-accordion';

const propTypes = {
  activeFilters: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  isPackagesLoading: PropTypes.bool.isRequired,
  isResultsLoading: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  prevDataOfOptedPackage: PropTypes.object.isRequired,
  resultsLength: PropTypes.number.isRequired,
  titlesFacets: PropTypes.object.isRequired,
};

const PackagesFilter = ({
  activeFilters,
  disabled,
  params,
  isPackagesLoading,
  titlesFacets,
  prevDataOfOptedPackage,
  resultsLength,
  isResultsLoading,
  onUpdate,
}) => {
  const initialTitlesPackages = useRef(titlesFacets.packages).current;
  const prevActiveFilters = useRef(activeFilters);
  const { packageIds: selectedPackageId = '' } = activeFilters;

  const dataOptions = useMemo(() => {
    const options = titlesFacets.packages?.map(({ id, name, count }) => ({
      value: id.toString(),
      label: name,
      totalRecords: count,
    })) || [];

    if (!selectedPackageId) {
      return options;
    }

    const hasMissingOption = !options.some(option => option.value === selectedPackageId);

    if (hasMissingOption) {
      const missingOption = {
        value: prevDataOfOptedPackage.id,
        label: prevDataOfOptedPackage.name,
        totalRecords: 0,
      };

      return [...options, missingOption];
    }

    return options;
  }, [titlesFacets.packages, selectedPackageId, prevDataOfOptedPackage]);

  // this happens when the user returns to the Titles tab from Packages/Providers or from the result view.
  // and when user changes a filter and packages remains the same.
  const areStalePackages = (initialTitlesPackages === titlesFacets.packages)
    && isEqual(prevActiveFilters.current, activeFilters);

  const noResults = params.q && !resultsLength && !isResultsLoading;
  const isFirstResultsLoading = !activeFilters.packageIds && isResultsLoading && !resultsLength;

  if (!params.q || (noResults && !activeFilters.packageIds)) {
    return null;
  }

  if (areStalePackages || isFirstResultsLoading) {
    return <Icon icon="spinner-ellipsis" />;
  }

  prevActiveFilters.current = activeFilters;

  return (
    <PackagesFilterAccordion
      activeFilters={activeFilters}
      dataOptions={dataOptions}
      disabled={disabled}
      isLoading={isResultsLoading || isPackagesLoading}
      onUpdate={onUpdate}
    />
  );
};

PackagesFilter.propTypes = propTypes;

export default PackagesFilter;
