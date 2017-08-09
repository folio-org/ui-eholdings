import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';

import View from '../../components/vendor-show';

export default class VendorShowRoute extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        vendorId: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  };

  state = {
    vendor: new PendingVendor({
      id: this.props.match.params.vendorId
    }),
    vendorPackages: new PendingVendorPackages()
  };

  componentWillMount() {
    let vendor = this.state.vendor;
    this.loadVendor(vendor);
    this.loadVendorPackages(vendor);
  }

  componentWillUnmount() {
    this.setState = ()=> {};
  }

  render() {
    return (<View
      vendor={this.state.vendor}
      vendorPackages={this.state.vendorPackages}/>);
  }

  loadVendor(vendor) {
    fetch(`/eholdings/vendors/${vendor.id}`)
      .then(res => {
        if (!res.ok) {
          return res.text().then(body => { throw { status: res.status, body }; });
        } else {
          return res.json();
        }
      })
      .then(payload => this.setState({ vendor: vendor.resolve(payload) }))
      .catch(error => this.setState({ vendor: vendor.reject(error) }));
  }

  loadVendorPackages(vendor) {
    let vendorPackages = this.state.vendorPackages;

    fetch(`/eholdings/vendors/${vendor.id}/packages`)
      .then(res => {
        if (!res.ok) {
          return res.text().then(body => { throw { status: res.status, body }; });
        } else {
          return res.json();
        }
      })
      .then(payload => this.setState({ vendorPackages: vendorPackages.resolve(payload) }))
      .catch(error => this.setState({ vendorPackages: vendorPackages.reject(error) }));
  }
}

/*
 * These models represent possible loading states for a vendor.
 * A request is fired off before `render()` to fetch the vendor
 * details.  The vendor is of type 'PendingVendor' until the request
 * completes, at which point the PendingVendor emits an instance of
 * 'LoadedVendor' or 'Erroredvendor' depending on the response.
 * The presentational component will display 'Loading...' while
 * the vendor is pending.
*/

class Vendor {
  constructor(prev = {}, props = {}) {
    Object.assign(this, prev, props);
  }

  get isPending() { return false; }
  get isLoaded() { return false; }
  get isErrored() { return false; }
}

class PendingVendor extends Vendor {
  get isPending()  { return true; }

  resolve(data) {
    return new LoadedVendor(this, data);
  }

  reject(error) {
    return new ErroredVendor(this, { error });
  }
}

class LoadedVendor extends Vendor {
  get isLoaded() { return true; }
}

class ErroredVendor extends Vendor {
  get isErrored() { return true; }

  mapErrors(...args) {
    try {
      return JSON.parse(this.error.body).map(...args);
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}


class VendorPackages {
  constructor(prev = {}, props = {}) {
    Object.assign(this, {
      packageList: []
    }, prev, props);
  }

  get isPending() { return false; }
  get isLoaded() { return false; }
  get isErrored() { return false; }
}

class PendingVendorPackages extends VendorPackages {
  get isPending()  { return true; }

  resolve(data) {
    return new LoadedVendorPackages(this, data);
  }

  reject(error) {
    return new ErroredVendorPackages(this, { error });
  }
}

class LoadedVendorPackages extends VendorPackages {
  get isLoaded() { return true; }

  mapPackages(...args) {
    return this.packageList.map(...args);
  }
}

class ErroredVendorPackages extends VendorPackages {
  get isErrored() { return true; }

  mapErrors(...args) {
    try {
      return JSON.parse(this.error.body).map(...args);
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}
