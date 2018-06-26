import React from 'react';
import PropTypes from 'prop-types';

import QueryList from './query-list';
import TitleListItem from './title-list-item';

export default function TitleSearchList({
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
      type="titles"
      offset={parseInt(params.offset || 0, 10)}
      fetch={fetch}
      collection={collection}
      onUpdateOffset={onUpdateOffset}
      itemHeight={84}
      notFoundMessage={`No titles found for "${params.q}".`}
      renderItem={item => (
        <TitleListItem
          showPublisherAndType
          item={item.content}
          link={item.content && {
            pathname: `/eholdings/titles/${item.content.id}`
          }}
          active={item.content && activeId && item.content.id === activeId}
          shouldFocus={item.content && shouldFocusItem && item.content.id === shouldFocusItem}
          onClick={() => {
            router.history.push(
              `/eholdings/titles/${item.content.id}${location.search}`
            );
          }}
        />
      )}
    />
  );
}

TitleSearchList.propTypes = {
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  activeId: PropTypes.string,
  shouldFocusItem: PropTypes.string,
  collection: PropTypes.object.isRequired,
  fetch: PropTypes.func.isRequired,
  onUpdateOffset: PropTypes.func.isRequired
};

TitleSearchList.contextTypes = {
  router: PropTypes.object
};
