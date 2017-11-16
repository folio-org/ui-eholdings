import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Resolver from '../redux/resolver';
import Vendor from '../redux/vendor';

import View from '../components/vendor-show';

class VendorShowRoute extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        vendorId: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    model: PropTypes.object.isRequired,
    getVendor: PropTypes.func.isRequired
  };

  componentWillMount() {
    let { vendorId } = this.props.match.params;
    this.props.getVendor(vendorId);
  }

  componentWillReceiveProps({ match: { params: { vendorId } } }) {
    if (vendorId !== this.props.match.params.vendorId) {
      this.props.getVendor(vendorId);
    }
  }

  render() {
    return (
      <View
        model={this.props.model}
      />
    );
  }
}

export default connect(
  ({ eholdings: { data } }, { match }) => ({
    model: new Resolver(data).find('vendors', match.params.vendorId)
  }), {
    getVendor: id => Vendor.find(id, { include: 'packages' })
  }
)(VendorShowRoute);
