import { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import queryString from 'qs';
import isEqual from 'lodash/isEqual';
import reduce from 'lodash/reduce';

import { TitleManager } from '@folio/stripes/core';

import {
  createResolver,
} from '../redux';
import { ProxyType } from '../redux/application';
import Package from '../redux/package';
import Provider from '../redux/provider';
import Resource from '../redux/resource';
import { selectPropFromData } from '../redux/selectors';
import {
  getAccessTypes as getAccessTypesAction,
  getCostPerUse as getCostPerUseAction,
  getCostPerUsePackageTitles as getCostPerUsePackageTitlesAction,
  clearCostPerUseData as clearCostPerUseDataAction,
  getPackageTitles as getPackageTitlesAction,
  clearPackageTitles as clearPackageTitlesAction,
} from '../redux/actions';
import Tag from '../redux/tag';
import { transformQueryParams } from '../components/utilities';
import {
  listTypes,
  accessTypesReduxStateShape,
  costPerUse as costPerUseShape,
  PAGE_SIZE,
  FIRST_PAGE,
} from '../constants';

import View from '../components/package/show';
import SearchModal from '../components/search-modal';

class PackageShowRoute extends Component {
  static propTypes = {
    accessStatusTypes: accessTypesReduxStateShape.isRequired,
    clearCostPerUseData: PropTypes.func.isRequired,
    clearPackageTitles: PropTypes.func.isRequired,
    costPerUse: costPerUseShape.CostPerUseReduxStateShape.isRequired,
    destroyPackage: PropTypes.func.isRequired,
    getAccessTypes: PropTypes.func.isRequired,
    getCostPerUse: PropTypes.func.isRequired,
    getCostPerUsePackageTitles: PropTypes.func.isRequired,
    getPackage: PropTypes.func.isRequired,
    getPackageTitles: PropTypes.func.isRequired,
    getProvider: PropTypes.func.isRequired,
    getProxyTypes: PropTypes.func.isRequired,
    getTags: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    model: PropTypes.object.isRequired,
    packageTitles: PropTypes.shape({
      items: PropTypes.array.isRequired,
      totalResults: PropTypes.number.isRequired,
    }).isRequired,
    provider: PropTypes.object.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    removeUpdateRequests: PropTypes.func.isRequired,
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
        count: PAGE_SIZE,
        page: FIRST_PAGE,
        filter: {
          tags,
          type,
          selected,
          'access-type': accessType,
        },
      },
      queryId: 0,
      isTitlesUpdating: false,
    };

    const { packageId } = props.match.params;
    const [providerId] = packageId.split('-');
    props.getPackage(packageId);
    props.getProxyTypes();
    props.getProvider(providerId);
    props.getTags();
    props.getAccessTypes();
  }

  componentDidMount() {
    const { match } = this.props;
    const { packageId } = match.params;

    this.updateTitles(packageId);
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
    // need to clear 'update' requests for Unsaved Changes Modal to work correctly on Edit
    if (isFreshlySaved) {
      removeUpdateRequests();
    }

    if (!old.destroy.isResolved && next.destroy.isResolved) {
      // if package was reached based on search
      if (location.search) {
        history.replace({
          pathname: '/eholdings',
          search: location.search,
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

      getPackageTitles({ packageId, params });
    }
  }

  componentWillUnmount() {
    this.props.clearCostPerUseData();
    window.clearTimeout(this.timeout);
  }

  /* This method is common between package-show and package-edit routes
   * This should be refactored once we can share model between the routes.
  */
  addPackageToHoldings = () => {
    const {
      model,
      match,
      updatePackage,
    } = this.props;
    const { packageId } = match.params;

    model.isSelected = true;
    model.selectedCount = model.titleCount;
    model.allowKbToAddTitles = true;

    updatePackage(model);
    this.updateHoldingsStatus(packageId);
  };

  updateTitles(packageId) {
    const { getPackageTitles } = this.props;
    const { pkgSearchParams } = this.state;

    const params = transformQueryParams('titles', pkgSearchParams);

    this.setState(() => {
      return { isTitlesUpdating: true };
    });

    this.timeout = window.setTimeout(() => {
      getPackageTitles({ packageId, params });

      this.setState(() => {
        return { isTitlesUpdating: false };
      });
    }, 6000);
  }

  updateHoldingsStatus(packageId) {
    const {
      model,
      packageTitles,
      getPackageTitles,
    } = this.props;
    const { pkgSearchParams } = this.state;

    const params = transformQueryParams('titles', pkgSearchParams);

    this.setState(() => {
      return { isTitlesUpdating: true };
    });

    this.interval = window.setInterval(() => {
      let isUpdated = true;

      packageTitles.items.forEach(item => {
        if (item.attributes.isSelected !== model.isSelected) {
          isUpdated = false;
        }
      });

      if (isUpdated) {
        window.clearInterval(this.interval);

        getPackageTitles({ packageId, params });

        this.setState(() => {
          return { isTitlesUpdating: false };
        });
      }
    }, 2000);
  }

  toggleSelected = () => {
    const { model, match, updatePackage, destroyPackage } = this.props;
    const { packageId } = match.params;

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
      this.updateHoldingsStatus(packageId);
    }
  };

  fetchPackageTitles = (page) => {
    const { pkgSearchParams } = this.state;

    this.searchTitles({ ...pkgSearchParams, page });
  }

  searchTitles = (pkgSearchParams) => {
    const {
      location,
      history,
      clearPackageTitles,
    } = this.props;

    const paramDifference = reduce(pkgSearchParams, (result, item, key) => {
      return isEqual(item, this.state.pkgSearchParams[key]) ? result : result.concat(key);
    }, []);

    if (!(paramDifference.length === 1 && paramDifference[0] === 'page')) {
      clearPackageTitles();
    }

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
      search,
    }, { eholdings: true });

    this.setState(({ queryId }) => ({
      pkgSearchParams: {
        ...pkgSearchParams,
        count: PAGE_SIZE,
        page: pkgSearchParams?.page || FIRST_PAGE,
      },
      queryId: (queryId + 1),
    }));
  }

  getSearchType = () => {
    const { searchType } = queryString.parse(this.props.location.search, { ignoreQueryPrefix: true });

    return searchType;
  }

  fetchPackageCostPerUse = (filterData) => {
    const {
      getCostPerUse,
      model: { id },
    } = this.props;

    getCostPerUse(listTypes.PACKAGES, id, filterData);
  }

  fetchCostPerUsePackageTitles = (filterData, loadMore = false) => {
    const {
      getCostPerUsePackageTitles,
      model: { id },
    } = this.props;

    getCostPerUsePackageTitles(id, filterData, loadMore);
  }

  loadMoreCostPerUsePackageTitles = (filterData) => {
    this.fetchCostPerUsePackageTitles(filterData, true);
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
      costPerUse,
      packageTitles,
    } = this.props;
    const {
      pkgSearchParams,
      queryId,
      isTitlesUpdating,
    } = this.state;

    return (
      <TitleManager record={model.name}>
        <View
          model={model}
          tagsModel={tagsModel}
          packageTitles={packageTitles}
          updateFolioTags={updateFolioTags}
          proxyTypes={proxyTypes}
          provider={provider}
          fetchPackageTitles={this.fetchPackageTitles}
          fetchPackageCostPerUse={this.fetchPackageCostPerUse}
          fetchCostPerUsePackageTitles={this.fetchCostPerUsePackageTitles}
          loadMoreCostPerUsePackageTitles={this.loadMoreCostPerUsePackageTitles}
          toggleSelected={this.toggleSelected}
          addPackageToHoldings={this.addPackageToHoldings}
          toggleHidden={this.toggleHidden}
          customCoverageSubmitted={this.customCoverageSubmitted}
          toggleAllowKbToAddTitles={this.toggleAllowKbToAddTitles}
          onEdit={this.handleEdit}
          accessStatusTypes={accessStatusTypes}
          costPerUse={costPerUse}
          isTitlesUpdating={isTitlesUpdating}
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
      costPerUse: selectPropFromData(store, 'costPerUse'),
      packageTitles: selectPropFromData(store, 'packageTitles'),
    };
  },
  {
    getPackage: id => Package.find(id, { include: ['accessType'] }),
    getPackageTitles: getPackageTitlesAction,
    clearPackageTitles: clearPackageTitlesAction,
    getProxyTypes: () => ProxyType.query(),
    getTags: () => Tag.query(),
    getProvider: id => Provider.find(id),
    unloadResources: collection => Resource.unload(collection),
    updatePackage: model => Package.save(model),
    updateFolioTags: (model) => Tag.create(model),
    destroyPackage: model => Package.destroy(model),
    removeUpdateRequests: () => Package.removeRequests('update'),
    getAccessTypes: getAccessTypesAction,
    getCostPerUse: getCostPerUseAction,
    getCostPerUsePackageTitles: getCostPerUsePackageTitlesAction,
    clearCostPerUseData: clearCostPerUseDataAction,
  }
)(PackageShowRoute);
