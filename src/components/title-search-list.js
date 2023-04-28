import PropTypes from 'prop-types';

import extend from 'lodash/extend';

import QuerySearchList from './query-search-list';
import TitleListItem from './title-list-item';
import NoResultsMessage from './no-results-message';

const ITEM_HEIGHT = 70;

const TitleSearchList = ({
  activeId,
  collection,
  packagesFacetCollection,
  fetch,
  notFoundMessage,
  onUpdateOffset,
  shouldFocusItem,
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
      type="titles"
      fetch={fetch}
      collection={packagesCollection}
      packagesFacetCollection={packagesFacetCollection}
      onUpdateOffset={onUpdateOffset}
      itemHeight={ITEM_HEIGHT}
      isMainPageSearch
      notFoundMessage={
        <NoResultsMessage data-test-query-list-not-found="titles">
          {notFoundMessage}
        </NoResultsMessage>
      }
      fullWidth
      renderItem={item => (
        <TitleListItem
          showPublisherAndType
          showIdentifiers
          showContributors
          item={item.content}
          link={item.content && {
            pathname: `/eholdings/titles/${item.content.id}`,
          }}
          active={item.content && activeId && item.content.id === activeId}
          shouldFocus={item.content && shouldFocusItem && item.content.id === shouldFocusItem}
          onClick={() => onClickItem(`/eholdings/titles/${item.content.id}`)}
        />
      )}
    />
  );
};

TitleSearchList.propTypes = {
  activeId: PropTypes.string,
  collection: PropTypes.object.isRequired,
  fetch: PropTypes.func.isRequired,
  notFoundMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  onClickItem: PropTypes.func.isRequired,
  onUpdateOffset: PropTypes.func.isRequired,
  packagesFacetCollection: PropTypes.object.isRequired,
  shouldFocusItem: PropTypes.string,
};

export default TitleSearchList;
