import { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import queryString from 'qs';
import isEqual from 'lodash/isEqual';

import { TitleManager } from '@folio/stripes/core';

import { transformQueryParams } from '../../components/utilities';
import {
  listTypes,
  accessTypesReduxStateShape,
  costPerUse as costPerUseShape,
  PAGE_SIZE,
  FIRST_PAGE,
  INTERVAL_BEFORE_CHECK_FOR_AN_UPDATE,
  tagPaths,
} from '../../constants';

import View from '../../components/package/show';
import { SearchSection } from '../../components/search-section';

class PackageShowRoute extends Component {
  static propTypes = {
    accessStatusTypes: accessTypesReduxStateShape.isRequired,
    clearCostPerUseData: PropTypes.func.isRequired,
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
    tagsModelOfAlreadyAddedTags: PropTypes.object,
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
      searchfield = 'title',
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

    this.getUpdatedTitles(packageId);
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

    if (!isEqual(pkgSearchParams, prevState.pkgSearchParams)) {
      const params = transformQueryParams('titles', pkgSearchParams);

      getPackageTitles({ packageId, params });
    }
  }

  componentWillUnmount() {
    this.props.clearCostPerUseData();
    clearInterval(this.interval);
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
    this.updateTitles(packageId);
  };

  getUpdatedTitles(packageId) {
    const { getPackageTitles } = this.props;
    const { pkgSearchParams } = this.state;

    const params = transformQueryParams('titles', pkgSearchParams);

    this.setState(() => {
      return { isTitlesUpdating: true };
    });

    getPackageTitles({ packageId, params });

    this.setState(() => {
      return { isTitlesUpdating: false };
    });
  }

  updateTitles(packageId) {
    const {
      model,
      getPackageTitles,
    } = this.props;
    const { pkgSearchParams } = this.state;

    const params = transformQueryParams('titles', pkgSearchParams);

    this.setState(() => {
      return { isTitlesUpdating: true };
    });

    clearInterval(this.interval);

    this.interval = window.setInterval(() => {
      const arePackageTitlesUpdated = this.props.packageTitles.items
        .every(item => item.attributes.isSelected === model.isSelected);

      if (arePackageTitlesUpdated) {
        window.clearInterval(this.interval);

        this.setState(() => {
          return { isTitlesUpdating: false };
        });
      } else {
        getPackageTitles({ packageId, params });
      }
    }, INTERVAL_BEFORE_CHECK_FOR_AN_UPDATE);
  }

  toggleSelected = () => {
    const {
      model,
      match,
      updatePackage,
      destroyPackage,
    } = this.props;

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
      this.updateTitles(packageId);
    }
  };

  fetchPackageTitles = (page) => {
    const { pkgSearchParams } = this.state;

    this.searchTitles({ ...pkgSearchParams, page });
  };

  searchTitles = (pkgSearchParams) => {
    const {
      location,
      history,
    } = this.props;

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
    });

    this.setState(({ queryId }) => ({
      pkgSearchParams: {
        ...pkgSearchParams,
        count: PAGE_SIZE,
        page: pkgSearchParams?.page || FIRST_PAGE,
      },
      queryId: (queryId + 1),
    }));
  };

  toggleSearchModal = (isModalVisible) => {
    if (isModalVisible) {
      this.props.getTags(undefined, { path: tagPaths.alreadyAddedToRecords });
    }
  };

  fetchPackageCostPerUse = (filterData) => {
    const {
      getCostPerUse,
      model: { id },
    } = this.props;

    getCostPerUse(listTypes.PACKAGES, id, filterData);
  };

  fetchCostPerUsePackageTitles = (filterData) => {
    const {
      getCostPerUsePackageTitles,
      model: { id },
    } = this.props;

    getCostPerUsePackageTitles(id, filterData);
  };

  loadMoreCostPerUsePackageTitles = (filterData) => {
    this.fetchCostPerUsePackageTitles(filterData, true);
  };

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
  };

  toggleTitles = () => {
    const {
      getPackageTitles,
      match,
    } = this.props;
    const {
      pkgSearchParams,
    } = this.state;
    const { packageId } = match.params;

    const params = transformQueryParams('titles', pkgSearchParams);

    getPackageTitles({ packageId, params });
  };

  render() {
    const {
      history,
      model,
      tagsModel,
      tagsModelOfAlreadyAddedTags,
      provider,
      proxyTypes,
      updateFolioTags,
      accessStatusTypes,
      costPerUse,
      packageTitles,
    } = this.props;

    const {
      pkgSearchParams,
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
          pkgSearchParams={pkgSearchParams}
          onToggleTitles={this.toggleTitles}
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
            <SearchSection
              queryProp={pkgSearchParams}
              tagsModelOfAlreadyAddedTags={tagsModelOfAlreadyAddedTags}
              accessTypes={accessStatusTypes}
              searchType={listTypes.TITLES}
              onFilter={this.searchTitles}
              onToggleActions={this.toggleSearchModal}
            />
          }
        />
      </TitleManager>
    );
  }
}

export default PackageShowRoute;
