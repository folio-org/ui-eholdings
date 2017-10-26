import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@folio/stripes-components/lib/Icon';

import List from './list';
import TitleListItem from './title-list-item';

export default function TitleSearchResults({
  location,
  query: { search },
  isPending,
  isResolved,
  isRejected,
  content,
  error
}) {
  return isPending ? (
    <Icon icon="spinner-ellipsis" />
  ) : isRejected ? (
    <p data-test-title-search-error-message>
      {error.length ? error[0].message : error.message}
    </p>
  ) : isResolved && !content.length ? (
    <p data-test-title-search-no-results>
      No titles found for <strong>{`"${search}"`}</strong>.
    </p>
  ) : (
    <List data-test-title-search-results-list>
      {content.map(title => (
        <TitleListItem
          key={title.titleId}
          link={{
            pathname: `/eholdings/titles/${title.titleId}`,
            search: location.search
          }}
          item={title}
        />
      ))}
    </List>
  );
}

TitleSearchResults.propTypes = {
  location: PropTypes.object.isRequired,
  query: PropTypes.shape({
    search: PropTypes.string
  }).isRequired,
  isPending: PropTypes.bool.isRequired,
  isResolved: PropTypes.bool.isRequired,
  isRejected: PropTypes.bool.isRequired,
  content: PropTypes.array.isRequired,
  error: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ])
};
