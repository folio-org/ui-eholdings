import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import List from '../../components/list';
import TitleListItem from '../../components/title-list-item';

function TitleSearchResults({
  query: { search },
  isLoading,
  isErrored,
  records,
  error
}) {
  return isLoading ? (
    <p>...loading</p>
  ) : isErrored ? (
    <p data-test-title-search-error-message>{error}</p>
  ) : !records.length && search ? (
    <p data-test-title-search-no-results>
      No titles found for <strong>{`"${search}"`}</strong>.
    </p>
  ) : (
    <List data-test-title-search-results-list>
      {records.map((title) => (
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
  isLoading: PropTypes.bool.isRequired,
  isErrored: PropTypes.bool.isRequired,
  records: PropTypes.array.isRequired,
  error: PropTypes.object
};

export default connect(
  ({ eholdings: { search }}) => ({ ...search.titles })
)(TitleSearchResults);
