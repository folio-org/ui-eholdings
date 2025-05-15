import { memo } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import SearchFilters from './search-form/search-filters';
import PackagesFilter from './search-form/components/packages-filter';

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

/**
 * Renders search filters with specific title filters.
 *
 * Once the API supports returning these filters via an endpoint, this
 * component should not be necessary. Instead the `search-form` should
 * recieve the available filters from the route and render the
 * search-filters component itself.
 */
function TitleSearchFilters(props) {
  const {
    activeFilters,
    disabled,
    params,
    prevDataOfOptedPackage,
    resultsLength,
    isResultsLoading,
    isPackagesLoading,
    titlesFacets,
    onUpdate,
    availableFilters,
  } = props;

  return (
    <>
      <SearchFilters
        searchType="titles"
        availableFilters={availableFilters}
        {...props}
      />
      <PackagesFilter
        activeFilters={activeFilters}
        disabled={disabled}
        params={params}
        prevDataOfOptedPackage={prevDataOfOptedPackage}
        resultsLength={resultsLength}
        isResultsLoading={isResultsLoading}
        titlesFacets={titlesFacets}
        isPackagesLoading={isPackagesLoading}
        onUpdate={onUpdate}
      />
    </>
  );
}

TitleSearchFilters.propTypes = propTypes;

export default memo(TitleSearchFilters, isEqual);
