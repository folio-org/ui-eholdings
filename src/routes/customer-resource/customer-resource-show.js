import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from './action-creators';
import customerResourceReducer from './reducers';

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
    customerResource: PropTypes.object
  };

  static contextTypes = {
    addReducer: PropTypes.func.isRequired,
    store: PropTypes.object
  }

  componentWillMount() {
    // Add reducers
    this.context.addReducer('customerResource', customerResourceReducer);

    // TODO: this might be able to go somewhere else.  like
    // what if we put vendorId, etc. on the state where the
    // actionCreators can get at it?  something...
    const {
      match: { params: { vendorId, packageId, titleId } }
    } = this.props;

    this.props.fetchCustomerResource(vendorId, packageId, titleId);
  }

  render() {
    return (
        <View
          model={this.props.customerResource}
          toggleSelected={this.props.toggleSelected}
        />
    );
  }
}

export default connect(
  state => ({
    customerResource: state.customerResource
  }),
  dispatch => bindActionCreators(
    actionCreators,
    dispatch
  )
)(CustomerResourceShowRoute);
