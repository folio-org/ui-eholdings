import { createAction } from 'redux-actions';
import { ActionTypes } from './action-types';

// TODO: put this on state
const okapi = { 
  url: 'https://okapi.frontside.io',
  tenant: 'fs',
  headers: {
    'X-Okapi-Tenant': 'fs'
  }
};

const createCustomerResourceLoaded = createAction(ActionTypes.CUSTOMER_RESOURCE_SHOW_LOADED);

const createCustomerResourceError = () => ({
  type: ActionTypes.CUSTOMER_RESOURCE_SHOW_ERROR,
  error: true
});

export function fetchCustomerResource(vendorId, packageId, titleId) {
  // TODO: put this endpoint on state
  const customerResourceEndpoint = `${okapi.url}/eholdings/vendors/${vendorId}/packages/${packageId}/titles/${titleId}`;
  return (dispatch) => {
    fetch(
      customerResourceEndpoint, 
      okapi.headers
    ).then((response) => {
      if(response.ok) {
        console.log('response', response);
        response.json().then((data) => {
          dispatch(createCustomerResourceLoaded(data));
        });
      } else {
        dispatch(createCustomerResourceError());
      }
    }).catch((error) => {
      console.log('error', error);
      dispatch(createCustomerResourceError());
    });
  };
}

export function toggleSelected(event) {
  console.log("toggling!");
}
