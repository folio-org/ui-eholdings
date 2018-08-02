import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import QueryList from './query-list';
import TitleListItem from './title-list-item';

export default function TitleSearchList({
  activeId,
  collection,
  fetch,
  location,
  onUpdateOffset,
  params,
  shouldFocusItem
}, { router }) {
  return (
    <QueryList
      type="titles"
      offset={parseInt(params.offset || 0, 10)}
      fetch={fetch}
      collection={collection}
      onUpdateOffset={onUpdateOffset}
      itemHeight={84}
      notFoundMessage={(
        <FormattedMessage
          id="ui-eholdings.title.resultsNotFound"
          values={{ query: params.q }}
        />
      )}
      fullWidth
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
  activeId: PropTypes.string,
  collection: PropTypes.object.isRequired,
  fetch: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  onUpdateOffset: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  shouldFocusItem: PropTypes.string
};

TitleSearchList.contextTypes = {
  router: PropTypes.object
};
