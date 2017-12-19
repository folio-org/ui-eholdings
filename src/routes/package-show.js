import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import { createResolver } from '../redux';
import Package from '../redux/package';

import View from '../components/package-show';

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
    updatePackage: PropTypes.func.isRequired
  };

  componentWillMount() {
    let { packageId } = this.props.match.params;
    this.props.getPackage(packageId);
  }

  componentWillReceiveProps(nextProps) {
    let { model: next, match, getPackage, getPackageTitles } = nextProps;
    let { model: old, match: oldMatch } = this.props;
    let { packageId } = match.params;

    if (packageId !== oldMatch.params.packageId) {
      getPackage(packageId);

    // if the toggle request just resolved (and wasn't previously), reload the package titles
    } else if (next.update.isResolved && old.update.isPending) {
      getPackageTitles(packageId);
    }
  }

  toggleSelected = () => {
    let { model, updatePackage } = this.props;
    model.isSelected = !model.isSelected;
    model.selectedCount = model.isSelected ? model.titleCount : 0;

    // clear out any customizations before sending to server
    if (!model.isSelected) {
      model.visibilityData.isHidden = false;
      model.customCoverage.beginCoverage = null;
      model.customCoverage.endCoverage = null;
    }

    updatePackage(model);
  };

  customCoverageSubmitted = (values) => {
    let { model, updatePackage } = this.props;
    model.customCoverage.beginCoverage = !values.beginCoverage ? null : moment(values.beginCoverage).format('YYYY-MM-DD');
    model.customCoverage.endCoverage = !values.endCoverage ? null : moment(values.endCoverage).format('YYYY-MM-DD');
    updatePackage(model);
  }

  render() {
    return (
      <View
        model={this.props.model}
        toggleSelected={this.toggleSelected}
        customCoverageSubmitted={this.customCoverageSubmitted}
      />
    );
  }
}

export default connect(
  ({ eholdings: { data } }, { match }) => ({
    model: createResolver(data).find('packages', match.params.packageId)
  }), {
    getPackage: id => Package.find(id, { include: 'customerResources' }),
    getPackageTitles: id => Package.queryRelated(id, 'customerResources'),
    updatePackage: model => Package.save(model)
  }
)(PackageShowRoute);
