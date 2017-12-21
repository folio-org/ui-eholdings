import React from 'react';
import PropTypes from 'prop-types';

import QueryList from './query-list';
import TitleListItem from './title-list-item';

export default function TitleSearchList({
  location,
  params,
  collection,
  fetch,
  onPage
}) {
  return (
    <QueryList
      type="titles"
      page={parseInt(params.page || 1, 10)}
      fetch={fetch}
      collection={collection}
      onPage={onPage}
      itemHeight={80}
      notFoundMessage={`No titles found for "${params.q}".`}
      renderItem={item => (
        <TitleListItem
          showPublisherAndType
          item={item.content}
          link={item.content && {
            pathname: `/eholdings/titles/${item.content.id}`,
            search: location.search
          }}
        />
      )}
    />
  );
}

TitleSearchList.propTypes = {
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  collection: PropTypes.object.isRequired,
  fetch: PropTypes.func.isRequired,
  onPage: PropTypes.func.isRequired
};
