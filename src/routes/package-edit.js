import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import { createResolver } from '../redux';
import Package from '../redux/package';
import Resource from '../redux/resource';

import View from '../components/package/edit';

class PackageEditRoute extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        packageId: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    model: PropTypes.object.isRequired,
    getPackage: PropTypes.func.isRequired,
    unloadResources: PropTypes.func.isRequired,
    updatePackage: PropTypes.func.isRequired
  };

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

  packageEditSubmitted = (values) => {
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

    if ('isSelected' in values) {
      model.isSelected = values.isSelected;
    }

    if ('name' in values) {
      model.name = values.name;
    }

    if ('contentType' in values) {
      model.contentType = values.contentType;
    }

    updatePackage(model);
  };

  render() {
    let { model } = this.props;
    let initialValues = {};
    let View;

    if (model.isCustom) {
      View = CustomPackageEdit;
      initialValues = {
        name: model.name,
        contentType: model.contentType,
        isSelected: model.isSelected,
        customCoverages: [{
          beginCoverage: model.customCoverage.beginCoverage,
          endCoverage: model.customCoverage.endCoverage
        }]
      };
    } else {
      View = ManagedPackageEdit;
      initialValues = {
        customCoverages: [{
          beginCoverage: model.customCoverage.beginCoverage,
          endCoverage: model.customCoverage.endCoverage
        }]
      };
    }

    return (
      <View
        model={model}
        onSubmit={this.packageEditSubmitted}
        initialValues={{
          name: model.name,
          contentType: model.contentType,
          customCoverages: [{
            beginCoverage: model.customCoverage.beginCoverage,
            endCoverage: model.customCoverage.endCoverage
          }]
        }}
      />
    );
  }
}

export default connect(
  ({ eholdings: { data } }, { match }) => ({
    model: createResolver(data).find('packages', match.params.packageId)
  }), {
    getPackage: id => Package.find(id),
    unloadResources: collection => Resource.unload(collection),
    updatePackage: model => Package.save(model)
  }
)(PackageEditRoute);
