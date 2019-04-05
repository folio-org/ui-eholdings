import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import queryString from 'qs';

import { TitleManager } from '@folio/stripes/core';

import {
  createResolver,
} from '../redux';
import { ProxyType } from '../redux/application';
import Package from '../redux/package';
import Provider from '../redux/provider';
import Resource from '../redux/resource';
import Tag from '../redux/tag';
import { transformQueryParams } from '../components/utilities';
import { listTypes } from '../constants';

import View from '../components/package/show';
import SearchModal from '../components/search-modal';

class PackageShowRoute extends Component {
  static propTypes = {
    destroyPackage: PropTypes.func.isRequired,
    getPackage: PropTypes.func.isRequired,
    getPackageTitles: PropTypes.func.isRequired,
    getProvider: PropTypes.func.isRequired,
    getProxyTypes: PropTypes.func.isRequired,
    getTags: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    model: PropTypes.object.isRequired,
    provider: PropTypes.object.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    resolver: PropTypes.object.isRequired,
    tagsModel: PropTypes.object.isRequired,
    unloadResources: PropTypes.func.isRequired,
    updateEntityTags: PropTypes.func.isRequired,
    updateFolioTags: PropTypes.func.isRequired,
    updatePackage: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    let { packageId } = props.match.params;
    let [providerId] = packageId.split('-');
    props.getPackage(packageId);
    props.getProxyTypes();
    props.getProvider(providerId);
    props.getTags();
  }

  state = {
    queryId: 0,
    pkgSearchParams: {}
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      model: next,
      match,
      getPackage,
      unloadResources,
      history,
      location,
      getPackageTitles,
    } = this.props;

    const { pkgSearchParams } = this.state;

    const {
      model: old,
      match: oldMatch,
    } = prevProps;

    const { packageId } = match.params;

    if (!old.destroy.isResolved && next.destroy.isResolved) {
      // if package was reached based on search
      if (location.search) {
        history.replace({
          pathname: '/eholdings',
          search: location.search
        }, { eholdings: true });
        // package was reached directly from url not by search
      } else {
        history.replace('/eholdings?searchType=packages', { eholdings: true });
      }
    }

    if (packageId !== oldMatch.params.packageId) {
      getPackage(packageId);
      // if an update just resolved, unfetch the package titles
    } else if (next.update.isResolved && old.update.isPending) {
      unloadResources(next.resources);
    }

    if (pkgSearchParams !== prevState.pkgSearchParams) {
      const params = transformQueryParams('titles', pkgSearchParams);
      getPackageTitles(packageId, { ...params });
    }
  }

  getTitleResults() {
    let { match, resolver } = this.props;
    let { pkgSearchParams } = this.state;
    let { packageId } = match.params;
    const params = transformQueryParams('titles', pkgSearchParams);
    const collection = resolver.query('resources', params, {
      path: `${Package.pathFor(packageId)}/resources`
    });
    return collection;
  }

  /* This method is common between package-show and package-edit routes
   * This should be refactored once we can share model between the routes.
  */
  addPackageToHoldings = () => {
    let { model, updatePackage } = this.props;
    model.isSelected = true;
    model.selectedCount = model.titleCount;
    model.allowKbToAddTitles = true;
    updatePackage(model);
  };

  toggleSelected = () => {
    let { model, updatePackage, destroyPackage } = this.props;
    // if the package is custom setting the holding status to false
    // or deselecting the package will delete the package from holdings
    if (model.isCustom && !model.isSelected === false) {
      destroyPackage(model);
    } else {
      model.isSelected = !model.isSelected;
      model.selectedCount = model.isSelected ? model.titleCount : 0;

      // If package is selected, allowKbToAddTitles should be true
      if (model.isSelected) {
        model.allowKbToAddTitles = true;
      }
      // clear out any customizations before sending to server
      if (!model.isSelected) {
        model.visibilityData.isHidden = false;
        model.customCoverage = {};
        model.allowKbToAddTitles = false;
      }

      updatePackage(model);
    }
  };

  fetchPackageTitles = (page) => {
    let { pkgSearchParams } = this.state;
    this.searchTitles({ ...pkgSearchParams, page });
  }

  searchTitles = (pkgSearchParams) => {
    this.setState(({ queryId }) => ({
      pkgSearchParams,
      queryId: (queryId + 1)
    }));
  }

  getSearchType = () => {
    const { searchType } = queryString.parse(this.props.location.search, { ignoreQueryPrefix: true });
    return searchType;
  }

  handleFullView = () => {
    const {
      history,
      model,
    } = this.props;

    const fullViewRouteState = {
      pathname: `/eholdings/packages/${model.id}`,
      state: {
        eholdings: true,
      },
    };

    history.push(fullViewRouteState);
  }

  handleEdit = () => {
    const {
      history,
      model,
      location,
    } = this.props;

    const editRouteState = {
      pathname: `/eholdings/packages/${model.id}/edit`,
      search: location.search,
      state: {
        eholdings: true,
      },
    };

    if (this.getSearchType()) {
      history.push(editRouteState);
    }

    history.replace(editRouteState);
  }

  render() {
    const {
      history,
      model,
      tagsModel,
      provider,
      proxyTypes,
      updateEntityTags,
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
          packageTitles={this.getTitleResults()}
          updateEntityTags={updateEntityTags}
          updateFolioTags={updateFolioTags}
          proxyTypes={proxyTypes}
          provider={provider}
          fetchPackageTitles={this.fetchPackageTitles}
          toggleSelected={this.toggleSelected}
          addPackageToHoldings={this.addPackageToHoldings}
          toggleHidden={this.toggleHidden}
          customCoverageSubmitted={this.customCoverageSubmitted}
          toggleAllowKbToAddTitles={this.toggleAllowKbToAddTitles}
          onEdit={this.handleEdit}
          onFullView={this.getSearchType() && this.handleFullView}
          isFreshlySaved={
            history.action === 'PUSH' &&
            history.location.state &&
            history.location.state.isFreshlySaved
          }
          isNewRecord={
            history.action === 'REPLACE' &&
            history.location.state &&
            history.location.state.isNewRecord
          }
          isDestroyed={
            history.action === 'REPLACE' &&
            history.location.state &&
            history.location.state.isDestroyed
          }
          searchModal={
            <SearchModal
              key={queryId}
              listType={listTypes.TITLES}
              query={pkgSearchParams}
              onSearch={this.searchTitles}
              onFilter={this.searchTitles}
            />
          }
        />
      </TitleManager>
    );
  }
}

export default connect(
  (store, ownProps) => {
    const {
      eholdings: { data },
    } = store;

    const { match } = ownProps;

    const resolver = createResolver(data);
    const model = resolver.find('packages', match.params.packageId);

    return {
      model,
      proxyTypes: resolver.query('proxyTypes'),
      provider: resolver.find('providers', model.providerId),
      tagsModel: resolver.query('tags'),
      resolver,
    };
  },
  {
    getPackage: id => Package.find(id),
    getPackageTitles: (id, params) => Package.queryRelated(id, 'resources', params),
    getProxyTypes: () => ProxyType.query(),
    getTags: () => Tag.query(),
    getProvider: id => Provider.find(id),
    unloadResources: collection => Resource.unload(collection),
    updatePackage: model => Package.save(model),
    updateEntityTags: (model) => Package.save(model),
    updateFolioTags: (model) => Tag.create(model),
    destroyPackage: model => Package.destroy(model),
  }
)(PackageShowRoute);
