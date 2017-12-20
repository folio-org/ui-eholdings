import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@folio/stripes-components/lib/Icon';

import List from './list';
import PackageListItem from './package-list-item';

export default function PackageSearchResults({ location, results }) {
  return results.request.isPending ? (
    <Icon icon="spinner-ellipsis" />
  ) : results.request.isRejected ? (
    <p data-test-package-search-error-message>
      {results.request.errors[0].title}
    </p>
  ) : results.request.isResolved && !results.length ? (
    <p data-test-package-search-no-results>
      No packages found for <strong>{`"${results.request.params.q}"`}</strong>.
    </p>
  ) : (
    <List data-test-package-search-results-list>
      {results.map(pkg => (
        <PackageListItem
          key={pkg.id}
          link={{
            pathname: `/eholdings/packages/${pkg.id}`,
            search: location.search
          }}
          item={pkg}
          showVendorName
        />
      ))}
    </List>
  );
}

PackageSearchResults.propTypes = {
  location: PropTypes.object.isRequired,
  results: PropTypes.object.isRequired
};
