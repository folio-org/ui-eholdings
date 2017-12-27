import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import styles from './query-list.css';
import ScrollView from '../scroll-view';
import Impagination from '../impagination';

const cx = classnames.bind(styles);

export default function QueryList({
  type,
  offset,
  pageSize,
  loadHorizon,
  notFoundMessage = 'Not Found',
  collection,
  fetch,
  itemHeight,
  renderItem,
  onUpdateOffset
}) {
  return (
    <Impagination
      pageSize={pageSize}
      loadHorizon={loadHorizon}
      readOffset={offset}
      collection={collection}
      fetch={fetch}
    >
      {state => (
        state.hasRejected && !state.length ? (
          <div className={styles.error} data-test-query-list-error={type}>
            {state.rejected[0].error[0].title}
          </div>
        ) : !state.length ? (
          <div className={cx('error', 'not-found')} data-test-query-list-not-found={type}>
            {notFoundMessage}
          </div>
        ) : (
          <ScrollView
            length={state.length}
            offset={offset}
            itemHeight={itemHeight}
            onUpdate={onUpdateOffset}
            data-test-query-list={type}
          >
            {state.map((item, i) => (
              item.isRejected ? (
                <div key={i} className={cx('list-item', 'is-error')} data-test-query-list-error={type}>
                  {item.error[0].title}
                </div>
              ) : (
                <div key={i} className={styles['list-item']} data-test-query-list-item>
                  {renderItem(item)}
                </div>
              )
            ))}
          </ScrollView>
        )
      )}
    </Impagination>
  );
}

QueryList.propTypes = {
  type: PropTypes.string.isRequired,
  offset: PropTypes.number,
  pageSize: PropTypes.number,
  loadHorizon: PropTypes.number,
  itemHeight: PropTypes.number,
  notFoundMessage: PropTypes.string,
  collection: PropTypes.object.isRequired,
  fetch: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired,
  onUpdateOffset: PropTypes.func
};
