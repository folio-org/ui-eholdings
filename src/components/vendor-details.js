import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';

export default class VendorDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      vendor: null,
      vendorPackages: null,
      errors: null
    };
  }

  render () {
    let {
      vendor,
      errors
    } = this.state;

    return (
      <div data-test-eholdings-vendor-details>
        {!!errors && Array(errors).map((err, i) => (
          <p key={i} data-test-eholdings-vendor-details-error>
            {err.message}. {err.code}
          </p>
        ))}
        {vendor ? (
          <div>
            <h1 data-test-eholdings-vendor-details-name> {vendor.vendorName} </h1>
            <p data-test-eholdings-vendor-details-packages-total>
              Total Packages: {vendor.packagesTotal}
            </p>
            <p data-test-eholdings-vendor-details-packages-selected>
              Selected Packages: {vendor.packagesSelected}
            </p>
          </div>
        ) : (
          <p> Loading... </p>
        )}
      </div>
    );
  }

  componentDidMount() {
    fetch(`/eholdings/vendors/${this.props.match.params.vendorId}`).then((res) => {
      if (!res.ok) {
        res.json().then((data) => {
          this.setState({
            errors: data
          });
        });
      } else {
        res.json().then((data) => {
          this.setState({
            vendor: data
          });
        });
      }
    });

    fetch(`/eholdings/vendors/${this.props.match.params.vendorId}/packages`).then((res) => {
      if (!res.ok) {
        res.json().then((data) => {
          this.setState({
            errors: data
          });
        });
      } else {
        res.json().then((data) => {
          console.log(data);
          this.setState({
            vendorPackages: data
          });
        });
      }
    });

  }
}
