import { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';

import { Icon } from '@folio/stripes/components';

import PackagesFilterAccordion from '../packages-filter-accordion';

const addMissingOptions = (dataOptions, packageIds = [], packagesFilterMap) => {
  const selectedPackages = Array.isArray(packageIds)
    ? packageIds
    : packageIds.split(',');

  const isMissingOption = (packageId) => !dataOptions.some(option => option.value === packageId);
  const findMissingOption = (packageId) => packagesFilterMap[packageId] || {};

  const formatMissionOption = ({ id, name }) => ({
    value: id,
    label: name,
    totalRecords: 0,
  });

  const missingOptions = selectedPackages
    .filter(isMissingOption)
    .map(findMissingOption)
    .map(formatMissionOption);

  return [...dataOptions, ...missingOptions];
};

const propTypes = {
  activeFilters: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired,
  packagesFilterMap: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  results: PropTypes.object.isRequired,
  titlesFacets: PropTypes.object.isRequired,
};

const PackagesFilter = ({
  activeFilters,
  disabled,
  params,
  titlesFacets,
  packagesFilterMap,
  results,
  onUpdate,
}) => {
  const initialTitlesFacets = useRef(titlesFacets).current;
  const { packageIds } = activeFilters;

  const dataOptions = useMemo(() => {
    const options = titlesFacets.packages?.map(({ id, name, count }) => ({
      value: id.toString(),
      label: name,
      totalRecords: count,
    })) || [];

    return addMissingOptions(options, packageIds, packagesFilterMap);
  }, [titlesFacets.packages, packageIds, packagesFilterMap]);

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
      onUpdate={onUpdate}
    />
  );
};

PackagesFilter.propTypes = propTypes;

export default PackagesFilter;
