import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import styles from './query-list.css';
import ScrollView from '../scroll-view';
import Impagination from '../impagination';

const cx = classnames.bind(styles);

export default class QueryList extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    page: PropTypes.number,
    pageSize: PropTypes.number,
    loadHorizon: PropTypes.number,
    itemHeight: PropTypes.number,
    notFoundMessage: PropTypes.string,
    collection: PropTypes.object.isRequired,
    fetch: PropTypes.func.isRequired,
    renderItem: PropTypes.func.isRequired,
    onPage: PropTypes.func
  };

  static defaultProps = {
    page: 1,
    pageSize: 25,
    notFoundMessage: 'Not Found'
  }

  state = {
    readOffset: (this.props.page - 1) * this.props.pageSize
  };

  handleUpdate = (readOffset) => {
    let { pageSize, onPage } = this.props;
    let page = Math.floor(readOffset / pageSize) + 1;

    if (page !== this.props.page) {
      onPage(page);
    }

    if (readOffset !== this.state.readOffset) {
      this.setState({ readOffset });
    }
  }

  render() {
    let {
      type,
      page,
      pageSize,
      loadHorizon,
      notFoundMessage,
      collection,
      fetch,
      itemHeight,
      renderItem
    } = this.props;
    let {
      readOffset
    } = this.state;

    let listLength = collection.isLoaded ? collection.length : page * pageSize;
    let totalPages = Math.ceil(listLength / pageSize);

    return (
      <Impagination
        pageSize={pageSize}
        loadHorizon={loadHorizon}
        readOffset={readOffset}
        totalPages={totalPages}
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
              length={listLength}
              offset={readOffset}
              itemHeight={itemHeight}
              onUpdate={this.handleUpdate}
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
}
