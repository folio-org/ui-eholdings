import React from 'react';
import PropTypes from 'prop-types';

import QueryList from './query-list';
import SearchPackageListItem from './search-package-list-item';

const ITEM_HEIGHT = 80;

function PackageSearchList({
  activeId,
  collection,
  fetch,
  notFoundMessage,
  onUpdateOffset,
  params,
  shouldFocusItem,
  onClickItem
}) {
  return (
    <QueryList
      type="packages"
      offset={parseInt(params.offset || 0, 10)}
      fetch={fetch}
      collection={collection}
      onUpdateOffset={onUpdateOffset}
      itemHeight={ITEM_HEIGHT}
      notFoundMessage={notFoundMessage}
      fullWidth
      renderItem={item => (
        <SearchPackageListItem
          item={item.content}
          link={item.content && {
            pathname: `/eholdings/packages/${item.content.id}`
          }}
          active={item.content && activeId && item.content.id === activeId}
          shouldFocus={item.content && shouldFocusItem && item.content.id === shouldFocusItem}
          onClick={() => onClickItem(`/eholdings/packages/${item.content.id}`)}
        />
      )}
    />
  );
}

PackageSearchList.propTypes = {
  activeId: PropTypes.string,
  collection: PropTypes.object.isRequired,
  fetch: PropTypes.func.isRequired,
  notFoundMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  onClickItem: PropTypes.func.isRequired,
  onUpdateOffset: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  shouldFocusItem: PropTypes.string
};

export default PackageSearchList;
