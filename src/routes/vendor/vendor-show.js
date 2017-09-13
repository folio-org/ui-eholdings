import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getVendor, getVendorPackages } from '../../redux/vendor';

import View from '../../components/vendor-show';

class VendorShowRoute extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        vendorId: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    vendor: PropTypes.object.isRequired,
    vendorPackages: PropTypes.object.isRequired,
    getVendor: PropTypes.func.isRequired,
    getVendorPackages: PropTypes.func.isRequired
  };

  componentWillMount() {
    let { vendorId } = this.props.match.params;
    this.props.getVendor({ vendorId });
    this.props.getVendorPackages({ vendorId });
  }

  render() {
    return (
      <View
          vendor={this.props.vendor}
          vendorPackages={this.props.vendorPackages}/>
    );
  }
}

export default connect(
  ({ eholdings: { vendor }}) => ({
    vendor: vendor.record,
    vendorPackages: vendor.packages
  }), {
    getVendor,
    getVendorPackages
  }
)(VendorShowRoute);
