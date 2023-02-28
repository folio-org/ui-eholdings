import { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { TitleManager } from '@folio/stripes/core';

import isEqual from 'lodash/isEqual';
import reduce from 'lodash/reduce';

import queryString from 'qs';

import View from '../../components/provider/show';
import SearchModal from '../../components/search-modal';
import {
  listTypes,
  accessTypesReduxStateShape,
  PAGE_SIZE,
  FIRST_PAGE,
  tagPaths,
} from '../../constants';

class ProviderShowRoute extends Component {
  static propTypes = {
    accessTypes: accessTypesReduxStateShape.isRequired,
    clearProviderPackages: PropTypes.func.isRequired,
    getAccessTypes: PropTypes.func.isRequired,
    getProvider: PropTypes.func.isRequired,
    getProviderPackages: PropTypes.func.isRequired,
    getProxyTypes: PropTypes.func.isRequired,
    getRootProxy: PropTypes.func.isRequired,
    getTags: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    model: PropTypes.object.isRequired,
    providerPackages: PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.shape({
        attributes: PropTypes.object.isRequired,
        id: PropTypes.string.isRequired,
        relationships: PropTypes.object,
        type: PropTypes.string,
      })).isRequired,
      totalResults: PropTypes.number.isRequired,
    }).isRequired,
    proxyTypes: PropTypes.object.isRequired,
    rootProxy: PropTypes.object.isRequired,
    tagsModel: PropTypes.object.isRequired,
    tagsModelOfAlreadyAddedTags: PropTypes.object,
    updateFolioTags: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const {
      filterPackages,
      sort,
      tags,
      type,
      'access-type': accessType,
      selected,
      searchfield,
    } = queryString.parse(props.location.search);

    this.state = {
      pkgSearchParams: {
        q: filterPackages,
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
    };
    const { providerId } = props.match.params;
    props.getProvider(providerId);
    props.getProxyTypes();
    props.getRootProxy();
    props.getTags();
    props.getAccessTypes();
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      match,
      getProviderPackages,
      getProvider,
    } = this.props;
    const { pkgSearchParams } = this.state;
    const { providerId } = match.params;

    if (providerId !== prevProps.match.params.providerId) {
      getProvider(providerId);
    }

    if (pkgSearchParams !== prevState.pkgSearchParams) {
      getProviderPackages({
        providerId,
        params: pkgSearchParams,
      });
    }
  }

  searchPackages = (pkgSearchParams) => {
    const {
      location,
      history,
      clearProviderPackages,
    } = this.props;

    const paramDifference = reduce(pkgSearchParams, (result, item, key) => {
      return isEqual(item, this.state.pkgSearchParams[key]) ? result : result.concat(key);
    }, []);

    if (paramDifference.length !== 1 && paramDifference[0] !== 'page') {
      clearProviderPackages();
    }

    const qs = queryString.parse(location.search, { ignoreQueryPrefix: true });
    const search = queryString.stringify({
      ...qs,
      filterPackages: pkgSearchParams.q,
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
  }

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
      },
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
      tagsModelOfAlreadyAddedTags,
      updateFolioTags,
      accessTypes,
      providerPackages,
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
          providerPackages={providerPackages}
          fetchPackages={this.fetchPackages}
          proxyTypes={proxyTypes}
          rootProxy={rootProxy}
          listType={listTypes.PACKAGES}
          updateFolioTags={updateFolioTags}
          searchModal={
            <SearchModal
              tagsModelOfAlreadyAddedTags={tagsModelOfAlreadyAddedTags}
              key={queryId}
              listType={listTypes.PACKAGES}
              query={pkgSearchParams}
              onSearch={this.searchPackages}
              onToggle={this.toggleSearchModal}
              onFilter={this.searchPackages}
              accessTypes={accessTypes}
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

export default ProviderShowRoute;
