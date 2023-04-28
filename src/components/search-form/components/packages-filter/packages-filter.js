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
  onUpdate: PropTypes.func.isRequired,
  packagesFacetCollection: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  prevDataOfOptedPackage: PropTypes.object.isRequired,
  results: PropTypes.object.isRequired,
  titlesFacets: PropTypes.object.isRequired,
};

const PackagesFilter = ({
  activeFilters,
  disabled,
  params,
  packagesFacetCollection,
  titlesFacets,
  prevDataOfOptedPackage,
  results,
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

  const noResults = params.q && !results.length && !results.isLoading;
  const isFirstResultsLoading = !activeFilters.packageIds && results.isLoading && !results.length;

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
      isLoading={results.isLoading || packagesFacetCollection.isLoading}
      onUpdate={onUpdate}
    />
  );
};

PackagesFilter.propTypes = propTypes;

export default PackagesFilter;
