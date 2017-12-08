import React from 'react';
import PropTypes from 'prop-types';

import Query from './query';
import TitleListItem from './title-list-item';

export default function TitleSearch({
  location,
  params,
  fetch
}) {
  return (
    <Query
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
