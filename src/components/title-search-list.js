import React from 'react';
import PropTypes from 'prop-types';

import QueryList from './query-list';
import TitleListItem from './title-list-item';

const ITEM_HEIGHT = 70;

export default function TitleSearchList({
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
      type="titles"
      offset={parseInt(params.offset || 0, 10)}
      fetch={fetch}
      collection={collection}
      onUpdateOffset={onUpdateOffset}
      itemHeight={ITEM_HEIGHT}
      notFoundMessage={notFoundMessage}
      fullWidth
      renderItem={item => (
        <TitleListItem
          showPublisherAndType
          showIdentifiers
          showContributors
          item={item.content}
          link={item.content && {
            pathname: `/eholdings/titles/${item.content.id}`
          }}
          active={item.content && activeId && item.content.id === activeId}
          shouldFocus={item.content && shouldFocusItem && item.content.id === shouldFocusItem}
          onClick={() => onClickItem(`/eholdings/titles/${item.content.id}`)}
        />
      )}
    />
  );
}

TitleSearchList.propTypes = {
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
