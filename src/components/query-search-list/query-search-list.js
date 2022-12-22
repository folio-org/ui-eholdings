import {
  useEffect,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { Icon } from '@folio/stripes/components';

import useImpagination from '../../hooks/useImpagination';

import ScrollView from '../scroll-view';
import PrevNextButtons from '../prev-next-buttons';
import { PAGE_SIZE } from '../../constants';

import styles from './query-search-list.css';

const cx = classnames.bind(styles);

const QuerySearchList = ({
  collection,
  fetch,
  fullWidth,
  isMainPageSearch,
  itemHeight,
  notFoundMessage,
  onUpdateOffset,
  pageSize,
  renderItem,
  scrollable,
  type,
  isUpdating,
}) => {
  const listFirstItem = useRef(null);

  useEffect(() => {
    fetch(collection.page);
  }, [collection.page, fetch]);

  const {
    totalResults,
    items,
    hasFailed,
    errors,
    isLoading,
    page,
  } = collection;
  const length = items?.length;

  const state = useImpagination({
    pageSize,
    page,
    collection,
    fetch,
    isMainPageSearch,
  });

  if (hasFailed && !length) {
    return (
      <div className={styles.error}>
        {errors[0].title}
      </div>
    );
  }

  if (isMainPageSearch && state.hasRejected && !state.length) {
    return (
      <div
        className={styles.error}
        data-test-query-list-error={type}
      >
        {state.rejected[0].error[0].title}
      </div>
    );
  }

  if ((isMainPageSearch && !collection.isLoading && !length)
    || (!isMainPageSearch && !isLoading && !length)) {
    return notFoundMessage;
  }

  const updatePage = (pageToUpdate) => {
    if (onUpdateOffset) {
      onUpdateOffset(pageToUpdate);
    }
  };

  const defineIsListFirstItem = (item) => {
    const [firstItem] = items;

    let firstRecord = {};
    if (isMainPageSearch) {
      [firstRecord] = state?.records;
    }

    const recordId = firstRecord?.id || firstItem?.id;
    const itemId = isMainPageSearch ? item.content?.id : item.id;

    return itemId === recordId;
  };

  const focusListFirstItem = () => {
    listFirstItem.current.focus();
  };

  if (isUpdating || isLoading) {
    return (
      <div className={styles.updatingSpinner}>
        <Icon icon="spinner-ellipsis" />
      </div>
    );
  }

  return (
    <ScrollView
      items={isMainPageSearch ? state : items}
      itemHeight={itemHeight}
      scrollable={scrollable}
      queryListName={type}
      fullWidth={fullWidth}
      prevNextButtons={(
        <PrevNextButtons
          isLoading={isLoading}
          totalResults={totalResults}
          fetch={isMainPageSearch ? (pageToUpdate) => updatePage(pageToUpdate) : fetch}
          page={page}
          setFocus={focusListFirstItem}
        />
      )}
    >
      {item => (
        item.isRejected
          ? (
            <div className={cx('list-item', 'is-error')}>
              {item.error[0].title}
            </div>
          )
          : (
            <div
              ref={defineIsListFirstItem(item) ? listFirstItem : null}
              tabIndex={defineIsListFirstItem(item) ? 0 : null} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
              className={styles['list-item']}
            >
              {renderItem(item)}
            </div>
          )
      )}
    </ScrollView>
  );
};

QuerySearchList.propTypes = {
  collection: PropTypes.object.isRequired,
  fetch: PropTypes.func.isRequired,
  fullWidth: PropTypes.bool,
  isMainPageSearch: PropTypes.bool,
  isUpdating: PropTypes.bool,
  itemHeight: PropTypes.number.isRequired,
  notFoundMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,
  onUpdateOffset: PropTypes.func,
  pageSize: PropTypes.number,
  renderItem: PropTypes.func.isRequired,
  scrollable: PropTypes.bool,
  type: PropTypes.string.isRequired,
};

QuerySearchList.defaultProps = {
  fullWidth: false,
  pageSize: PAGE_SIZE,
  isUpdating: false,
};

export default QuerySearchList;
