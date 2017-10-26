import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@folio/stripes-components/lib/Icon';

import List from './list';
import VendorListItem from './vendor-list-item';

export default function VendorSearchResults({
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
    <p data-test-vendor-search-error-message>
      {error.length ? error[0].message : error.message}
    </p>
  ) : isResolved && !content.length ? (
    <p data-test-vendor-search-no-results>
      No vendors found for <strong>{`"${search}"`}</strong>.
    </p>
  ) : (
    <List data-test-vendor-search-results-list>
      {content.map(vendor => (
        <VendorListItem
          key={vendor.vendorId}
          item={vendor}
          link={{
            pathname: `/eholdings/vendors/${vendor.vendorId}`,
            search: location.search
          }}
        />
      ))}
    </List>
  );
}

VendorSearchResults.propTypes = {
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
