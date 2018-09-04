import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import TitleManager from '@folio/stripes-core/src/components/TitleManager';

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

  componentDidUpdate(prevProps) {
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

  packageEditSubmitted = (values) => {
    let { model, updatePackage, destroyPackage } = this.props;

    // if the package is custom setting the holding status to false
    // or deselecting the package will delete the package from holdings
    if (model.isCustom && values.isSelected === false) {
      destroyPackage(model);
    } else if (values.isSelected === false) {
      // When de-selecting a managed package
      // need to clear out customizations before sending to server
      model.isSelected = false;
      model.visibilityData.isHidden = false;
      model.customCoverage = {};
      model.allowKbToAddTitles = false;
      updatePackage(model);
    } else if (values.isSelected && !values.customCoverages) {
      model.isSelected = true;
      model.allowKbToAddTitles = true;
      updatePackage(model);
    } else {
      let beginCoverage = '';
      let endCoverage = '';

      if (values.customCoverages[0]) {
        beginCoverage = !values.customCoverages[0].beginCoverage ? '' : moment(values.customCoverages[0].beginCoverage).tz('UTC').format('YYYY-MM-DD');
        endCoverage = !values.customCoverages[0].endCoverage ? '' : moment(values.customCoverages[0].endCoverage).tz('UTC').format('YYYY-MM-DD');
      }

      model.customCoverage = {
        beginCoverage,
        endCoverage
      };

      if ('isSelected' in values) {
        model.isSelected = values.isSelected;
      }

      if ('isVisible' in values) {
        model.visibilityData.isHidden = !(values.isVisible === 'true'); // turn string into boolean
      }

      if ('allowKbToAddTitles' in values) {
        model.allowKbToAddTitles = values.allowKbToAddTitles === 'true'; // turn string into boolean
      }

      if ('name' in values) {
        model.name = values.name;
      }

      if ('contentType' in values) {
        model.contentType = values.contentType;
      }

      updatePackage(model);
    }
  };

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

  render() {
    let { model } = this.props;

    return (
      <TitleManager record={`Edit ${this.props.model.name}`}>
        <View
          model={model}
          onSubmit={this.packageEditSubmitted}
          addPackageToHoldings={this.addPackageToHoldings}
        />
      </TitleManager>
    );
  }
}

export default connect(
  ({ eholdings: { data } }, { match }) => ({
    model: createResolver(data).find('packages', match.params.packageId)
  }), {
    getPackage: id => Package.find(id),
    unloadResources: collection => Resource.unload(collection),
    updatePackage: model => Package.save(model),
    destroyPackage: model => Package.destroy(model)
  }
)(PackageEditRoute);
