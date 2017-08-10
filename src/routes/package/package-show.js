import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';

import View from '../../components/package-show';

export default class PackageShowRoute extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        packageId: PropTypes.string.isRequired,
        vendorId: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  };

  state = {
    package: new PendingPackage({
      id: this.props.match.params.packageId,
      vendorId: this.props.match.params.vendorId
    })
  };

  componentWillMount() {
    let vendorPackage = this.state.package;

    fetch(`/eholdings/vendors/${vendorPackage.vendorId}/packages/${vendorPackage.id}`)
      .then(res => {
        if (!res.ok) {
          return res.text().then(body => { throw { status: res.status, body }; });
        } else {
          return res.json();
        }
      })
      .then(payload => this.setState({ package: vendorPackage.resolve(payload) }))
      .catch(error => this.setState({ package: vendorPackage.reject(error) }));
  }

  componentWillUnmount() {
    this.setState = ()=> {};
  }

  render() {
    return (<View vendorPackage={this.state.package}/>);
  }
}


class Package {
  constructor(prev = {}, props = {}) {
    Object.assign(this, prev, props);
  }

  get isPending() { return false; }
  get isLoaded() { return false; }
  get isErrored() { return false; }
}

class PendingPackage extends Package {
  get isPending()  { return true; }

  resolve(data) {
    return new LoadedPackage(this, data);
  }

  reject(error) {
    return new ErroredPackage(this, { error });
  }
}

class LoadedPackage extends Package {
  get isLoaded() { return true; }
}

class ErroredPackage extends Package {
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
