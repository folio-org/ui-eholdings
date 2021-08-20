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
    isMainPageSearch: PropTypes.bool,
    itemHeight: PropTypes.number.isRequired,
    length: PropTypes.number,
    loadHorizon: PropTypes.number,
    notFoundMessage: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]).isRequired,
    offset: PropTypes.number,
    onUpdateOffset: PropTypes.func.isRequired,
    page: PropTypes.number,
    pageSize: PropTypes.number,
    renderItem: PropTypes.func.isRequired,
    scrollable: PropTypes.bool,
    type: PropTypes.string.isRequired,
  };

  static defaultProps = {
    fullWidth: false,
    isMainPageSearch: false,
    loadHorizon: PAGE_SIZE,
    offset: 0,
    page: 1,
    pageSize: PAGE_SIZE,
  }

  constructor(props) {
    super(props);
    this.state = {
      offset: this.props.offset || 0,
    };
  }

  updateOffset = (offset) => {
    this.setState({ offset });

    if (this.props.onUpdateOffset) {
      this.props.onUpdateOffset(offset);
    }
  }

  updatePage = (page) => {
    if (this.props.onUpdateOffset) {
      this.props.onUpdateOffset(page);
    }
  }

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
      page,
      isMainPageSearch,
    } = this.props;
    const {
      offset,
    } = this.state;

    const {
      isPending,
      length: totalResults,
    } = collection;
    const readOffset = isMainPageSearch ? page * PAGE_SIZE : offset;

    return (
      <Impagination
        pageSize={pageSize}
        loadHorizon={loadHorizon}
        readOffset={readOffset}
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
                offset={isMainPageSearch ? page : offset}
                isMainPageSearch
                itemHeight={itemHeight}
                scrollable={scrollable}
                onUpdate={() => !isMainPageSearch && this.updateOffset()}
                queryListName={type}
                fullWidth={fullWidth}
                prevNextButtons={isMainPageSearch
                  ? (
                    <PrevNextButtons
                      isLoading={isPending}
                      totalResults={totalResults}
                      fetch={this.updatePage}
                      page={page}
                    />
                  )
                  : null
                }
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
