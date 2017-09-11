import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import List from '../../components/list';
import VendorListItem from '../../components/vendor-list-item';

function VendorSearchResultsRoute({
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
    <p data-test-vendor-search-no-results>
      No vendors found for <strong>{`"${search}"`}</strong>.
    </p>
  ) : (
    <List data-test-vendor-search-results-list>
      {records.map((vendor) => (
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
  isLoading: PropTypes.bool.isRequired,
  isErrored: PropTypes.bool.isRequired,
  records: PropTypes.array.isRequired,
  error: PropTypes.object
};

export default connect(
  ({ eholdings: { search }}) => ({ ...search.vendors })
)(VendorSearchResultsRoute);
