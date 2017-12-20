import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';

import { createResolver } from '../../redux';

import styles from './query-list.css';
import Impagination from './impagination';
import List from '../list';

const cx = classNames.bind(styles);

class QueryList extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
    pageSize: PropTypes.number,
    loadHorizon: PropTypes.number,
    itemHeight: PropTypes.number.isRequired,
    notFoundMessage: PropTypes.string,
    fetch: PropTypes.func.isRequired,
    onPage: PropTypes.func,
    resolver: PropTypes.object.isRequired,
    renderItem: PropTypes.func.isRequired
  };

  static defaultProps = {
    pageSize: 25
  };

  constructor(props) {
    super(props);

    let { type, params, pageSize, resolver } = this.props;
    let { page = 1 } = params;

    // set the initial read offset and find the collection for our
    // initial page of records
    this.state = {
      visibleItems: pageSize,
      readOffset: (page - 1) * pageSize,
      collections: {
        [page]: resolver.query(type, { ...params, page })
      }
    };
  }

  // update the DOM element's scrollTop position with our initial
  // page offset and decide the initial visible item count
  componentDidMount() {
    let { params, pageSize, itemHeight } = this.props;
    let pageOffset = parseInt(params.page || 1, 10) - 1;

    // $list is populated via the ref in the render method below
    if (this.$list) {
      if (pageOffset) {
        this.$list.scrollTop = pageOffset * pageSize * itemHeight;
      }

      // adjust the amount of visible items on resize
      window.addEventListener('resize', this.handleListLayout);
      this.handleListLayout();
    }
  }

  componentWillReceiveProps(nextProps) {
    let { collections } = this.state;
    let { type, params, pageSize, resolver } = nextProps;
    let page = parseInt(params.page || 1, 10);

    // if the type has changed, set this to our initial properties
    if (type !== this.props.type) {
      this.setState({
        readOffset: (page - 1) * pageSize,
        collections: {
          [page]: resolver.query(type, { ...params, page })
        }
      });

    // update the resolver collection any time there's an update to
    // this component
    } else {
      // eslint-disable-next-line no-shadow
      collections = Object.keys(collections).reduce((memo, page) => {
        memo[page] = resolver.query(type, { ...params, page });
        return memo;
      }, {});

      // get the pages of results around our current page
      // eslint-disable-next-line no-shadow
      [page - 1, page, page + 1].forEach((page) => {
        if (page >= 1) {
          collections[page] = resolver.query(type, { ...params, page });
        }
      });

      this.setState({ collections });
    }
  }

  // clean up our resize listener
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleListLayout);
  }

  // retrieves the total results from the first resolved page
  getTotalResults() {
    let { collections } = this.state;
    let pages = Object.keys(collections);

    // the first resolved request should have total results
    let resolvedPage = pages.find(p => collections[p].request.isResolved);
    let { totalResults } = resolvedPage ? collections[resolvedPage].request.meta : {};

    return totalResults || 0;
  }

  // Handles setting the read offset based on the current scroll
  // position. Also calls `onPage` when a new page has crossed the
  // threshold of what's considered to be active the view
  handleScroll = (e) => {
    let { params, itemHeight, pageSize, onPage } = this.props;

    let top = e.target.scrollTop;
    let readOffset = Math.floor(top / itemHeight);

    // when we cross into a new page we might need to adjust query
    // params via the `onPage` prop
    let page = Math.floor(readOffset / pageSize) + 1;
    // one of these could be a integer or string
    if (page != params.page) onPage(page); // eslint-disable-line eqeqeq

    // update impagination's readOffset
    if (this.state.readOffset !== readOffset) {
      this.setState({ readOffset });
    }
  };

  // Handles updating our visible items count based on the list height
  handleListLayout = () => {
    let { itemHeight } = this.props;

    if (this.$list) {
      let listHeight = this.$list.offsetHeight;
      let visibleItems = Math.ceil(listHeight / itemHeight);
      this.setState({ visibleItems });
    }
  };

  // Renders a list item when it is within the thresholds of what is to
  // be considered within the list view
  renderListItem = (item, i) => {
    let { type, itemHeight, renderItem } = this.props;
    let { visibleItems, readOffset } = this.state;

    let threshold = 5;
    let isAboveLowerThresh = i > readOffset - threshold;
    let isBelowUpperThresh = i < readOffset + visibleItems + threshold;

    if (isAboveLowerThresh && isBelowUpperThresh) {
      let props = {
        key: i,
        className: cx('list-item', {
          'is-error': item.isRejected
        }),
        style: {
          height: itemHeight,
          top: i * itemHeight
        }
      };

      return item.isRejected ? (
        <li {...props} data-test-query-list-error={type}>
          {item.error[0].title}
        </li>
      ) : (
        <li {...props} data-test-query-list-item={type}>
          {renderItem(item)}
        </li>
      );
    } else {
      return null;
    }
  };

  render() {
    let {
      type,
      pageSize,
      loadHorizon,
      fetch,
      itemHeight,
      notFoundMessage
    } = this.props;
    let {
      readOffset,
      collections
    } = this.state;

    let totalResults = this.getTotalResults();
    let totalPages = Math.ceil(totalResults / pageSize);
    let listHeight = totalResults * itemHeight;

    // list height should be at least enough for the readOffset
    if (listHeight === 0) {
      listHeight = (readOffset + pageSize) * itemHeight;
    }

    return (
      <Impagination
        pageSize={pageSize}
        loadHorizon={loadHorizon}
        readOffset={readOffset}
        totalPages={totalPages}
        collections={collections}
        fetch={fetch}
        renderList={datasetState => (
          <div
            ref={(n) => { this.$list = n; }}
            className={styles.list}
            onScroll={this.handleScroll}
            data-test-query-list={type}
          >
            <List style={{ height: listHeight }}>
              {datasetState.hasRejected && !datasetState.length ? (
                <li className={styles['list-error']} data-test-query-list-error={type}>
                  {datasetState.rejected[0].error[0].title}
                </li>
              ) : !datasetState.length ? (
                <li className={cx('list-error', 'not-found')} data-test-query-list-not-found={type}>
                  {notFoundMessage}
                </li>
              ) : (
                datasetState.map(this.renderListItem)
              )}
            </List>
          </div>
        )}
      />
    );
  }
}

// This is a connected component strictly for creating a resolver on
// every state update. When this component is nested within a routes
// view (which is likely when viewing a detail pane), it becomes
// cumbersome to keep passing down a new resolver through every
// intermediate component
export default connect(
  ({ eholdings: { data } }) => ({
    resolver: createResolver(data)
  })
)(QueryList);
