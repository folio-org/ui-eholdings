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
    }).isRequired
  };

  state = {
    customerResource: new PendingCustomerResource({
      packageId: this.props.match.params.packageId,
      titleId: this.props.match.params.titleId,
      vendorId: this.props.match.params.vendorId
    })
  };

  componentWillMount() {
    let customerResource = this.state.customerResource;
    this.loadCustomerResource(customerResource);
  }

  componentWillUnmount() {
    this.setState = ()=> {};
  }

  render() {
    return (<View customerResource={this.state.customerResource}/>);
  }

  loadCustomerResource(customerResource) {
    fetch(`/eholdings/vendors/${customerResource.vendorId}/packages/${customerResource.packageId}/titles/${customerResource.titleId}`)
      .then(res => {
        if (!res.ok) {
          return res.text().then(body => { throw { status: res.status, body }; });
        } else {
          return res.json();
        }
      })
      .then(payload => this.setState({ customerResource: customerResource.resolve(payload) }))
      .catch(error => this.setState({ customerResource: customerResource.reject(error) }));
  }
}

/*
 * These models represent possible loading states for a customer resource.
 * A request is fired off before `render()` to fetch the customer resource
 * details.  The customer resource is of type 'PendingCustomerResource' until the request
 * completes, at which point the PendingCustomerResource emits an instance of
 * 'LoadedCustomerResource' or 'ErroredCustomerResource' depending on the response.
 * The presentational component will display 'Loading...' while
 * the customer resource is pending.
*/

class CustomerResource {
  constructor(prev = {}, props = {}) {
    Object.assign(this, prev, props);
  }

  get isPending() { return false; }
  get isLoaded() { return false; }
  get isErrored() { return false; }
}

class PendingCustomerResource extends CustomerResource {
  get isPending()  { return true; }

  resolve(data) {
    return new LoadedCustomerResource(this, data);
  }

  reject(error) {
    return new ErroredCustomerResource(this, { error });
  }
}

class LoadedCustomerResource extends CustomerResource {
  get isLoaded() { return true; }
}

class ErroredCustomerResource extends CustomerResource {
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

