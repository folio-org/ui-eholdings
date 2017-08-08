import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';

import View from '../../components/vendor-show';

class Vendor {
  constructor(prev = {}, props = {}) {
    Object.assign(this, prev, props);
  }
  get isRequested() { return false; }
  get isLoading() { return false; }
  get isLoaded() { return false; }
  get isErrored() { return false; }
  get isPending() { return !this.isRequested || this.isLoading; }

}

class PendingVendor extends Vendor {
  get isRequested()  { return true; }
  get isPending() { return true; }

  resolve(data) {
    return new LoadedVendor(this, data);
  }

  reject(error) {
    return new ErroredVendor(this, { error });
  }
}

class LoadedVendor extends Vendor {
  get isRequested() { return true; }
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
    })
  };

  componentWillMount() {
    let vendor = this.state.vendor;

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

  componentWillUnmount() {
    this.setState = ()=> {};
  }

  render() {
    return (<View vendor={this.state.vendor}/>);
  }
}
