import React from 'react';

import SearchFilters from './search-form/search-filters';
import {
  searchTypes,
  packageSortFilterConfig,
  selectionStatusFilterConfig,
  contentTypeFilterConfig,
} from '../constants';
/**
 * Renders search filters with specific package filters.
 *
 * Once the API supports returning these filters via an endpoint, this
 * component should not be necessary. Instead the `search-form` should
 * recieve the available filters from the route and render the
 * search-filters component itself.
 */
function PackageSearchFilters(props) {
  return (
    <SearchFilters
      searchType={searchTypes.PACKAGES}
      availableFilters={[
        packageSortFilterConfig,
        selectionStatusFilterConfig,
        contentTypeFilterConfig,
      ]}
      {...props}
    />
  );
}

export default PackageSearchFilters;
