import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPackage, getPackageTitles } from '../../redux/package';

import View from '../../components/package-show';

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
    getPackage: PropTypes.func.isRequired,
    getPackageTitles: PropTypes.func.isRequired
  };

  componentWillMount() {
    let { vendorId, packageId } = this.props.match.params;
    this.props.getPackage({ vendorId, packageId });
    this.props.getPackageTitles({ vendorId, packageId });
  }

  render() {
    return (
      <View
          vendorPackage={this.props.showPackage}
          packageTitles={this.props.showPackageTitles}/>
    );
  }
}

export default connect(
  ({ eholdings }) => ({
    showPackage: eholdings.package.record,
    showPackageTitles: eholdings.package.titles
  }), {
    getPackage,
    getPackageTitles
  }
)(PackageShowRoute);
