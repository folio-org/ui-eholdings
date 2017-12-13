import React from 'react';
import PropTypes from 'prop-types';

import QueryList from './query-list';
import TitleListItem from './title-list-item';

export default function TitleSearchList({
  location,
  params,
  fetch,
  onPage
}) {
  return (
    <QueryList
      type="titles"
      params={params}
      fetch={fetch}
      onPage={onPage}
      itemHeight={80}
      notFoundMessage={`No titles found for "${params.q}".`}
      renderItem={(item, i) => (
        <TitleListItem
          key={i}
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
  fetch: PropTypes.func.isRequired,
  onPage: PropTypes.func.isRequired
};
