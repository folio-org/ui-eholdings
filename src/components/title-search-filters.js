import React from 'react';
import { injectIntl, intlShape } from 'react-intl';

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
  let { intl } = props;
  return (
    <SearchFilters
      searchType="titles"
      availableFilters={[{
        name: 'sort',
        label: intl.formatMessage({ id: 'ui-eholdings.label.sortOptions' }),
        defaultValue: 'relevance',
        options: [
          { label: intl.formatMessage({ id: 'ui-eholdings.filter.sortOptions.relevance' }), value: 'relevance' },
          { label: intl.formatMessage({ id: 'ui-eholdings.label.title' }), value: 'name' }
        ]
      }, {
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
        label: intl.formatMessage({ id: 'ui-eholdings.label.publicationType' }),
        defaultValue: 'all',
        options: [
          { label: intl.formatMessage({ id: 'ui-eholdings.filter.all' }), value: 'all' },
          { label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.audioBook' }), value: 'audiobook' },
          { label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.book' }), value: 'book' },
          { label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.bookSeries' }), value: 'bookseries' },
          { label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.database' }), value: 'database' },
          { label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.journal' }), value: 'journal' },
          { label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.newsletter' }), value: 'newsletter' },
          { label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.newspaper' }), value: 'newspaper' },
          { label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.proceedings' }), value: 'proceedings' },
          { label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.report' }), value: 'report' },
          { label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.streamingAudio' }), value: 'streamingaudio' },
          { label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.streamingVideo' }), value: 'streamingvideo' },
          { label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.thesisdissertation' }), value: 'thesisdissertation' },
          { label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.website' }), value: 'website' },
          { label: intl.formatMessage({ id: 'ui-eholdings.filter.pubType.unspecified' }), value: 'unspecified' }
        ]
      }]}
      {...props}
    />
  );
}

TitleSearchFilters.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(TitleSearchFilters);
