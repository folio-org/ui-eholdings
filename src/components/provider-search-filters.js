import React from 'react';

import SearchFilters from './search-form/search-filters';

/**
 * Renders search filters with specific provider filters.
 *
 * Once the API supports returning these filters via an endpoint, this
 * component should not be necessary. Instead the `search-form` should
 * recieve the available filters from the route and render the
 * search-filters component itself.
 */
export default function ProviderSearchFilters(props) {
  return (
    <SearchFilters
      searchType="providers"
      availableFilters={[{
        name: 'sort',
        label: 'Sort options',
        defaultValue: 'relevance',
        options: [
          { label: 'Relevance', value: 'relevance' },
          { label: 'Provider', value: 'name' }
        ]
      }]}
      {...props}
    />
  );
}
