import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@folio/stripes-components/lib/Icon';

import List from './list';
import VendorListItem from './vendor-list-item';

export default function VendorSearchResults({ location, results }) {
  return results.request.isPending ? (
    <Icon icon="spinner-ellipsis" />
  ) : results.request.isRejected ? (
    <p data-test-vendor-search-error-message>
      {results.request.errors[0].title}
    </p>
  ) : results.request.isResolved && !results.length ? (
    <p data-test-vendor-search-no-results>
      No vendors found for <strong>{`"${results.request.params.q}"`}</strong>.
    </p>
  ) : (
    <List data-test-vendor-search-results-list>
      {results.map(vendor => (
        <VendorListItem
          key={vendor.id}
          item={vendor}
          link={{
            pathname: `/eholdings/vendors/${vendor.id}`,
            search: location.search
          }}
        />
      ))}
    </List>
  );
}

VendorSearchResults.propTypes = {
  location: PropTypes.object.isRequired,
  results: PropTypes.object.isRequired
};
