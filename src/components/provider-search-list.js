import PropTypes from 'prop-types';

import extend from 'lodash/extend';

import QuerySearchList from './query-search-list';
import ProviderListItem from './provider-list-item';
import NoResultsMessage from './no-results-message';

const ITEM_HEIGHT = 62;

const ProviderSearchList = ({
  activeId,
  collection,
  fetch,
  notFoundMessage,
  onUpdateOffset,
  onClickItem,
}) => {
  const packagesCollection = extend(Object.create(collection), {
    totalResults: collection.length,
    hasFailed: collection.request.isRejected,
    errors: collection.request.errors,
    isLoading: collection.isLoading,
    page: collection.currentPage,
  });

  packagesCollection.items = collection.pages[collection.currentPage]?.records;

  return (
    <QuerySearchList
      type="providers"
      fetch={fetch}
      collection={packagesCollection}
      onUpdateOffset={onUpdateOffset}
      itemHeight={ITEM_HEIGHT}
      isMainPageSearch
      notFoundMessage={
        <NoResultsMessage data-test-query-list-not-found="providers">
          {notFoundMessage}
        </NoResultsMessage>
      }
      fullWidth
      renderItem={item => (
        <ProviderListItem
          item={item.content}
          link={item.content && {
            pathname: `/eholdings/providers/${item.content.id}`,
          }}
          active={item.content && activeId && item.content.id === activeId}
          onClick={() => onClickItem(`/eholdings/providers/${item.content.id}`)}
        />
      )}
    />
  );
};

ProviderSearchList.propTypes = {
  activeId: PropTypes.string,
  collection: PropTypes.object.isRequired,
  fetch: PropTypes.func.isRequired,
  notFoundMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  onClickItem: PropTypes.func.isRequired,
  onUpdateOffset: PropTypes.func.isRequired,
};

export default ProviderSearchList;
