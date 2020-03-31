import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { TitleManager } from '@folio/stripes/core';


import queryString from 'qs';
import { createResolver } from '../redux';
import Provider from '../redux/provider';
import Tag from '../redux/tag';
import { ProxyType, RootProxy } from '../redux/application';

import View from '../components/provider/show';
import SearchModal from '../components/search-modal';
import { listTypes } from '../constants';

class ProviderShowRoute extends Component {
  static propTypes = {
    getPackages: PropTypes.func.isRequired,
    getProvider: PropTypes.func.isRequired,
    getProxyTypes: PropTypes.func.isRequired,
    getRootProxy: PropTypes.func.isRequired,
    getTags: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    model: PropTypes.object.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    resolver: PropTypes.object.isRequired,
    rootProxy: PropTypes.object.isRequired,
    tagsModel: PropTypes.object.isRequired,
    updateFolioTags: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const { filterPackages } = queryString.parse(props.location.search);

    this.state = {
      pkgSearchParams: filterPackages ? { q: filterPackages } : {},
      queryId: 0,
    };
    const { providerId } = props.match.params;
    props.getProvider(providerId);
    props.getProxyTypes();
    props.getRootProxy();
    props.getTags();
  }

  componentDidUpdate(prevProps, prevState) {
    const { match, getPackages, getProvider } = this.props;
    const { pkgSearchParams } = this.state;
    const { providerId } = match.params;

    if (providerId !== prevProps.match.params.providerId) {
      getProvider(providerId);
    }

    if (pkgSearchParams !== prevState.pkgSearchParams) {
      getPackages(providerId, pkgSearchParams);
    }
  }

  getPkgResults() {
    const { match, resolver } = this.props;
    const { pkgSearchParams } = this.state;
    const { providerId } = match.params;

    return resolver.query('packages', pkgSearchParams, {
      path: `${Provider.pathFor(providerId)}/packages`
    });
  }

  searchPackages = (pkgSearchParams) => {
    const { location, history } = this.props;
    const qs = queryString.parse(location.search, { ignoreQueryPrefix: true });
    const search = queryString.stringify({ ...qs, filterPackages: pkgSearchParams.q });

    if (pkgSearchParams?.q) {
      history.replace({
        ...location,
        search
      }, { eholdings: true });
    }

    this.setState(({ queryId }) => ({
      pkgSearchParams,
      queryId: (queryId + 1)
    }));
  };

  fetchPackages = (page) => {
    const { pkgSearchParams } = this.state;
    this.searchPackages({ ...pkgSearchParams, page });
  };

  getSearchType = () => {
    const { searchType } = queryString.parse(this.props.location.search, { ignoreQueryPrefix: true });
    return searchType;
  }

  handleEdit = () => {
    const {
      history,
      model,
      location,
    } = this.props;

    const editRouteState = {
      pathname: `/eholdings/providers/${model.id}/edit`,
      search: location.search,
      state: {
        eholdings: true,
      }
    };

    history.replace(editRouteState);
  }

  render() {
    const {
      history,
      model,
      proxyTypes,
      rootProxy,
      tagsModel,
      updateFolioTags,
    } = this.props;

    const {
      pkgSearchParams,
      queryId,
    } = this.state;

    return (
      <TitleManager record={model.name}>
        <View
          model={model}
          tagsModel={tagsModel}
          packages={this.getPkgResults()}
          fetchPackages={this.fetchPackages}
          proxyTypes={proxyTypes}
          rootProxy={rootProxy}
          listType={listTypes.PACKAGES}
          updateFolioTags={updateFolioTags}
          searchModal={
            <SearchModal
              tagsModel={tagsModel}
              key={queryId}
              listType={listTypes.PACKAGES}
              query={pkgSearchParams}
              onSearch={this.searchPackages}
              onFilter={this.searchPackages}
            />
          }
          onEdit={this.handleEdit}
          isFreshlySaved={
            history.action === 'REPLACE' &&
            history.location.state &&
            history.location.state.isFreshlySaved
          }
          isDestroyed={
            history.action === 'REPLACE' &&
            history.location.state &&
            history.location.state.isDestroyed
          }
          isNewRecord={
            history.action === 'REPLACE' &&
            history.location.state &&
            history.location.state.isNewRecord
          }
        />
      </TitleManager>
    );
  }
}
export default connect(
  ({ eholdings: { data } }, { match }) => {
    const resolver = createResolver(data);
    return {
      model: resolver.find('providers', match.params.providerId),
      proxyTypes: resolver.query('proxyTypes'),
      tagsModel: resolver.query('tags'),
      rootProxy: resolver.find('rootProxies', 'root-proxy'),
      resolver
    };
  }, {
    getProvider: id => Provider.find(id, { include: 'packages' }),
    getPackages: (id, params) => Provider.queryRelated(id, 'packages', params),
    getProxyTypes: () => ProxyType.query(),
    getTags: () => Tag.query(),
    updateFolioTags: (model) => Tag.create(model),
    getRootProxy: () => RootProxy.find('root-proxy')
  }
)(ProviderShowRoute);
