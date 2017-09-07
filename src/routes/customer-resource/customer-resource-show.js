import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import { handleActions } from 'redux-actions';
import  { Observable }  from 'rxjs/Observable';
import { bindActionCreators } from 'redux'

import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';

import View from '../../components/customer-resource-show';

const ActionTypes = {
  'CUSTOMER_RESOURCE_SHOW_ERROR': 'CUSTOMER_RESOURCE_SHOW_ERROR',
  'CUSTOMER_RESOURCE_SHOW_TOGGLE_SELECTED_REJECT': 'CUSTOMER_RESOURCE_SHOW_TOGGLE_SELECTED_REJECT',
  'CUSTOMER_RESOURCE_SHOW_TOGGLE_SELECTED_RESOLVE': 'CUSTOMER_RESOURCE_SHOW_TOGGLE_SELECTED_RESOLVE',
  'CUSTOMER_RESOURCE_SHOW_TOGGLE_SELECTED': 'CUSTOMER_RESOURCE_SHOW_TOGGLE_SELECTED',
  'CUSTOMER_RESOURCE_SHOW_LOADED': 'CUSTOMER_RESOURCE_SHOW_LOADED',
  'CUSTOMER_RESOURCE_SHOW_LOAD': 'CUSTOMER_RESOURCE_SHOW_LOAD'
};

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
    addReducer: PropTypes.func.isRequired,
    addEpic: PropTypes.func.isRequired
  }


  componentWillMount() {
    let { okapi } = this.props;

    let headers = {
      'Content-Type': 'application/json',
      'X-Okapi-Tenant': okapi.tenant
    };


    const ToggleSelectionEpic = (action$, { getState }) => (
      action$.ofType(ActionTypes.CUSTOMER_RESOURCE_SHOW_TOGGLE_SELECTED)
        .switchMap((action) => {
          let { endpoint, isSelected } = getState().customerResourceShow;
          let body = JSON.stringify({isSelected: isSelected});
          let request = fetch(endpoint, { headers, method: 'PUT', body });

          return Observable.from(request.then(
            (response) => {
              if(!response.ok) {
                throw Error(response.statusText)
              }
              return response;
            }
          ))
            .map(() => ({ type: ActionTypes.CUSTOMER_RESOURCE_SHOW_TOGGLE_SELECTED_RESOLVE }))
            .catch((error) => Observable.of({ type: ActionTypes.CUSTOMER_RESOURCE_SHOW_TOGGLE_SELECTED_REJECT, error }));
        })
    );



    const ResourceLoadedEpic = (action$, { getState }) => (
      action$.ofType(ActionTypes.CUSTOMER_RESOURCE_SHOW_LOAD)
        .switchMap((action) => {
          let { endpoint } = getState().customerResourceShow;
          let request = fetch(endpoint, { headers });

          return Observable.from(request.then((response) => response.json()))
            .map((json) => ({ type: ActionTypes.CUSTOMER_RESOURCE_SHOW_LOADED, payload: json }))
            .catch((error) => Observable.of({ type: ActionTypes.CUSTOMER_RESOURCE_SHOW_ERROR, error }));
        })
    );

    this.context.addEpic('customerResourceToggleSelected', ToggleSelectionEpic);
    this.context.addEpic('customerResourceShowLoad', ResourceLoadedEpic);

    this.context.addReducer('customerResourceShow', handleActions({
      [ActionTypes.CUSTOMER_RESOURCE_SHOW_LOAD]: (state, action) => {
        let { vendorId, packageId, titleId } = action.params;
        let endpoint = `${okapi.url}/eholdings/vendors/${vendorId}/packages/${packageId}/titles/${titleId}`;
        return {...state, endpoint};
      },
      [ActionTypes.CUSTOMER_RESOURCE_SHOW_LOADED]: (state, action) => {
        let { customerResourcesList, ...title } = action.payload;
        let resource = customerResourcesList[0];

        return {
          ...state,
          isLoaded: true,
          isErrored: false,
          ...title,
          ...resource
        };
      },
      [ActionTypes.CUSTOMER_RESOURCE_SHOW_TOGGLE_SELECTED]: (state, action) => {
        return {
          ...state,
          isSelected: !state.isSelected,
          isTogglingSelection: true
        };
      },
      [ActionTypes.CUSTOMER_RESOURCE_SHOW_TOGGLE_SELECTED_RESOLVE]: (state, action) => {
        return {
          ...state,
          isTogglingSelection: false
        };
      },
      [ActionTypes.CUSTOMER_RESOURCE_SHOW_TOGGLE_SELECTED_REJECT]: (state, action) => {
        return {
          ...state,
          isTogglingSelection: false,
          isSelected: !state.isSelected
        };
      },
      [ActionTypes.CUSTOMER_RESOURCE_SHOW_ERROR]: (state, action) => {
        return {
          ...state,
          toggleSelectionError: action.error
        };
      }
    }, { isLoaded: false, isErrored: false }));

    this.props.loadRecord(this.props.match.params);
  }

  render() {
    let { vendorId, packageId, titleId } = this.props.match.params;
    return (
      <View
        model={this.props.model}
        toggleSelected={this.props.toggleSelected}
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

const loadRecord = (params) => ({
  type: 'CUSTOMER_RESOURCE_SHOW_LOAD', params
});
const toggleSelected = (event) => ({
  type: 'CUSTOMER_RESOURCE_SHOW_TOGGLE_SELECTED'
});

export default connect(mapStateToProps, { loadRecord, toggleSelected })(CustomerResourceShowRoute);
