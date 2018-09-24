import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TitleManager } from '@folio/stripes-core';

import { createResolver } from '../redux';
import Provider from '../redux/provider';
import { ProxyType, RootProxy } from '../redux/application';

import View from '../components/provider/show';
import SearchModal from '../components/search-modal';

class ProviderShowRoute extends Component {
  static propTypes = {
    getPackages: PropTypes.func.isRequired,
    getProvider: PropTypes.func.isRequired,
    getProxyTypes: PropTypes.func.isRequired,
    getRootProxy: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        providerId: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    model: PropTypes.object.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    resolver: PropTypes.object.isRequired,
    rootProxy: PropTypes.object.isRequired,

  };

  constructor(props) {
    super(props);
    let { providerId } = props.match.params;
    props.getProvider(providerId);
    props.getProxyTypes();
    props.getRootProxy();
  }

  state = {
    pkgSearchParams: {},
    queryId: 0
  }

  componentDidUpdate(prevProps, prevState) {
    let { match, getPackages, getProvider } = this.props;
    let { pkgSearchParams } = this.state;
    let { providerId } = match.params;

    if (providerId !== prevProps.match.params.providerId) {
      getProvider(providerId);
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
    this.setState(({ queryId }) => ({
      pkgSearchParams,
      queryId: (queryId + 1)
    }));
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
          proxyTypes={this.props.proxyTypes}
          rootProxy={this.props.rootProxy}
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
      proxyTypes: resolver.query('proxyTypes'),
      rootProxy: resolver.find('rootProxies', 'root-proxy'),
      resolver
    };
  }, {
    getProvider: id => Provider.find(id, { include: 'packages' }),
    getPackages: (id, params) => Provider.queryRelated(id, 'packages', params),
    getProxyTypes: () => ProxyType.query(),
    getRootProxy: () => RootProxy.find('root-proxy')
  }
)(ProviderShowRoute);
