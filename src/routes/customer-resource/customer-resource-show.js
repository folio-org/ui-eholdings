import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';

import View from '../../components/customer-resource-show';

export default class CustomerResourceShowRoute extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        packageId: PropTypes.string.isRequired,
        titleId: PropTypes.string.isRequired,
        vendorId: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    resources: PropTypes.shape({
      showCustomerResource: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object)
      })
    })
  };

  static manifest = Object.freeze({
    showCustomerResource: {
      type: 'okapi',
      path: 'eholdings/vendors/:{vendorId}/packages/:{packageId}/titles/:{titleId}',
      pk: 'titleId'
    }
  });

  render() {
    return (
      <View customerResource={this.getCustomerResource()}/>
    );
  }

  getCustomerResource() {
    const {
      resources: { showCustomerResource },
      match: { params: { vendorId, packageId, titleId } }
    } = this.props;

    if (!showCustomerResource) {
      return null;
    }

    return showCustomerResource.records.find((title) => {
      return title.titleId == titleId && title.customerResourcesList.some((pkgTitle) => {
        return pkgTitle.packageId == packageId && pkgTitle.vendorId == vendorId;
      });
    });
  }
}
