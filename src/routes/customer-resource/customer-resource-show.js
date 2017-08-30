import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import { handleActions } from 'redux-actions';

import View from '../../components/customer-resource-show';

class CustomerResourceShowRoute extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        packageId: PropTypes.string.isRequired,
        titleId: PropTypes.string.isRequired,
        vendorId: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  };

  static contextTypes = {
    addReducer: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.context.addReducer('customerResourceShow', handleActions({
      ['CUSTOMER_RESOURCE_SHOW_LOADED']: (state, action) => {
        let resource = action.record.customerResourcesList[0];
        return {
          ...state,
          isLoaded: true,
          isErrored: false,
          titleName: action.record.titleName,
          ...resource
        };
      },
      ['CUSTOMER_RESOURCE_SHOW_TOGGLE_SELECTED']: (state, action) => {
        return {
          ...state,
          isSelected: !state.isSelected,
          isTogglingSelection: true
        };
      },
      ['CUSTOMER_RESOURCE_SHOW_TOGGLE_SELECTED_RESOLVE']: (state, action) => {
        return {
          ...state,
          isTogglingSelection: false
        };
      },
      ['CUSTOMER_RESOURCE_SHOW_TOGGLE_SELECTED_REJECT']: (state, action) => {
        return {
          ...state,
          isTogglingSelection: false,
          isSelected: !state.isSelected
        };
      },
      ['CUSTOMER_RESOURCE_SHOW_ERROR']: (state, action) => {
        return {
          ...state,
          toggleSelectionError: action.error
        };
      }
    }, { isLoaded: false, isErrored: false }));

    let { loadRecord, errorRecord } = this.props.dispatch;

    fetch(this.props.endpoint, {headers: {'X-Okapi-Tenant': this.props.okapi.tenant}})
      .then((response) => {
        return response.json().then(loadRecord);
      })
      .catch(errorRecord);
  }

  render() {
    return (
      <View
        model={this.props.model}
        toggleSelected={this.props.dispatch.toggleSelected}
      />
    );
  }
}

function mapStateToProps(state) {
  let { okapi, customerResourceShow } = state;
  return {
    okapi,
    model: customerResourceShow || {
      isLoaded: false,
      isErrored: false
    }
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    loadRecord(record) {
      dispatch({
        type: 'CUSTOMER_RESOURCE_SHOW_LOADED',
        record
      });
    },
    errorRecord(error) {
      dispatch({
        type: 'CUSTOMER_RESOURCE_SHOW_ERROR',
        error
      });
    },
    toggleSelected(event) {
      dispatch(function(dispatch, getState) {
        dispatch({ type: 'CUSTOMER_RESOURCE_SHOW_TOGGLE_SELECTED'});
        let state = getState();
        let { okapi, customerResourceShow: { vendorId, packageId, titleId, isSelected } } = state;
        let endpoint =  `${okapi.url}/eholdings/vendors/${vendorId}/packages/${packageId}/titles/${titleId}`;
        // TODO: add tenant headers
        let headers = {
          'Content-Type': 'application/json',
          'X-Okapi-Tenant': okapi.tenant
        };
        fetch(endpoint, {method: 'PUT', headers, body: JSON.stringify({ isSelected })})
          .then((response)=> {
            dispatch({
              type: 'CUSTOMER_RESOURCE_SHOW_TOGGLE_SELECTED_RESOLVE'
            });
          })
          .catch((error)=> {
            dispatch({
              type: 'CUSTOMER_RESOURCE_SHOW_TOGGLE_SELECTED_REJECT',
              error
            });
          });
      });
    }
  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  let { okapi, model } = stateProps;
  let { vendorId, packageId, titleId } = ownProps.match.params;
  let { match } = ownProps;
  return { endpoint: `${okapi.url}/eholdings/vendors/${vendorId}/packages/${packageId}/titles/${titleId}`, okapi, model, match, dispatch: dispatchProps };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CustomerResourceShowRoute);
