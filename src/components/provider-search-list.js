import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

import QueryList from './query-list';
import ProviderListItem from './provider-list-item';

function ProviderSearchList({
  activeId,
  collection,
  fetch,
  intl,
  location,
  onUpdateOffset,
  params,
  shouldFocusItem,
}, { router }) {
  return (
    <QueryList
      type="providers"
      offset={parseInt(params.offset || 0, 10)}
      fetch={fetch}
      collection={collection}
      onUpdateOffset={onUpdateOffset}
      itemHeight={68}
      notFoundMessage={intl.formatMessage({ id: 'ui-eholdings.provider.resultsNotFound' }, { query: params.q })}
      fullWidth
      renderItem={item => (
        <ProviderListItem
          item={item.content}
          link={item.content && {
            pathname: `/eholdings/providers/${item.content.id}`
          }}
          active={item.content && activeId && item.content.id === activeId}
          shouldFocus={item.content && shouldFocusItem && item.content.id === shouldFocusItem}
          onClick={() => {
            router.history.push(
              `/eholdings/providers/${item.content.id}${location.search}`
            );
          }}
        />
      )}
    />
  );
}

ProviderSearchList.propTypes = {
  activeId: PropTypes.string,
  collection: PropTypes.object.isRequired,
  fetch: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  location: PropTypes.object.isRequired,
  onUpdateOffset: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  shouldFocusItem: PropTypes.string,
};

ProviderSearchList.contextTypes = {
  router: PropTypes.object
};

export default injectIntl(ProviderSearchList);
