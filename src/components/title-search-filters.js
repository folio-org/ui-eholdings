import React from 'react';

import SearchFilters from './search-form/search-filters';

/**
 * Renders search filters with specific title filters.
 *
 * Once the API supports returning these filters via an endpoint, this
 * component should not be necessary. Instead the `search-form` should
 * recieve the available filters from the route and render the
 * search-filters component itself.
 */
export default function TitleSearchFilters(props) {
  return (
    <SearchFilters
      searchType="titles"
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
        label: 'Publication type',
        defaultValue: 'all',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Audio book', value: 'audiobook' },
          { label: 'Book', value: 'book' },
          { label: 'Book series', value: 'bookseries' },
          { label: 'Database', value: 'database' },
          { label: 'Journal', value: 'journal' },
          { label: 'Newsletter', value: 'newsletter' },
          { label: 'Newspaper', value: 'newspaper' },
          { label: 'Proceedings', value: 'proceedings' },
          { label: 'Report', value: 'report' },
          { label: 'Streaming audio', value: 'streamingaudio' },
          { label: 'Streaming video', value: 'streamingvideo' },
          { label: 'Thesis & dissertation', value: 'thesisdissertation' },
          { label: 'Website', value: 'website' },
          { label: 'Unspecified', value: 'unspecified' }
        ]
      }]}
      {...props}
    />
  );
}
