import {
  useEffect,
  useState,
} from 'react';
import {
  useLocation,
  useHistory,
  useParams,
} from 'react-router';
import PropTypes from 'prop-types';
import queryString from 'qs';

import { TitleManager } from '@folio/stripes/core';

import View from '../../components/package/show';
import { useUpdatePackageTitlesSelection } from '../../hooks/use-update-package-titles-selection';
import { SearchSection } from '../../components/search-section';
import TitleSearchFilters from '../../components/title-search-filters';
import { transformQueryParams } from '../../components/utilities';
import {
  listTypes,
  accessTypesReduxStateShape,
  costPerUse as costPerUseShape,
  PAGE_SIZE,
  FIRST_PAGE,
  tagPaths,
  titleSortFilterConfig,
  selectionStatusFilterConfig,
  publicationTypeTitlesListFilterConfig,
} from '../../constants';

const propTypes = {
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

const PackageShowRoute = ({
  accessStatusTypes,
  clearCostPerUseData,
  costPerUse,
  destroyPackage,
  getAccessTypes,
  getCostPerUse,
  getCostPerUsePackageTitles,
  getPackage,
  getPackageTitles,
  getProvider,
  getProxyTypes,
  getTags,
  model,
  packageTitles,
  provider,
  proxyTypes,
  removeUpdateRequests,
  tagsModel,
  tagsModelOfAlreadyAddedTags,
  unloadResources,
  updateFolioTags,
  updatePackage,
}) => {
  const history = useHistory();
  const location = useLocation();
  const params = useParams();

  const {
    filterTitles,
    sort,
    tags,
    type,
    'access-type': accessType,
    selected,
    searchfield = 'title',
  } = queryString.parse(location.search.substring(1));
  const { packageId } = params;
  const [providerId] = packageId.split('-');

  const [pkgSearchParams, setPkgSearchParams] = useState({
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
  });
  const [isTitlesUpdating, setIsTitlesUpdating] = useState(false);


  const getUpdatedTitles = () => {
    const queryParams = transformQueryParams('titles', pkgSearchParams);

    setIsTitlesUpdating(true);

    getPackageTitles({ packageId, params: queryParams });
  };

  useEffect(() => {
    getPackage(packageId);
    getProxyTypes();
    getProvider(providerId);
    getTags();
    getAccessTypes();
    getUpdatedTitles();

    return () => {
      clearCostPerUseData();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!packageTitles.isLoading) {
      setIsTitlesUpdating(false);
    }
  }, [packageTitles.isLoading]);

  useEffect(() => {
    // if package was just added/removed from holdings
    // need to clear 'update' requests for Unsaved Changes Modal to work correctly on Edit
    if (model.update.isPending && !model.update.isRejected) {
      removeUpdateRequests();
    }
  }, [removeUpdateRequests, model.update.isPending, model.update.isRejected, model.isSelected]);

  useEffect(() => {
    // if an update just resolved, unfetch the package titles
    if (model.update.isResolved) {
      unloadResources(model.resources);
    }
  }, [unloadResources, model.update.isResolved, model.resources]);

  useEffect(() => {
    if (model.destroy.isResolved) {
      // if package was reached based on search we want to keep the search params
      // to show search results
      if (location.search) {
        history.replace({
          pathname: '/eholdings',
          search: location.search,
        }, { eholdings: true });
        // package was reached directly from url not by search, so we can just show the default search page
      } else {
        history.replace('/eholdings?searchType=packages', { eholdings: true });
      }
    }
  }, [model.destroy.isResolved, history, location.search]);

  useEffect(() => {
    const queryParams = transformQueryParams('titles', pkgSearchParams);

    getPackageTitles({ packageId, params: queryParams });
  }, [pkgSearchParams, getPackageTitles, packageId]);

  const { updateTitles } = useUpdatePackageTitlesSelection({
    queryParams: transformQueryParams('titles', pkgSearchParams),
    packageModel: model,
    setIsTitlesUpdating,
    packageTitles,
    getPackageTitles,
  });

  const addPackageToHoldings = () => {
    // we're mutating a prop here and in a couple of other functions in this file, which is a huuuge no-no
    // but the model object is not a simple object, but an instance o class, so we can't just
    // destructure it and update properties of a copy
    // for now it works fine, but we need to be aware of this
    // in one of the next PR's we'll get rid of these class instances and use reach-query for CRUD
    model.isSelected = true;
    model.selectedCount = model.titleCount;
    model.allowKbToAddTitles = true;

    updatePackage(model);
    updateTitles(packageId);
  };

  const toggleSelected = () => {
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
        model.visibility = [];
        model.customCoverage = {};
        model.allowKbToAddTitles = false;
      }

      updatePackage(model);
      updateTitles();
    }
  };

  const searchTitles = (_params) => {
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

    setPkgSearchParams({
      ..._params,
      count: PAGE_SIZE,
      page: _params?.page || FIRST_PAGE,
    });
  };

  const fetchPackageTitles = (page) => {
    searchTitles({ ...pkgSearchParams, page });
  };

  const handleAccordionHeaderSearchActionsToggle = (isActionsDropdownOpen) => {
    if (isActionsDropdownOpen) {
      getTags(undefined, { path: tagPaths.alreadyAddedToRecords });
    }
  };

  const fetchPackageCostPerUse = (filterData) => {
    getCostPerUse(listTypes.PACKAGES, model.id, filterData);
  };

  const fetchCostPerUsePackageTitles = (filterData) => {
    getCostPerUsePackageTitles(model.id, filterData);
  };

  const loadMoreCostPerUsePackageTitles = (filterData) => {
    fetchCostPerUsePackageTitles(filterData);
  };

  const handleEdit = () => {
    const editRouteState = {
      pathname: `/eholdings/packages/${model.id}/edit`,
      search: location.search,
      state: {
        eholdings: true,
      },
    };

    history.replace(editRouteState);
  };

  const toggleTitles = () => {
    const queryParams = transformQueryParams('titles', pkgSearchParams);

    getPackageTitles({ packageId, params: queryParams });
  };

  const renderSearchSectionFilters = (props) => {
    return (
      <TitleSearchFilters
        availableFilters={[
          titleSortFilterConfig,
          selectionStatusFilterConfig,
          publicationTypeTitlesListFilterConfig,
        ]}
        {...props}
      />
    );
  };

  return (
    <TitleManager record={model.name}>
      <View
        model={model}
        tagsModel={tagsModel}
        packageTitles={packageTitles}
        updateFolioTags={updateFolioTags}
        proxyTypes={proxyTypes}
        provider={provider}
        fetchPackageTitles={fetchPackageTitles}
        fetchPackageCostPerUse={fetchPackageCostPerUse}
        fetchCostPerUsePackageTitles={fetchCostPerUsePackageTitles}
        loadMoreCostPerUsePackageTitles={loadMoreCostPerUsePackageTitles}
        toggleSelected={toggleSelected}
        addPackageToHoldings={addPackageToHoldings}
        onEdit={handleEdit}
        accessStatusTypes={accessStatusTypes}
        costPerUse={costPerUse}
        isTitlesUpdating={isTitlesUpdating}
        pkgSearchParams={pkgSearchParams}
        onToggleTitles={toggleTitles}
        isFreshlySaved={location.state?.isFreshlySaved}
        isNewRecord={
          history.action === 'REPLACE' &&
          location.state?.isNewRecord
        }
        isDestroyed={
          history.action === 'REPLACE' &&
          location.state?.isDestroyed
        }
        renderAccordionHeaderSearch={(props) => (
          <SearchSection
            queryProp={pkgSearchParams}
            tagsModelOfAlreadyAddedTags={tagsModelOfAlreadyAddedTags}
            accessTypes={accessStatusTypes}
            searchType={listTypes.TITLES}
            onFilter={searchTitles}
            onToggleActions={handleAccordionHeaderSearchActionsToggle}
            renderFilters={renderSearchSectionFilters}
            {...props}
          />
        )}
      />
    </TitleManager>
  );
};

PackageShowRoute.propTypes = propTypes;

export default PackageShowRoute;
