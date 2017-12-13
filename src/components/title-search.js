import React from 'react';
import PropTypes from 'prop-types';

import QueryList from './query-list';
import TitleListItem from './title-list-item';

export default function TitleSearch({
  location,
  params,
  fetch
}) {
  return (
    <QueryList
      type="title"
      params={params}
      fetch={fetch}
      renderItem={item => (
        <TitleListItem
          key={item.id}
          item={item}
          showPublisherAndType
          link={{
            pathname: `/eholdings/titles/${item.id}`,
            search: location.search
          }}
        />
      )}
    />
  );
}

TitleSearch.propTypes = {
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  fetch: PropTypes.func.isRequired
};
