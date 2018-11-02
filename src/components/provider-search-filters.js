import React from 'react';
import { FormattedMessage } from 'react-intl';

import SearchFilters from './search-form/search-filters';

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
      availableFilters={[{
        name: 'sort',
        label: <FormattedMessage id="ui-eholdings.label.sortOptions" />,
        defaultValue: 'relevance',
        options: [
          { label: <FormattedMessage id="ui-eholdings.filter.sortOptions.relevance" />, value: 'relevance' },
          { label: <FormattedMessage id="ui-eholdings.label.provider" />, value: 'name' }
        ]
      }]}
      {...props}
    />
  );
}

export default ProviderSearchFilters;
