import React from 'react';

import SearchFilters from './search-form/search-filters';
import { providerSortFilterConfig } from '../constants';

/**
 * Renders search filters with specific provider filters.
 *
 * Once the API supports returning these filters via an endpoint, this
 * component should not be necessary. Instead the `search-form` should
 * recieve the available filters from the route and render the
 * search-filters component itself.
 */
function ProviderSearchFilters(props) {
  return (
    <SearchFilters
      searchType="providers"
      availableFilters={[providerSortFilterConfig]}
      {...props}
    />
  );
}

export default ProviderSearchFilters;
