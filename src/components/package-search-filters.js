import React from 'react';
import { injectIntl, intlShape } from 'react-intl';

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
  let { intl } = props;
  return (
    <SearchFilters
      searchType="packages"
      availableFilters={[{
        name: 'sort',
        label: intl.formatMessage({ id: 'ui-eholdings.label.sortOptions' }),
        defaultValue: 'relevance',
        options: [
          { label: intl.formatMessage({ id: 'ui-eholdings.filter.sortOptions.relevance' }), value: 'relevance' },
          { label: intl.formatMessage({ id: 'ui-eholdings.label.package' }), value: 'name' }
        ]
      },
        {
        name: 'selected',
        label: intl.formatMessage({ id: 'ui-eholdings.label.selectionStatus' }),
        defaultValue: 'all',
        options: [
          { label: intl.formatMessage({ id: 'ui-eholdings.filter.all' }), value: 'all' },
          { label: intl.formatMessage({ id: 'ui-eholdings.selected' }), value: 'true' },
          { label: intl.formatMessage({ id: 'ui-eholdings.notSelected' }), value: 'false' },
          { label: intl.formatMessage({ id: 'ui-eholdings.filter.selectionStatus.orderedThroughEbsco' }), value: 'ebsco' }
        ]
      }, {
        name: 'type',
        label: intl.formatMessage({ id: 'ui-eholdings.package.contentType' }),
        defaultValue: 'all',
        options: [
          { label: intl.formatMessage({ id: 'ui-eholdings.filter.all' }), value: 'all' },
          { label: intl.formatMessage({ id: 'ui-eholdings.filter.contentType.aggregated' }), value: 'aggregatedfulltext' },
          { label: intl.formatMessage({ id: 'ui-eholdings.filter.contentType.abstract' }), value: 'abstractandindex' },
          { label: intl.formatMessage({ id: 'ui-eholdings.filter.contentType.ebook' }), value: 'ebook' },
          { label: intl.formatMessage({ id: 'ui-eholdings.filter.contentType.ejournal' }), value: 'ejournal' },
          { label: intl.formatMessage({ id: 'ui-eholdings.filter.contentType.print' }), value: 'print' },
          { label: intl.formatMessage({ id: 'ui-eholdings.filter.contentType.onlineReference' }), value: 'onlinereference' },
          { label: intl.formatMessage({ id: 'ui-eholdings.filter.contentType.unknown' }), value: 'unknown' }
        ]
      }]}
      {...props}
    />
  );
}

PackageSearchFilters.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(PackageSearchFilters);
