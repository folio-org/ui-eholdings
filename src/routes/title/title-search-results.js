import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import List from '../../components/list';
import TitleListItem from '../../components/title-list-item';

function TitleSearchResults({
  query: { search },
  isPending,
  isResolved,
  isRejected,
  content,
  error
}) {
  return isPending ? (
    <p>...loading</p>
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
      {content.map((title) => (
        <TitleListItem
            key={title.titleId}
            link={`/eholdings/titles/${title.titleId}`}
            item={title}/>
      ))}
    </List>
  );
}

TitleSearchResults.propTypes = {
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

export default connect(
  ({ eholdings: { search }}) => ({ ...search.titles })
)(TitleSearchResults);
