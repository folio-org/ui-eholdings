import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import queryString from 'qs';
import isEqual from 'lodash/isEqual';

import { TitleManager } from '@folio/stripes/core';

import {
  createResolver,
} from '../redux';
import { ProxyType } from '../redux/application';
import Package from '../redux/package';
import Provider from '../redux/provider';
import Resource from '../redux/resource';
import { selectPropFromData } from '../redux/selectors';
import { getAccessTypes as getAccessTypesAction } from '../redux/actions';
import Tag from '../redux/tag';
import { transformQueryParams } from '../components/utilities';
import {
  listTypes,
  accessTypesReduxStateShape,
} from '../constants';

import View from '../components/package/show';
import SearchModal from '../components/search-modal';

class PackageShowRoute extends Component {
  static propTypes = {
    accessStatusTypes: accessTypesReduxStateShape.isRequired,
    destroyPackage: PropTypes.func.isRequired,
    getAccessTypes: PropTypes.func.isRequired,
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
    removeUpdateRequests: PropTypes.func.isRequired,
    resolver: PropTypes.object.isRequired,
    tagsModel: PropTypes.object.isRequired,
    unloadResources: PropTypes.func.isRequired,
    updateFolioTags: PropTypes.func.isRequired,
    updatePackage: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const {
      filterTitles,
      sort,
      tags,
      type,
      'access-type': accessType,
      selected,
      searchfield,
    } = queryString.parse(props.location.search.substring(1));

    this.state = {
      pkgSearchParams: {
        q: filterTitles,
        sort,
        searchfield,
        filter: {
          tags,
          type,
          selected,
          'access-type': accessType,
        }
      },
      queryId: 0,
    };

    const { packageId } = props.match.params;
    const [providerId] = packageId.split('-');
    props.getPackage(packageId);
    props.getProxyTypes();
    props.getProvider(providerId);
    props.getTags();
    props.getAccessTypes();
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
      removeUpdateRequests,
    } = this.props;

    const { pkgSearchParams } = this.state;

    const {
      model: old,
      match: oldMatch,
    } = prevProps;

    const tagsChanged = old.tags.tagList.length !== next.tags.tagList.length;
    const wasPending = old.update.isPending && !next.update.isPending;
    const needsUpdate = !isEqual(old, next);
    const isRejected = next.update.isRejected;

    const wasUnSelected = old.isSelected && !next.isSelected;
    const isCurrentlySelected = !old.isSelected && next.isSelected;
    const isFreshlySaved = wasPending && needsUpdate && !isRejected && (wasUnSelected || isCurrentlySelected);

    const { packageId } = match.params;

    // if package was just added/removed from holdings
    // need to clear 'update' requests for Unsaved Changes Modal to work coorectly on Edit
    if (isFreshlySaved) {
      removeUpdateRequests();
    }

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
    } else if (next.update.isResolved && old.update.isPending && !tagsChanged) {
      unloadResources(next.resources);
    }

    if (pkgSearchParams !== prevState.pkgSearchParams) {
      const params = transformQueryParams('titles', pkgSearchParams);
      getPackageTitles(packageId, { ...params });
    }
  }

  getTitleResults() {
    const { match, resolver } = this.props;
    const { pkgSearchParams } = this.state;
    const { packageId } = match.params;
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
    const { model, updatePackage } = this.props;
    model.isSelected = true;
    model.selectedCount = model.titleCount;
    model.allowKbToAddTitles = true;
    updatePackage(model);
  };

  toggleSelected = () => {
    const { model, updatePackage, destroyPackage } = this.props;
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
    const { pkgSearchParams } = this.state;
    this.searchTitles({ ...pkgSearchParams, page });
  }

  searchTitles = (pkgSearchParams) => {
    const { location, history } = this.props;
    const qs = queryString.parse(location.search, { ignoreQueryPrefix: true });
    const search = queryString.stringify({
      ...qs,
      filterTitles: pkgSearchParams.q,
      sort: pkgSearchParams.sort,
      tags: pkgSearchParams.filter?.tags,
      type: pkgSearchParams.filter?.type,
      'access-type': pkgSearchParams.filter?.['access-type'],
      selected: pkgSearchParams.filter?.selected,
      searchfield: pkgSearchParams.searchfield,
    });

    history.replace({
      ...location,
      search
    }, { eholdings: true });

    this.setState(({ queryId }) => ({
      pkgSearchParams,
      queryId: (queryId + 1)
    }));
  }

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
      pathname: `/eholdings/packages/${model.id}/edit`,
      search: location.search,
      state: {
        eholdings: true,
      },
    };

    history.replace(editRouteState);
  }

  render() {
    const {
      history,
      model,
      tagsModel,
      provider,
      proxyTypes,
      updateFolioTags,
      accessStatusTypes,
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
          accessStatusTypes={accessStatusTypes}
          isFreshlySaved={
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
              tagsModel={tagsModel}
              listType={listTypes.TITLES}
              query={pkgSearchParams}
              onSearch={this.searchTitles}
              onFilter={this.searchTitles}
              accessTypes={accessStatusTypes}
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
      accessStatusTypes: selectPropFromData(store, 'accessStatusTypes'),
    };
  },
  {
    getPackage: id => Package.find(id, { include: ['accessType'] }),
    getPackageTitles: (id, params) => Package.queryRelated(id, 'resources', params),
    getProxyTypes: () => ProxyType.query(),
    getTags: () => Tag.query(),
    getProvider: id => Provider.find(id),
    unloadResources: collection => Resource.unload(collection),
    updatePackage: model => Package.save(model),
    updateFolioTags: (model) => Tag.create(model),
    destroyPackage: model => Package.destroy(model),
    removeUpdateRequests: () => Package.removeRequests('update'),
    getAccessTypes: getAccessTypesAction,
  }
)(PackageShowRoute);
