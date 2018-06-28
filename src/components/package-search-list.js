import React from 'react';
import PropTypes from 'prop-types';

import QueryList from './query-list';
import PackageListItem from './package-list-item';

export default function PackageSearchList({
  location,
  params,
  activeId,
  shouldFocusItem,
  collection,
  fetch,
  onUpdateOffset
}, { router }) {
  return (
    <QueryList
      type="packages"
      offset={parseInt(params.offset || 0, 10)}
      fetch={fetch}
      collection={collection}
      onUpdateOffset={onUpdateOffset}
      itemHeight={84}
      notFoundMessage={`No packages found for "${params.q}".`}
      renderItem={item => (
        <PackageListItem
          showProviderName
          item={item.content}
          link={item.content && {
            pathname: `/eholdings/packages/${item.content.id}`
          }}
          active={item.content && activeId && item.content.id === activeId}
          shouldFocus={item.content && shouldFocusItem && item.content.id === shouldFocusItem}
          onClick={() => {
            router.history.push(
              `/eholdings/packages/${item.content.id}${location.search}`
            );
          }}
        />
      )}
    />
  );
}

PackageSearchList.propTypes = {
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  activeId: PropTypes.string,
  shouldFocusItem: PropTypes.string,
  collection: PropTypes.object.isRequired,
  fetch: PropTypes.func.isRequired,
  onUpdateOffset: PropTypes.func.isRequired
};

PackageSearchList.contextTypes = {
  router: PropTypes.object
};
