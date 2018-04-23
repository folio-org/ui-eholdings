import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import { createResolver } from '../redux';
import Package from '../redux/package';
import Resource from '../redux/resource';

import View from '../components/package/show';

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
    resolver: PropTypes.object.isRequired,
  };

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        replace: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };

  state = {
    titleSearchParams: {}
  }

  componentWillMount() {
    let { packageId } = this.props.match.params;
    this.props.getPackage(packageId);
  }

  componentWillReceiveProps(nextProps) {
    let { model: next, match, getPackage, unloadResources } = nextProps;
    let { model: old, match: oldMatch } = this.props;
    let { packageId } = match.params;

    if (packageId !== oldMatch.params.packageId) {
      getPackage(packageId);

    // if an update just resolved, unfetch the package titles
    } else if (next.update.isResolved && old.update.isPending) {
      unloadResources(next.resources);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let { match, getPackageTitles } = this.props;
    let { titleSearchParams } = this.state;
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

    if (titleSearchParams !== prevState.titleSearchParams) {
      getPackageTitles(packageId, titleSearchParams);
    }
  }

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

  toggleHidden = () => {
    let { model, updatePackage } = this.props;
    model.visibilityData.isHidden = !model.visibilityData.isHidden;
    updatePackage(model);
  };

  fetchPackageTitles = (page) => {
    let { match, getPackageTitles } = this.props;
    let { packageId } = match.params;

    getPackageTitles(packageId, { page });
  };

  customCoverageSubmitted = (values) => {
    let { model, updatePackage } = this.props;
    let beginCoverage = '';
    let endCoverage = '';

    if (values.customCoverages[0]) {
      beginCoverage = !values.customCoverages[0].beginCoverage ? '' : moment(values.customCoverages[0].beginCoverage).format('YYYY-MM-DD');
      endCoverage = !values.customCoverages[0].endCoverage ? '' : moment(values.customCoverages[0].endCoverage).format('YYYY-MM-DD');
    }

    model.customCoverage = {
      beginCoverage,
      endCoverage
    };
    updatePackage(model);
  };

  packageContentTypeSubmitted = (values) => {
    let { model, updatePackage } = this.props;
    model.contentType = values.contentType;
    updatePackage(model);
  }

  toggleAllowKbToAddTitles = () => {
    let { model, updatePackage } = this.props;
    model.allowKbToAddTitles = !model.allowKbToAddTitles;
    updatePackage(model);
  };

  getTitleResults() {
    let { match, resolver } = this.props;
    let { titleSearchParams } = this.state;
    let { packageId } = match.params;

    return resolver.query('resources', titleSearchParams, {
      path: `${Package.pathFor(packageId)}/resources`
    });
  }

  searchTitles = (params) => {
    this.setState({ titleSearchParams: params });
  };

  render() {
    return (
      <View
        model={this.props.model}
        fetchPackageTitles={this.fetchPackageTitles}
        toggleSelected={this.toggleSelected}
        toggleHidden={this.toggleHidden}
        customCoverageSubmitted={this.customCoverageSubmitted}
        toggleAllowKbToAddTitles={this.toggleAllowKbToAddTitles}
        packageContentTypeSubmitted={this.packageContentTypeSubmitted}
        searchTitles={this.searchTitles}
        searchParams={this.state.titleSearchParams}
        titles={this.getTitleResults()}
      />
    );
  }
}

export default connect(
  ({ eholdings: { data } }, { match }) => {
    let resolver = createResolver(data);

    return {
      model: resolver.find('packages', match.params.packageId),
      resolver
    };
  }, {
    getPackage: id => Package.find(id),
    getPackageTitles: (id, params) => Package.queryRelated(id, 'resources', params),
    unloadResources: collection => Resource.unload(collection),
    updatePackage: model => Package.save(model),
    destroyPackage: model => Package.destroy(model)
  }
)(PackageShowRoute);
