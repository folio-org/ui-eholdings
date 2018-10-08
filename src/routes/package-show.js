import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { TitleManager } from '@folio/stripes/core';

import { createResolver } from '../redux';
import { ProxyType } from '../redux/application';
import Package from '../redux/package';
import Provider from '../redux/provider';
import Resource from '../redux/resource';
import { transformQueryParams } from '../components/utilities';

import View from '../components/package/show';
import SearchModal from '../components/search-modal';

class PackageShowRoute extends Component {
  static propTypes = {
    destroyPackage: PropTypes.func.isRequired,
    getPackage: PropTypes.func.isRequired,
    getPackageTitles: PropTypes.func.isRequired,
    getProvider: PropTypes.func.isRequired,
    getProxyTypes: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    model: PropTypes.object.isRequired,
    provider: PropTypes.object.isRequired,
    proxyTypes: PropTypes.object.isRequired,
    unloadResources: PropTypes.func.isRequired,
    updatePackage: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    let { packageId } = props.match.params;
    let [providerId] = packageId.split('-');
    props.getPackage(packageId);
    props.getProxyTypes();
    props.getProvider(providerId);
  }

  state = {
    page: 0,
    queryId: 0,
    pkgSearchParams: {}
  }

  componentDidUpdate(prevProps) {
    let { model: next, match, getPackage, unloadResources, history, location } = this.props;
    let { model: old, match: oldMatch } = prevProps;
    let { packageId } = match.params;

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

  fetchPackageTitles = () => {
    let { getPackageTitles, match } = this.props;
    let { pkgSearchParams, page } = this.state;
    let { packageId } = match.params;
    let params = transformQueryParams('titles', { ...pkgSearchParams });

    getPackageTitles(packageId, { ...params, page });
  }

  setPage = (page) => {
    this.setState(({ queryId }) => ({
      page,
      queryId: queryId + 1
    }), () => {
      this.fetchPackageTitles();
    });
  };

  searchTitles = (pkgSearchParams) => {
    this.setState(({ queryId }) => ({
      pkgSearchParams,
      queryId: queryId + 1
    }), () => {
      this.fetchPackageTitles();
    });
  }

  render() {
    let { history, location, model, provider, proxyTypes } = this.props;
    let { pkgSearchParams, queryId } = this.state;

    return (
      <TitleManager record={model.name}>
        <View
          model={model}
          proxyTypes={proxyTypes}
          provider={provider}
          fetchPackageTitles={this.setPage}
          toggleSelected={this.toggleSelected}
          addPackageToHoldings={this.addPackageToHoldings}
          toggleHidden={this.toggleHidden}
          customCoverageSubmitted={this.customCoverageSubmitted}
          toggleAllowKbToAddTitles={this.toggleAllowKbToAddTitles}
          editLink={{
            pathname: `/eholdings/packages/${model.id}/edit`,
            search: location.search,
            state: { eholdings: true }
          }}
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
              listType='titles'
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
  ({ eholdings: { data } }, { match }) => {
    let resolver = createResolver(data);
    let model = resolver.find('packages', match.params.packageId);
    return {
      model,
      proxyTypes: resolver.query('proxyTypes'),
      provider: resolver.find('providers', model.providerId),
      resolver
    };
  }, {
    getPackage: id => Package.find(id),
    getPackageTitles: (id, params) => Package.queryRelated(id, 'resources', params),
    getProxyTypes: () => ProxyType.query(),
    getProvider: id => Provider.find(id),
    unloadResources: collection => Resource.unload(collection),
    updatePackage: model => Package.save(model),
    destroyPackage: model => Package.destroy(model)
  }
)(PackageShowRoute);
