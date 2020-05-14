import React from 'react';

import SearchFilters from './search-form/search-filters';
import {
  titleSortFilterConfig,
  selectionStatusFilterConfig,
  publicationTypeFilterConfig,
} from '../constants';

/**
 * Renders search filters with specific title filters.
 *
 * Once the API supports returning these filters via an endpoint, this
 * component should not be necessary. Instead the `search-form` should
 * recieve the available filters from the route and render the
 * search-filters component itself.
 */
function TitleSearchFilters(props) {
  return (
    <SearchFilters
      searchType="titles"
      availableFilters={[
        titleSortFilterConfig,
        selectionStatusFilterConfig,
        publicationTypeFilterConfig,
      ]}
      {...props}
    />
  );
}

export default TitleSearchFilters;
