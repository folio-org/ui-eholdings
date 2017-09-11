import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';

// action types
const CUSTOMER_RESOURCE_REQUESTED = 'CUSTOMER_RESOURCE_REQUESTED';
const CUSTOMER_RESOURCE_RESOLVE = 'CUSTOMER_RESOURCE_RESOLVE';
const CUSTOMER_RESOURCE_REJECT = 'CUSTOMER_RESOURCE_REJECT';
const CUSTOMER_RESOURCE_TOGGLE_SELECTED = 'CUSTOMER_RESOURCE_TOGGLE_SELECTED';
const CUSTOMER_RESOURCE_TOGGLE_SELECTED_RESOLVE = 'CUSTOMER_RESOURCE_TOGGLE_SELECTED_RESOLVE';
const CUSTOMER_RESOURCE_TOGGLE_SELECTED_REJECT = 'CUSTOMER_RESOURCE_TOGGLE_SELECTED_REJECT';

// action creators
export const requestResource = (vendorId, packageId, titleId) => ({
  type: CUSTOMER_RESOURCE_REQUESTED,
  resource: { vendorId, packageId, titleId }
});

export const toggleSelected = () => ({
  type: CUSTOMER_RESOURCE_TOGGLE_SELECTED
});

// customer resource record reducer
export const recordReducer = handleActions({
  [CUSTOMER_RESOURCE_REQUESTED]: (state, action) => ({
    ...state,
    isPending: true,
    isResolved: false,
    isRejected: false,
    content: {}
  }),
  [CUSTOMER_RESOURCE_RESOLVE]: (state, { payload: { customerResourcesList, ...title }}) => ({
    ...state,
    isPending: false,
    isResolved: true,
    content: {
      ...title,
      ...customerResourcesList[0]
    }
  }),
  [CUSTOMER_RESOURCE_REJECT]: (state, { error }) => ({
    ...state,
    isPending: false,
    isRejected: true,
    error
  }),
  [CUSTOMER_RESOURCE_TOGGLE_SELECTED]: (state) => ({
    ...state,
    content: {
      ...state.content,
      isSelected: !state.content.isSelected
    }
  }),
  [CUSTOMER_RESOURCE_TOGGLE_SELECTED_REJECT]: (state) => ({
    ...state,
    content: {
      ...state.content,
      isSelected: !state.content.isSelected
    }
  })
}, {
  isPending: false,
  isResolved: false,
  isRejected: false,
  error: null
});

// customer resource toggle selected reducer
const toggleSelectedReducer = handleActions({
  [CUSTOMER_RESOURCE_TOGGLE_SELECTED]: (state) => ({
    ...state,
    isPending: true,
    isResolved: false,
    isRejected: false
  }),
  [CUSTOMER_RESOURCE_TOGGLE_SELECTED_RESOLVE]: (state) => ({
    ...state,
    isPending: false,
    isResolved: true
  }),
  [CUSTOMER_RESOURCE_TOGGLE_SELECTED_REJECT]: (state, { error }) => ({
    ...state,
    isPending: false,
    isRejected: true,
    error
  })
}, {
  isPending: false,
  isResolved: false,
  isRejected: false,
  error: null
});

// customer resource epic
function customerResourceEpic(action$, { getState }) {
  return action$.ofType(CUSTOMER_RESOURCE_REQUESTED)
    .switchMap((action) => {
      let { okapi } = getState();
      let request = fetchResource(action.resource, { okapi });
      return Observable.from(request.then((response) => response.json()))
        .map((payload) => ({ type: CUSTOMER_RESOURCE_RESOLVE, payload }))
        .catch((error) => Observable.of({ type: CUSTOMER_RESOURCE_REJECT, error }));
    });
};

// customer resource toggle selected epic
function toggleSelectedEpic(action$, { getState }) {
  return action$.ofType(CUSTOMER_RESOURCE_TOGGLE_SELECTED)
    .switchMap((action) => {
      let { okapi, eholdings: { customerResource: { record }} } = getState();
      let body = JSON.stringify({ isSelected: record.content.isSelected });
      let request = fetchResource(record.content, { okapi, method: 'PUT', body });

      return Observable.from(request.then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          } else {
            return response;
          }
        }))
        .map(() => ({ type: CUSTOMER_RESOURCE_TOGGLE_SELECTED_RESOLVE }))
        .catch((error) => Observable.of({ type: CUSTOMER_RESOURCE_TOGGLE_SELECTED_REJECT, error }));
    });
}

// customer resource root reducer
export const customerResourceReducer = combineReducers({
  record: recordReducer,
  toggle: toggleSelectedReducer
});

// customer resource root epic
export const customerResourceEpics = combineEpics(
  customerResourceEpic,
  toggleSelectedEpic
);

// helper to fetch a customer resource using the okapi endpoint and headers
function fetchResource({ vendorId, packageId, titleId }, { okapi, method, body }) {
  let endpoint = `${okapi.url}/eholdings/vendors/${vendorId}/packages/${packageId}/titles/${titleId}`;
  let headers = { 'X-Okapi-Tenant': okapi.tenant };

  if (method === 'PUT') {
    headers['Content-Type'] = 'application/json';
  }

  return fetch(endpoint, { headers, method, body });
}
