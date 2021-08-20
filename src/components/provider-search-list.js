import PropTypes from 'prop-types';

import QueryList from './query-list';
import ProviderListItem from './provider-list-item';
import NoResultsMessage from './no-results-message';

const ITEM_HEIGHT = 62;

const ProviderSearchList = ({
  activeId,
  collection,
  fetch,
  notFoundMessage,
  onUpdateOffset,
  params,
  shouldFocusItem,
  onClickItem,
}) => {
  return (
    <QueryList
      type="providers"
      page={parseInt(params.offset || 0, 10)}
      fetch={fetch}
      collection={collection}
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
          shouldFocus={item.content && shouldFocusItem && item.content.id === shouldFocusItem}
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
  params: PropTypes.object.isRequired,
  shouldFocusItem: PropTypes.string,
};

export default ProviderSearchList;
