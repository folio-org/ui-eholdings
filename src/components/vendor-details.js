import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';

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

class FindVendor extends Component {
  state = {
    vendor: new PendingVendor({ id: this.props.id })
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
    return this.props.children(this.state.vendor);
  }
}


export default function VendorDetails({ match }) {
  let id = match.params.vendorId;

  return (
    <FindVendor id={id}>
      {(vendor)=> (
        <div data-test-eholdings-vendor-details>
          {vendor.isLoaded ? (
            <div>
              <h1 data-test-eholdings-vendor-details-name>
                {vendor.vendorName}
              </h1>
              <p>
                Total Packages: <span data-test-eholdings-vendor-details-packages-total>{vendor.packagesTotal}</span>
              </p>
              <p>
                Selected Packages: <span data-test-eholdings-vendor-details-packages-selected>{vendor.packagesSelected}</span>
              </p>
            </div>
          ) : vendor.isErrored ? (
            vendor.mapErrors((error, key) => (
              <p key={key} data-test-eholdings-vendor-details-error>
                {error.message}. {error.code}
              </p>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      )}
    </FindVendor>
  );
}
