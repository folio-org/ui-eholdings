import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import List from '../../components/list';
import PackageListItem from '../../components/package-list-item';

function PackageSearchResults({
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
      No packages found for <strong>{`"${search}"`}</strong>.
    </p>
  ) : (
    <List data-test-package-search-results-list>
      {records.map((pkg) => (
        <PackageListItem
            key={pkg.packageId}
            link={`/eholdings/vendors/${pkg.vendorId}/packages/${pkg.packageId}`}
            item={pkg}/>
      ))}
    </List>
  );
}

PackageSearchResults.propTypes = {
  query: PropTypes.shape({
    search: PropTypes.string
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  isErrored: PropTypes.bool.isRequired,
  records: PropTypes.array.isRequired,
  error: PropTypes.object
};

export default connect(
  ({ eholdings: { search }}) => ({ ...search.packages })
)(PackageSearchResults);
