import React from 'react';
import PropTypes from 'prop-types';

import QueryList from './query-list';
import VendorListItem from './vendor-list-item';

export default function VendorSearch({
  location,
  params,
  fetch
}) {
  return (
    <QueryList
      type="vendors"
      params={params}
      fetch={fetch}
      renderItem={item => (
        <VendorListItem
          key={item.id}
          item={item}
          link={{
            pathname: `/eholdings/vendors/${item.id}`,
            search: location.search
          }}
        />
      )}
    />
  );
}

VendorSearch.propTypes = {
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  fetch: PropTypes.func.isRequired
};
