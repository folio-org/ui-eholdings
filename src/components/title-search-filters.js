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
        label: 'Selection Status',
        defaultValue: 'all',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Selected', value: 'true' },
          { label: 'Not Selected', value: 'false' },
          { label: 'Selected By EBSCO', value: 'ebsco' }
        ]
      }, {
        name: 'type',
        label: 'Publication Type',
        defaultValue: 'all',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Audio Book', value: 'audiobook' },
          { label: 'Book', value: 'book' },
          { label: 'Book Series', value: 'bookseries' },
          { label: 'Database', value: 'database' },
          { label: 'Journal', value: 'journal' },
          { label: 'Newsletter', value: 'newsletter' },
          { label: 'Newspaper', value: 'newspaper' },
          { label: 'Proceedings', value: 'proceedings' },
          { label: 'Report', value: 'report' },
          { label: 'Streaming Audio', value: 'streamingaudio' },
          { label: 'Streaming Video', value: 'streamingvideo' },
          { label: 'Thesis & Dissertation', value: 'thesisdissertation' },
          { label: 'Website', value: 'website' },
          { label: 'Unspecified', value: 'unspecified' }
        ]
      }]}
      {...props}
    />
  );
}
