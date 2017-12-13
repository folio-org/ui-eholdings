import React from 'react';
import PropTypes from 'prop-types';

import QueryList from './query-list';
import PackageListItem from './package-list-item';

export default function PackageSearch({
  location,
  params,
  fetch
}) {
  return (
    <QueryList
      type="packages"
      params={params}
      fetch={fetch}
      renderItem={item => (
        <PackageListItem
          key={item.id}
          item={item}
          showVendorName
          link={{
            pathname: `/eholdings/packages/${item.id}`,
            search: location.search
          }}
        />
      )}
    />
  );
}

PackageSearch.propTypes = {
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  fetch: PropTypes.func.isRequired
};
