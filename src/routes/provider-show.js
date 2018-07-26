import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TitleManager from '@folio/stripes-core/src/components/TitleManager';

import { createResolver } from '../redux';
import Provider from '../redux/provider';

import View from '../components/provider-show';
import SearchModal from '../components/search-modal';

class ProviderShowRoute extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        providerId: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    model: PropTypes.object.isRequired,
    resolver: PropTypes.object.isRequired,
    getProvider: PropTypes.func.isRequired,
    getPackages: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    let { providerId } = props.match.params;
    props.getProvider(providerId);
  }

  state = {
    pkgSearchParams: {},
    queryId: 0
  }

  componentDidUpdate(prevProps, prevState) {
    let { match, getPackages } = this.props;
    let { pkgSearchParams } = this.state;
    let { providerId } = match.params;

    if (providerId !== prevProps.match.params.providerId) {
      this.props.getProvider(providerId);
    }

    if (pkgSearchParams !== prevState.pkgSearchParams) {
      getPackages(providerId, pkgSearchParams);
    }
  }

  getPkgResults() {
    let { match, resolver } = this.props;
    let { pkgSearchParams } = this.state;
    let { providerId } = match.params;

    return resolver.query('packages', pkgSearchParams, {
      path: `${Provider.pathFor(providerId)}/packages`
    });
  }

  searchPackages = (pkgSearchParams) => {
    this.setState({
      pkgSearchParams,
      queryId: ++this.state.queryId
    });
  };

  fetchPackages = (page) => {
    let { pkgSearchParams } = this.state;
    this.searchPackages({ ...pkgSearchParams, page });
  };

  render() {
    const listType = 'packages';

    return (
      <TitleManager record={this.props.model.name}>
        <View
          model={this.props.model}
          packages={this.getPkgResults()}
          fetchPackages={this.fetchPackages}
          listType={listType}
          searchModal={
            <SearchModal
              key={this.state.queryId}
              listType={listType}
              query={this.state.pkgSearchParams}
              onSearch={this.searchPackages}
              onFilter={this.searchPackages}
            />
          }
        />
      </TitleManager>
    );
  }
}

export default connect(
  ({ eholdings: { data } }, { match }) => {
    let resolver = createResolver(data);

    return {
      model: resolver.find('providers', match.params.providerId),
      resolver
    };
  }, {
    getProvider: id => Provider.find(id, { include: 'packages' }),
    getPackages: (id, params) => Provider.queryRelated(id, 'packages', params)
  }
)(ProviderShowRoute);
