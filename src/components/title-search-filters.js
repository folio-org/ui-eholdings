import React from 'react';
import { FormattedMessage } from 'react-intl';

import SearchFilters from './search-form/search-filters';

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
      availableFilters={[{
        name: 'sort',
        label: <FormattedMessage id="ui-eholdings.label.sortOptions" />,
        defaultValue: 'relevance',
        options: [
          { label: <FormattedMessage id="ui-eholdings.filter.sortOptions.relevance" />, value: 'relevance' },
          { label: <FormattedMessage id="ui-eholdings.label.title" />, value: 'name' }
        ]
      }, {
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
        label: <FormattedMessage id="ui-eholdings.label.publicationType" />,
        defaultValue: 'all',
        options: [
          { label: <FormattedMessage id="ui-eholdings.filter.all" />, value: 'all' },
          { label: <FormattedMessage id="ui-eholdings.filter.pubType.audioBook" />, value: 'audiobook' },
          { label: <FormattedMessage id="ui-eholdings.filter.pubType.book" />, value: 'book' },
          { label: <FormattedMessage id="ui-eholdings.filter.pubType.bookSeries" />, value: 'bookseries' },
          { label: <FormattedMessage id="ui-eholdings.filter.pubType.database" />, value: 'database' },
          { label: <FormattedMessage id="ui-eholdings.filter.pubType.journal" />, value: 'journal' },
          { label: <FormattedMessage id="ui-eholdings.filter.pubType.newsletter" />, value: 'newsletter' },
          { label: <FormattedMessage id="ui-eholdings.filter.pubType.newspaper" />, value: 'newspaper' },
          { label: <FormattedMessage id="ui-eholdings.filter.pubType.proceedings" />, value: 'proceedings' },
          { label: <FormattedMessage id="ui-eholdings.filter.pubType.report" />, value: 'report' },
          { label: <FormattedMessage id="ui-eholdings.filter.pubType.streamingAudio" />, value: 'streamingaudio' },
          { label: <FormattedMessage id="ui-eholdings.filter.pubType.streamingVideo" />, value: 'streamingvideo' },
          { label: <FormattedMessage id="ui-eholdings.filter.pubType.thesisdissertation" />, value: 'thesisdissertation' },
          { label: <FormattedMessage id="ui-eholdings.filter.pubType.website" />, value: 'website' },
          { label: <FormattedMessage id="ui-eholdings.filter.pubType.unspecified" />, value: 'unspecified' }
        ]
      }]}
      {...props}
    />
  );
}

export default TitleSearchFilters;
