import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createResolver } from '../redux';

import Impagination from './impagination';
import List from './list';

class Query extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
    pageSize: PropTypes.number,
    loadHorizon: PropTypes.number,
    fetch: PropTypes.func.isRequired,
    resolver: PropTypes.object.isRequired,
    renderItem: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    let { type, params, resolver } = this.props;
    let { page = 1 } = params;

    this.state = {
      collections: {
        [page]: resolver.query(type, { ...params, page })
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    let { type, params, resolver } = nextProps;
    let { collections } = this.state;
    let { page = 1 } = params;

    if (type !== this.props.type) {
      this.setState({
        collections: {
          [page]: resolver.query(type, { ...params, page })
        }
      });
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

  render() {
    let {
      type,
      pageSize,
      loadHorizon,
      fetch,
      renderItem
    } = this.props;
    let {
      collections
    } = this.state;

    return (
      <Impagination
        pageSize={pageSize}
        loadHorizon={loadHorizon}
        fetch={fetch}
        collections={collections}
        renderList={datasetState => (
          <List data-test-query-list={type}>
            {datasetState.map((item, i) => {
              return item.content && renderItem(item.content, i);
            })}
          </List>
        )}
      />
    );
  }
}

export default connect(
  ({ eholdings: { data } }) => ({
    resolver: createResolver(data)
  })
)(Query);
