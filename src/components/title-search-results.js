import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@folio/stripes-components/lib/Icon';

import List from './list';
import TitleListItem from './title-list-item';

export default function TitleSearchResults({ location, results }) {
  return results.request.isPending ? (
    <Icon icon="spinner-ellipsis" />
  ) : results.request.isRejected ? (
    <p data-test-title-search-error-message>
      {results.request.errors[0].title}
    </p>
  ) : results.request.isResolved && !results.length ? (
    <p data-test-title-search-no-results>
      No titles found for <strong>{`"${results.request.params.q}"`}</strong>.
    </p>
  ) : (
    <List data-test-title-search-results-list>
      {results.map(title => (
        <TitleListItem
          key={title.id}
          link={{
            pathname: `/eholdings/titles/${title.id}`,
            search: location.search
          }}
          item={title}
          showPublisherAndType
        />
      ))}
    </List>
  );
}

TitleSearchResults.propTypes = {
  location: PropTypes.object.isRequired,
  results: PropTypes.object.isRequired
};
