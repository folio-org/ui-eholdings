import React from 'react';
import { FormattedMessage } from 'react-intl';

import SearchFilters from './search-form/search-filters';

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
      searchType="packages"
      availableFilters={[{
        name: 'sort',
        label: <FormattedMessage id="ui-eholdings.label.sortOptions" />,
        defaultValue: 'relevance',
        options: [
          { label: <FormattedMessage id="ui-eholdings.filter.sortOptions.relevance" />, value: 'relevance' },
          { label: <FormattedMessage id="ui-eholdings.label.package" />, value: 'name' }
        ]
      },
      {
        name: 'selected',
        label: <FormattedMessage id="ui-eholdings.label.selectionStatus" />,
        defaultValue: 'all',
        options: [
          { label: <FormattedMessage id="ui-eholdings.filter.all" />, value: 'all' },
          { label: <FormattedMessage id="ui-eholdings.selected" />, value: 'true' },
          { label: <FormattedMessage id="ui-eholdings.notSelected" />, value: 'false' },
          { label: <FormattedMessage id="ui-eholdings.filter.selectionStatus.orderedThroughEbsco" />, value: 'ebsco' }
        ]
      }, {
        name: 'type',
        label: <FormattedMessage id="ui-eholdings.package.contentType" />,
        defaultValue: 'all',
        options: [
          { label: <FormattedMessage id="ui-eholdings.filter.all" />, value: 'all' },
          { label: <FormattedMessage id="ui-eholdings.filter.contentType.aggregated" />, value: 'aggregatedfulltext' },
          { label: <FormattedMessage id="ui-eholdings.filter.contentType.abstract" />, value: 'abstractandindex' },
          { label: <FormattedMessage id="ui-eholdings.filter.contentType.ebook" />, value: 'ebook' },
          { label: <FormattedMessage id="ui-eholdings.filter.contentType.ejournal" />, value: 'ejournal' },
          { label: <FormattedMessage id="ui-eholdings.filter.contentType.print" />, value: 'print' },
          { label: <FormattedMessage id="ui-eholdings.filter.contentType.onlineReference" />, value: 'onlinereference' },
          { label: <FormattedMessage id="ui-eholdings.filter.contentType.unknown" />, value: 'unknown' }
        ]
      }]}
      {...props}
    />
  );
}

export default PackageSearchFilters;
