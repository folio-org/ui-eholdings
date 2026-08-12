import {
  useCallback,
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
  usePackage,
  usePackageDelete,
  usePackageUpdate,
  useProvider,
} from '../../hooks';
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
  getAccessTypes: PropTypes.func.isRequired,
  getCostPerUse: PropTypes.func.isRequired,
  getCostPerUsePackageTitles: PropTypes.func.isRequired,
  getPackageTitles: PropTypes.func.isRequired,
  getProxyTypes: PropTypes.func.isRequired,
  getTags: PropTypes.func.isRequired,
  packageTitles: PropTypes.shape({
    items: PropTypes.array.isRequired,
    totalResults: PropTypes.number.isRequired,
  }).isRequired,
  proxyTypes: PropTypes.object.isRequired,
  tagsModel: PropTypes.object.isRequired,
  tagsModelOfAlreadyAddedTags: PropTypes.object,
  updateFolioTags: PropTypes.func.isRequired,
};

const PackageShowRoute = ({
  accessStatusTypes,
  clearCostPerUseData,
  costPerUse,
  getAccessTypes,
  getCostPerUse,
  getCostPerUsePackageTitles,
  getPackageTitles,
  getProxyTypes,
  getTags,
  packageTitles,
  proxyTypes,
  tagsModel,
  tagsModelOfAlreadyAddedTags,
  updateFolioTags,
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

  const onPackageDeleteSuccess = useCallback(() => {
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
  }, [history, location.search]);

  const { data: provider } = useProvider({ providerId });
  const {
    data: model,
    isLoading: isPackageLoading,
    isLoaded: isPackageLoaded,
  } = usePackage({ packageId });
  const { deletePackage } = usePackageDelete({ onSuccess: onPackageDeleteSuccess });
  const { updatePackage } = usePackageUpdate({ packageId, onSuccess: () => {} });

  const getUpdatedTitles = () => {
    const queryParams = transformQueryParams('titles', pkgSearchParams);

    setIsTitlesUpdating(true);

    getPackageTitles({ packageId, params: queryParams });
  };

  useEffect(() => {
    getProxyTypes();
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
    const updatedModel = {
      ...model,
      isSelected: true,
      selectedCount: model.titleCount,
      allowKbToAddTitles: true,
    };

    updatePackage(updatedModel);
    updateTitles(packageId);
  };

  const toggleSelected = () => {
    const updatedModel = { ...model };
    // if the package is custom setting the holding status to false
    // or deselecting the package will delete the package from holdings
    if (model.isCustom && !model.isSelected === false) {
      deletePackage(model);
    } else {
      updatedModel.isSelected = !model.isSelected;
      updatedModel.selectedCount = model.isSelected ? model.titleCount : 0;

      // If package is selected, allowKbToAddTitles should be true
      if (updatedModel.isSelected) {
        updatedModel.allowKbToAddTitles = true;
      }
      // clear out any customizations before sending to server
      if (!updatedModel.isSelected) {
        updatedModel.customCoverage = {};
        updatedModel.allowKbToAddTitles = false;
      }

      updatePackage(updatedModel);
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
        isLoading={isPackageLoading}
        isLoaded={isPackageLoaded}
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
