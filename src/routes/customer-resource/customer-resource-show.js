import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCustomerResource, toggleIsSelected } from '../../redux/customer-resource';

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
    customerResource: PropTypes.object.isRequired,
    toggleRequest: PropTypes.object.isRequired,
    getCustomerResource: PropTypes.func.isRequired,
    toggleIsSelected: PropTypes.func.isRequired
  };

  componentWillMount() {
    let { vendorId, packageId, titleId } = this.props.match.params;
    this.props.getCustomerResource({ vendorId, packageId, titleId });
  }

  toggleSelected = () => {
    let { vendorId, packageId, titleId } = this.props.match.params;
    let { isSelected } = this.props.customerResource.content;

    this.props.toggleIsSelected({
      vendorId, packageId, titleId,
      isSelected: !isSelected
    });
  };

  render() {
    return (
      <View
        customerResource={this.props.customerResource}
        toggleRequest={this.props.toggleRequest}
        toggleSelected={this.toggleSelected}
      />
    );
  }
}

export default connect(
  ({ eholdings: { customerResource }}) => ({
    customerResource: customerResource.record,
    toggleRequest: customerResource.toggle
  }), {
    getCustomerResource,
    toggleIsSelected
  }
)(CustomerResourceShowRoute);
