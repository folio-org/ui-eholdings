import {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames/bind';

import { Button } from '@folio/stripes/components';

import ScrollView from '../scroll-view';

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
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(page);
  }, [fetch, page]);

  const {
    totalLength,
    items,
    hasFailed,
    errors,
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

  const getLoadMoreButton = () => {
    const isUnloadedPagesPresent = (totalLength !== length) && !(length % 100);

    if (isUnloadedPagesPresent) {
      return (
        <div className={styles['button-wrapper']}>
          <Button
            style={{ width: '75%', margin: '1rem auto' }}
            onClick={() => { setPage(page + 1); }}
          >
            <FormattedMessage id="ui-eholdings.loadMore" />
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <ScrollView
      items={items}
      length={length}
      itemHeight={itemHeight}
      scrollable={scrollable}
      queryListName={type}
      fullWidth={fullWidth}
      loadMoreButton={getLoadMoreButton()}
    >
      {item => (
        item.isRejected ? (
          <div className={cx('list-item', 'is-error')}>
            {item.error[0].title}
          </div>
        ) : (
          <div className={styles['list-item']}>
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
