import { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import styles from './query-list.css';
import ScrollView from '../scroll-view';
import PrevNextButtons from '../prev-next-buttons';
import Impagination from '../impagination';
import { PAGE_SIZE } from '../../constants';

const cx = classnames.bind(styles);

export default class QueryList extends Component {
  static propTypes = {
    collection: PropTypes.object.isRequired,
    fetch: PropTypes.func.isRequired,
    fullWidth: PropTypes.bool,
    itemHeight: PropTypes.number.isRequired,
    length: PropTypes.number,
    loadHorizon: PropTypes.number,
    notFoundMessage: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]).isRequired,
    offset: PropTypes.number,
    onUpdateOffset: PropTypes.func.isRequired,
    pageSize: PropTypes.number,
    renderItem: PropTypes.func.isRequired,
    scrollable: PropTypes.bool,
    type: PropTypes.string.isRequired,
  };

  static defaultProps = {
    fullWidth: false,
    loadHorizon: PAGE_SIZE,
    offset: 0,
    pageSize: PAGE_SIZE,
  }

  updateOffset = (offset) => {
    if (this.props.onUpdateOffset) {
      this.props.onUpdateOffset(offset);
    }
  };

  render() {
    const {
      type,
      pageSize,
      loadHorizon,
      scrollable,
      notFoundMessage,
      collection,
      fetch,
      itemHeight,
      renderItem,
      length,
      fullWidth,
      offset,
    } = this.props;

    const {
      isPending,
      length: totalResults,
    } = collection;

    return (
      <Impagination
        pageSize={pageSize}
        loadHorizon={loadHorizon}
        readOffset={offset * PAGE_SIZE}
        collection={collection}
        fetch={fetch}
      >
        {state => (
          state.hasRejected && !state.length ? (
            <div className={styles.error} data-test-query-list-error={type}>
              {state.rejected[0].error[0].title}
            </div>
          ) : !state.length
            ? notFoundMessage
            : (
              <ScrollView
                items={state}
                length={length}
                offset={offset}
                itemHeight={itemHeight}
                scrollable={scrollable}
                queryListName={type}
                fullWidth={fullWidth}
                prevNextButtons={(
                  <PrevNextButtons
                    isLoading={isPending}
                    totalResults={totalResults}
                    fetch={this.updateOffset}
                    page={offset}
                  />
                )}
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
