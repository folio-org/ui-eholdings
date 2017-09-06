import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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
    <p data-test-vendor-search-error>{error}</p>
  ) : !records.length && search ? (
    <p data-test-vendor-search-not-found>
      No titles found for <strong>{`"${search}"`}</strong>.
    </p>
  ) : (
    <ul data-test-title-search-results-list>
      {records.map((title) => (
        <TitleListItem
            key={title.titleId}
            item={title}
            link={`/eholdings/titles/${title.titleId}`}
            showSelected={false}/>
      ))}
    </ul>
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
