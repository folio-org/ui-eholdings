import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createResolver } from '../../redux';

import styles from './query-list.css';
import Impagination from './impagination';
import List from '../list';

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
      readOffset: (page - 1) * pageSize,
      collections: {
        [page]: resolver.query(type, { ...params, page })
      }
    };
  }

  // update the DOM element's scrollTop position with our initial
  // page offset
  componentDidMount() {
    let { params, pageSize, itemHeight } = this.props;
    let pageOffset = parseInt(params.page || 1, 10) - 1;

    // $list is populated via the ref in the render method below
    if (pageOffset && this.$list) {
      this.$list.scrollTop = pageOffset * pageSize * itemHeight;
    }
  }

  componentWillReceiveProps(nextProps) {
    let { type, params, pageSize, resolver } = nextProps;
    let { collections } = this.state;
    let { page = 1 } = params;

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

      if (params !== this.props.params) {
        collections[page] = resolver.query(type, { ...params, page });
      }

      this.setState({ collections });
    }
  }

  // retrieves the total results from the first
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
    let bottom = top + e.target.offsetHeight;
    // scroll up, use upper bound; down uses the lower bound
    let boundary = top > this.scrollTop ? bottom : top;
    let readOffset = Math.floor(boundary / itemHeight);

    // this is kept out of state to avoid renders
    this.scrollTop = top;

    // when we cross into a new page we might need to adjust query
    // params via the `onPage` prop
    let page = Math.round(readOffset / pageSize) + 1;
    // one of these could be a integer or string
    if (page != params.page) onPage(page); // eslint-disable-line eqeqeq

    // update impagination's readOffset
    if (this.state.readOffset !== readOffset) {
      this.setState({ readOffset });
    }
  };

  render() {
    let {
      type,
      pageSize,
      loadHorizon,
      fetch,
      itemHeight,
      renderItem,
      notFoundMessage = 'Not Found'
    } = this.props;
    let {
      readOffset,
      collections
    } = this.state;

    let totalResults = this.getTotalResults();
    let totalPages = Math.ceil(totalResults / pageSize);
    let listHeight = totalResults * itemHeight;

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
            <List style={{ height: listHeight, overflow: 'hidden' }}>
              {datasetState.hasRejected && !datasetState.length ? (
                <li className={styles.error} data-test-query-list-error={type}>
                  {datasetState.rejected[0].error[0].title}
                </li>
              ) : !datasetState.length ? (
                <li className={styles['not-found']} data-test-query-list-not-found={type}>
                  {notFoundMessage}
                </li>
              ) : (
                datasetState.map((item, i) => (item.isRejected ? (
                  <li className={styles.error} data-test-query-list-error={type}>
                    {item.error[0].title}
                  </li>
                ) : (
                  renderItem(item, i)
                )))
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
