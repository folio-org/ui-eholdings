import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import List from '../../components/list';
import VendorListItem from '../../components/vendor-list-item';

function VendorSearchResultsRoute({
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
    <p data-test-vendor-search-error-message>
      {error.length ? error[0].message : error.message}
    </p>
  ) : isResolved && !content.length ? (
    <p data-test-vendor-search-no-results>
      No vendors found for <strong>{`"${search}"`}</strong>.
    </p>
  ) : (
    <List data-test-vendor-search-results-list>
      {content.map((vendor) => (
        <VendorListItem
            key={vendor.vendorId}
            item={vendor}
            link={`/eholdings/vendors/${vendor.vendorId}`}/>
      ))}
    </List>
  );
}

VendorSearchResultsRoute.propTypes = {
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
  ({ eholdings: { search }}) => ({ ...search.vendors })
)(VendorSearchResultsRoute);
