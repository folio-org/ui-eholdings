import {
  useMemo,
  useRef,
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

  const dataOptions = useMemo(() => {
    if (selectedPackageId && !titlesFacets.packages) {
      return [{
        value: prevDataOfOptedPackage.id,
        label: prevDataOfOptedPackage.name,
        totalRecords: 0,
      }];
    }

    return titlesFacets.packages?.map(({ id, name, count }) => ({
      value: id.toString(),
      label: name,
      totalRecords: count,
    })) || [];
  }, [titlesFacets.packages, selectedPackageId, prevDataOfOptedPackage]);

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
