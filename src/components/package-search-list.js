import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';

import QueryList from './query-list';
import PackageListItem from './package-list-item';

function PackageSearchList({
  activeId,
  collection,
  fetch,
  location,
  onUpdateOffset,
  params,
  shouldFocusItem,
  history
}) {
  return (
    <QueryList
      type="packages"
      offset={parseInt(params.offset || 0, 10)}
      fetch={fetch}
      collection={collection}
      onUpdateOffset={onUpdateOffset}
      itemHeight={84}
      notFoundMessage={(
        <FormattedMessage
          id="ui-eholdings.package.resultsNotFound"
          values={{ query: params.q }}
        />
      )}
      fullWidth
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
            history.push(
              `/eholdings/packages/${item.content.id}${location.search}`
            );
          }}
        />
      )}
    />
  );
}

PackageSearchList.propTypes = {
  activeId: PropTypes.string,
  collection: PropTypes.object.isRequired,
  fetch: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  onUpdateOffset: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  shouldFocusItem: PropTypes.string,
  history: PropTypes.object.isRequired
};

export default withRouter(PackageSearchList);
