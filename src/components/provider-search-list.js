import React from 'react';
import PropTypes from 'prop-types';

import QueryList from './query-list';
import ProviderListItem from './provider-list-item';

export default function ProviderSearchList({
  location,
  params,
  collection,
  fetch,
  onUpdateOffset
}) {
  return (
    <QueryList
      type="providers"
      offset={parseInt(params.offset || 0, 10)}
      fetch={fetch}
      collection={collection}
      onUpdateOffset={onUpdateOffset}
      itemHeight={68}
      notFoundMessage={`No providers found for "${params.q}".`}
      renderItem={item => (
        <ProviderListItem
          item={item.content}
          link={item.content && {
            pathname: `/eholdings/providers/${item.content.id}`,
            search: location.search
          }}
        />
      )}
    />
  );
}

ProviderSearchList.propTypes = {
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  collection: PropTypes.object.isRequired,
  fetch: PropTypes.func.isRequired,
  onUpdateOffset: PropTypes.func.isRequired
};
