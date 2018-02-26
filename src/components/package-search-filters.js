import React from 'react';

import SearchFilters from './search-form/search-filters';

/**
 * Renders search filters with specific package filters.
 *
 * Once the API supports returning these filters via an endpoint, this
 * component should not be necessary. Instead the `search-form` should
 * recieve the available filters from the route and render the
 * search-filters component itself.
 */
export default function PackageSearchFilters(props) {
  return (
    <SearchFilters
      searchType="packages"
      availableFilters={[{
        name: 'selected',
        label: 'Selection status',
        defaultValue: 'all',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Selected', value: 'true' },
          { label: 'Not selected', value: 'false' },
          { label: 'Selected by EBSCO', value: 'ebsco' }
        ]
      }, {
        name: 'type',
        label: 'Content type',
        defaultValue: 'all',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Aggregated full text', value: 'aggregatedfulltext' },
          { label: 'Abstract and index', value: 'abstractandindex' },
          { label: 'E-book', value: 'ebook' },
          { label: 'E-journal', value: 'ejournal' },
          { label: 'Print', value: 'print' },
          { label: 'Online reference', value: 'onlinereference' },
          { label: 'Unknown', value: 'unknown' }
        ]
      }]}
      {...props}
    />
  );
}
