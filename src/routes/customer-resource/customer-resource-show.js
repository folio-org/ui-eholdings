import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import { requestResource, toggleSelected } from '../../redux/customer-resource';

import View from '../../components/customer-resource-show';

class CustomerResourceShowRoute extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        packageId: PropTypes.string.isRequired,
        titleId: PropTypes.string.isRequired,
        vendorId: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    model: PropTypes.object.isRequired
  };

  componentWillMount() {
    let { vendorId, packageId, titleId } = this.props.match.params;
    this.props.requestResource(vendorId, packageId, titleId);
  }

  render() {
    return (
      <View
        model={this.props.model}
        toggleSelected={this.props.toggleSelected}
      />
    );
  }
}

export default connect(
  ({ eholdings: { customerResource }}) => ({
    model: customerResource
  }), {
    requestResource,
    toggleSelected
  }
)(CustomerResourceShowRoute);
