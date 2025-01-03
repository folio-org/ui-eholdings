import PropTypes from 'prop-types';

import extend from 'lodash/extend';

import QuerySearchList from './query-search-list';
import SearchPackageListItem from './search-package-list-item';
import NoResultsMessage from './no-results-message';

const ITEM_HEIGHT = 80;

const PackageSearchList = ({
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
      type="packages"
      fetch={fetch}
      collection={packagesCollection}
      onUpdateOffset={onUpdateOffset}
      itemHeight={ITEM_HEIGHT}
      isMainPageSearch
      notFoundMessage={
        <NoResultsMessage data-test-query-list-not-found="packages">
          {notFoundMessage}
        </NoResultsMessage>
      }
      fullWidth
      renderItem={item => (
        <SearchPackageListItem
          item={item.content}
          link={item.content && {
            pathname: `/eholdings/packages/${item.content.id}`,
          }}
          active={item.content && activeId && item.content.id === activeId}
          onClick={() => onClickItem(`/eholdings/packages/${item.content.id}`)}
          showProviderName
          showTitleCount
          showSelectedCount
        />
      )}
    />
  );
};

PackageSearchList.propTypes = {
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

export default PackageSearchList;
