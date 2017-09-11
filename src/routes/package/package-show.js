import React, { Component } from 'react';
import PropTypes from 'prop-types';

import View from '../../components/package-show';

export default class PackageShowRoute extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        packageId: PropTypes.string.isRequired,
        vendorId: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    resources: PropTypes.shape({
      showPackage: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object)
      }),
      showPackageTitles: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object)
      })
    })
  };

  static manifest = Object.freeze({
    showPackage: {
      type: 'okapi',
      path: 'eholdings/vendors/:{vendorId}/packages/:{packageId}',
      pk: 'packageId'
    },
    showPackageTitles: {
      type: 'okapi',
      path: 'eholdings/vendors/:{vendorId}/packages/:{packageId}/titles?search=%00&searchfield=titlename&offset=1&count=25&orderby=relevance',
      records: 'titles',
      pk: 'titleId'
    }
  });

  render() {
    return (
      <View
          vendorPackage={this.getPackage()}
          packageTitles={this.getPackageTitles()}/>
    );
  }

  getPackage() {
    const {
      resources: { showPackage },
      match: { params: { vendorId, packageId } }
    } = this.props;

    if (!showPackage) {
      return null;
    }

    return showPackage.records.find((pkg) => {
      return pkg.packageId == packageId && pkg.vendorId == vendorId;
    });
  }

  getPackageTitles() {
    const {
      resources: { showPackageTitles },
      match: { params: { packageId } }
    } = this.props;

    if (!showPackageTitles) {
      return null;
    }

    return showPackageTitles.records.filter((title) => {
      return title.customerResourcesList.some((pkgTitle) => {
        return pkgTitle.packageId == packageId;
      });
    });
  }
}
