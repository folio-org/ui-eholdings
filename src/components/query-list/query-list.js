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
    offset: PropTypes.number,
    pageSize: PropTypes.number,
    loadHorizon: PropTypes.number,
    itemHeight: PropTypes.number,
    scrollable: PropTypes.bool,
    notFoundMessage: PropTypes.string,
    collection: PropTypes.object.isRequired,
    fetch: PropTypes.func.isRequired,
    renderItem: PropTypes.func.isRequired,
    onUpdateOffset: PropTypes.func,
    length: PropTypes.number
  };

  static defaultProps = {
    notFoundMessage: 'Not found'
  }

  state = {
    offset: this.props.offset || 0
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.offset !== this.props.offset &&
        nextProps.offset !== this.state.offset) {
      this.setState({ offset: nextProps.offset });
    }
  }

  updateOffset = (offset) => {
    this.setState({ offset });

    if (this.props.onUpdateOffset) {
      this.props.onUpdateOffset(offset);
    }
  };

  render() {
    let {
      type,
      pageSize,
      loadHorizon,
      scrollable,
      notFoundMessage,
      collection,
      fetch,
      itemHeight,
      renderItem,
      length
    } = this.props;
    let {
      offset
    } = this.state;

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
              items={state}
              length={length}
              offset={offset}
              itemHeight={itemHeight}
              onUpdate={this.updateOffset}
              scrollable={scrollable}
              data-test-query-list={type}
            >
              {item => (
                item.isRejected ? (
                  <div className={cx('list-item', 'is-error')} data-test-query-list-error={type}>
                    {item.error[0].title}
                  </div>
                ) : (
                  <div className={styles['list-item']} data-test-query-list-item>
                    {renderItem(item)}
                  </div>
                )
              )}
            </ScrollView>
          )
        )}
      </Impagination>
    );
  }
}
