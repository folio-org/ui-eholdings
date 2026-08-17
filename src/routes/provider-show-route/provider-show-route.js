import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  useHistory,
  useLocation,
  useParams,
} from 'react-router';
import queryString from 'qs';

import { TitleManager } from '@folio/stripes/core';

import View from '../../components/provider/show';
import {
  listTypes,
  accessTypesReduxStateShape,
  tagPaths,
  searchTypes,
  packageSortFilterConfig,
  selectionStatusFilterConfig,
  contentTypeFilterConfig,
  packageAccessFilterConfig,
} from '../../constants';
import { SearchSection } from '../../components/search-section';
import PackageSearchFilters from '../../components/package-search-filters';
import { useProviderPackages } from '../../hooks';

const propTypes = {
  accessTypes: accessTypesReduxStateShape.isRequired,
  getAccessTypes: PropTypes.func.isRequired,
  getProvider: PropTypes.func.isRequired,
  getProxyTypes: PropTypes.func.isRequired,
  getRootProxy: PropTypes.func.isRequired,
  getTags: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
  proxyTypes: PropTypes.object.isRequired,
  rootProxy: PropTypes.object.isRequired,
  tagsModel: PropTypes.object.isRequired,
  tagsModelOfAlreadyAddedTags: PropTypes.object,
  updateFolioTags: PropTypes.func.isRequired,
};

const ProviderShowRoute = ({
  accessTypes,
  getAccessTypes,
  getProvider,
  getProxyTypes,
  getRootProxy,
  getTags,
  model,
  proxyTypes,
  rootProxy,
  tagsModel,
  tagsModelOfAlreadyAddedTags,
  updateFolioTags,
}) => {
  const history = useHistory();
  const location = useLocation();
  const routeParams = useParams();

  const {
    filterPackages,
    sort,
    tags,
    type,
    'access-type': accessType,
    selected,
    searchfield,
  } = queryString.parse(location.search);

  const [pkgSearchParams, setPkgSearchParams] = useState({
    q: filterPackages,
    sort,
    searchfield,
    filter: {
      tags,
      type,
      selected,
      'access-type': accessType,
    },
  });

  const { providerId } = routeParams;

  const providerPackages = useProviderPackages({ providerId, searchParams: pkgSearchParams });

  useEffect(() => {
    getProvider(providerId);
    getProxyTypes();
    getRootProxy();
    getTags();
    getAccessTypes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updatePackageSearchParams = (_pkgSearchParams) => {
    const qs = queryString.parse(location.search, { ignoreQueryPrefix: true });
    const search = queryString.stringify({
      ...qs,
      filterPackages: _pkgSearchParams.q,
      sort: _pkgSearchParams.sort,
      tags: _pkgSearchParams.filter?.tags,
      type: _pkgSearchParams.filter?.type,
      'access-type': _pkgSearchParams.filter?.['access-type'],
      selected: _pkgSearchParams.filter?.selected,
      searchfield: _pkgSearchParams.searchfield,
    });

    history.replace({
      ...location,
      search,
    });

    setPkgSearchParams({
      ..._pkgSearchParams,
    });
  };

  const handleAccordionHeaderSearchActionsToggle = useCallback((isActionsDropdownOpen) => {
    if (isActionsDropdownOpen) {
      getTags(undefined, { path: tagPaths.alreadyAddedToRecords });
    }
  }, [getTags]);

  const handleEdit = () => {
    const editRouteState = {
      pathname: `/eholdings/providers/${model.id}/edit`,
      search: location.search,
      state: {
        eholdings: true,
      },
    };

    history.replace(editRouteState);
  };

  const renderSearchSectionFilters = (props) => {
    return (
      <PackageSearchFilters
        searchType={searchTypes.PACKAGES}
        availableFilters={[
          packageSortFilterConfig,
          selectionStatusFilterConfig,
          contentTypeFilterConfig,
          packageAccessFilterConfig,
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
        providerPackages={providerPackages}
        proxyTypes={proxyTypes}
        rootProxy={rootProxy}
        listType={listTypes.PACKAGES}
        updateFolioTags={updateFolioTags}
        renderAccordionHeaderSearch={(props) => (
          <SearchSection
            queryProp={pkgSearchParams}
            tagsModelOfAlreadyAddedTags={tagsModelOfAlreadyAddedTags}
            accessTypes={accessTypes}
            searchType={listTypes.PACKAGES}
            onFilter={updatePackageSearchParams}
            onToggleActions={handleAccordionHeaderSearchActionsToggle}
            renderFilters={renderSearchSectionFilters}
            {...props}
          />
        )}
        onEdit={handleEdit}
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
};

ProviderShowRoute.propTypes = propTypes;

export default ProviderShowRoute;
