import React from 'react';
import PropTypes from 'prop-types';

import QueryList from './query-list';
import VendorListItem from './vendor-list-item';

export default function VendorSearchList({
  location,
  params,
  collection,
  fetch,
  onPage
}) {
  return (
    <QueryList
      type="vendors"
      params={params}
      collection={collection}
      fetch={fetch}
      onPage={onPage}
      itemHeight={65}
      notFoundMessage={`No vendors found for "${params.q}".`}
      renderItem={item => (
        <VendorListItem
          item={item.content}
          link={item.content && {
            pathname: `/eholdings/vendors/${item.content.id}`,
            search: location.search
          }}
        />
      )}
    />
  );
}

VendorSearchList.propTypes = {
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  collection: PropTypes.object.isRequired,
  fetch: PropTypes.func.isRequired,
  onPage: PropTypes.func.isRequired
};
