import {
  useEffect,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import ScrollView from '../scroll-view';
import PrevNextButtons from '../prev-next-buttons';
import { FIRST_PAGE } from '../../constants';

import styles from './query-search-list.css';

const cx = classnames.bind(styles);

const QuerySearchList = ({
  collection,
  fetch,
  fullWidth,
  itemHeight,
  notFoundMessage,
  renderItem,
  scrollable,
  type,
}) => {
  const listFirstItem = useRef(null);

  useEffect(() => {
    fetch(FIRST_PAGE);
  }, []);

  const {
    totalResults,
    items,
    hasFailed,
    errors,
    isLoading,
    page,
  } = collection;
  const length = items.length;

  if (hasFailed && !length) {
    return (
      <div className={styles.error}>
        {errors[0].title}
      </div>
    );
  }

  if (!length) {
    return notFoundMessage;
  }

  const defineIsListFirstItem = (item) => {
    const [firstItem] = items;

    return item === firstItem;
  };

  const focusListFirstItem = () => {
    listFirstItem.current.focus();
  };

  return (
    <ScrollView
      items={items}
      length={length}
      itemHeight={itemHeight}
      scrollable={scrollable}
      queryListName={type}
      fullWidth={fullWidth}
      prevNextButtons={(
        <PrevNextButtons
          isLoading={isLoading}
          totalResults={totalResults}
          fetch={fetch}
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
  itemHeight: PropTypes.number.isRequired,
  notFoundMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,
  renderItem: PropTypes.func.isRequired,
  scrollable: PropTypes.bool,
  type: PropTypes.string.isRequired,
};

QuerySearchList.defaultProps = {
  fullWidth: false,
};

export default QuerySearchList;
