import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getPackage,
  getPackageTitles,
  toggleIsSelected
} from '../redux/package';

import View from '../components/package-show';

class PackageShowRoute extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        packageId: PropTypes.string.isRequired,
        vendorId: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    showPackage: PropTypes.object.isRequired,
    showPackageTitles: PropTypes.object.isRequired,
    toggleRequest: PropTypes.object.isRequired,
    getPackage: PropTypes.func.isRequired,
    getPackageTitles: PropTypes.func.isRequired,
    toggleIsSelected: PropTypes.func.isRequired
  };

  componentWillMount() {
    let { vendorId, packageId } = this.props.match.params;
    this.props.getPackage({ vendorId, packageId });
    this.props.getPackageTitles({ vendorId, packageId });
  }

  componentWillReceiveProps(nextProps) {
    let {
      toggleRequest,
      match: { params: { vendorId, packageId } }
    } = nextProps;

    if (vendorId !== this.props.match.params.vendorId ||
       packageId !== this.props.match.params.packageId) {
      this.props.getPackage({ vendorId, packageId });
      this.props.getPackageTitles({ vendorId, packageId });

    // if the toggle request just resolved (and wasn't previously), reload the package titles
    } else if (toggleRequest.isResolved && !this.props.toggleRequest.isResolved) {
      this.props.getPackageTitles({ vendorId, packageId });
    }
  }

  toggleSelected = () => {
    let { vendorId, packageId } = this.props.match.params;
    let { isSelected } = this.props.showPackage.content;

    this.props.toggleIsSelected({
      vendorId,
      packageId,
      isSelected: !isSelected
    });
  };

  render() {
    return (
      <View
        vendorPackage={this.props.showPackage}
        packageTitles={this.props.showPackageTitles}
        toggleRequest={this.props.toggleRequest}
        toggleSelected={this.toggleSelected}
      />
    );
  }
}

export default connect(
  ({ eholdings }) => ({
    showPackage: eholdings.package.record,
    showPackageTitles: eholdings.package.titles,
    toggleRequest: eholdings.package.toggle
  }), {
    getPackage,
    getPackageTitles,
    toggleIsSelected
  }
)(PackageShowRoute);
