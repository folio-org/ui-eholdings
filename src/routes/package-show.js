import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TitleManager from '@folio/stripes-core/src/components/TitleManager';

import { createResolver } from '../redux';
import Package from '../redux/package';
import Resource from '../redux/resource';

import View from '../components/package/show';
import SearchModal from '../components/search-modal';

// TODO this is out of place.
function transformTitleQueryParams(params) {
  let { q, searchfield = 'name', filter = {}, ...searchParams } = params;

  if (searchfield === 'title') { searchfield = 'name'; }

  let searchfilter = { ...filter, [searchfield]: q };

  return { ...searchParams, filter: searchfilter };
}

class PackageShowRoute extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        packageId: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    model: PropTypes.object.isRequired,
    getPackage: PropTypes.func.isRequired,
    getPackageTitles: PropTypes.func.isRequired,
    unloadResources: PropTypes.func.isRequired,
    updatePackage: PropTypes.func.isRequired,
    destroyPackage: PropTypes.func.isRequired,
  };

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        replace: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };

  constructor(props) {
    super(props);
    let { packageId } = props.match.params;
    props.getPackage(packageId);
  }

  state = {
    page: 0,
    queryId: 0,
    pkgSearchParams: {}
  }

  componentDidUpdate(prevProps, prevState) {
    let { model: next, match, getPackage, unloadResources } = this.props;
    let { model: old, match: oldMatch } = prevProps;
    let { packageId } = match.params;

    if (!prevProps.model.destroy.isResolved && this.props.model.destroy.isResolved) {
      // if package was reached based on search
      if (this.context.router.history.location.search) {
        this.context.router.history.replace({
          pathname: '/eholdings',
          search: this.context.router.history.location.search
        }, { eholdings: true });
        // package was reached directly from url not by search
      } else {
        this.context.router.history.replace('/eholdings?searchType=packages', { eholdings: true });
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
    let params = transformTitleQueryParams({ ...pkgSearchParams });

    getPackageTitles(packageId, { ...params, page });
  }

  setPage = (page) => {
    this.setState({ page, queryId: ++this.state.queryId }, () => {
      this.fetchPackageTitles();
    });
  };

  searchTitles = (pkgSearchParams) => {
    this.setState({
      pkgSearchParams,
      queryId: ++this.state.queryId
    }, () => {
      this.fetchPackageTitles();
    });
  }

  render() {
    let { pkgSearchParams, queryId } = this.state;

    return (
      <TitleManager record={this.props.model.name}>
        <View
          model={this.props.model}
          fetchPackageTitles={this.setPage}
          toggleSelected={this.toggleSelected}
          addPackageToHoldings={this.addPackageToHoldings}
          toggleHidden={this.toggleHidden}
          customCoverageSubmitted={this.customCoverageSubmitted}
          toggleAllowKbToAddTitles={this.toggleAllowKbToAddTitles}
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
  ({ eholdings: { data } }, { match }) => ({
    model: createResolver(data).find('packages', match.params.packageId),
  }), {
    getPackage: id => Package.find(id),
    getPackageTitles: (id, params) => Package.queryRelated(id, 'resources', params),
    unloadResources: collection => Resource.unload(collection),
    updatePackage: model => Package.save(model),
    destroyPackage: model => Package.destroy(model)
  }
)(PackageShowRoute);
