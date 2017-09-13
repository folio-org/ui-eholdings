import queryString from 'query-string';
import startsWith from 'lodash/startsWith';
import { handleActions as reduxHandleActions } from 'redux-actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

// action types
export const REQUEST_MAKE = '@@ui-eholdings/REQUEST_MAKE';
export const REQUEST_RESOLVE = '@@ui-eholdings/REQUEST_RESOLVE';
export const REQUEST_REJECT = '@@ui-eholdings/REQUEST_REJECT';

// action creators
export function createRequestCreator(name, options = {}) {
  return (data = {}) => ({
    type: REQUEST_MAKE,
    name,
    options,
    data
  });
}

// internal action creators
const resolveRequest = (name, payload) => ({
  type: REQUEST_RESOLVE,
  payload,
  name
});

const rejectRequest = (name, error) => ({
  type: REQUEST_REJECT,
  error,
  name
});

// reducer creator
export function createRequestReducer({
  name,
  initialContent = null,
  handleActions = {},
  handleRequests = {},
  initialState = {}
}) {
  let defaultState = {
    isPending: false,
    isResolved: false,
    isRejected: false,
    content: initialContent,
    error: null
  };

  initialState = {
    ...defaultState,
    ...initialState
  };

  let reducer = reduxHandleActions({
    ...handleActions,

    [REQUEST_MAKE]: (state) => ({
      ...state,
      ...defaultState,
      isPending: true
    }),
    [REQUEST_RESOLVE]: (state, { payload }) => ({
      ...state,
      isPending: false,
      isResolved: true,
      content: payload
    }),
    [REQUEST_REJECT]: (state, { error }) => ({
      ...state,
      isPending: false,
      isRejected: true,
      error
    })
  }, initialState);

  return (state = initialState, action) => {
    let isRequest = startsWith(action.type, '@@ui-eholdings/REQUEST');
    let isThisRequest = isRequest && action.name === name;
    let middle = isRequest && handleActions[action.type];

    if (isRequest && handleRequests[action.name]) {
      return handleRequests[action.name](state, action);

    } else if (isThisRequest || (!middle && handleActions[action.type])) {
      if (middle) state = middle(state, action);
      return reducer(state, action);

    } else {
      return state;
    }
  };
}

// epic creator
export function createRequestEpic({
  name,
  endpoint = '',
  defaultParams = false,
  normalize = (i) => i,
  serialize = (i) => i
}) {
  return (action$, { getState }) => (
    action$.ofType(REQUEST_MAKE)
      .filter((action) => action.name === name)
      .switchMap(({ data = {}, options = {} }) => {
        let { okapi } = getState();
        let { method = 'GET' } = options;
        let body, headers = { 'X-Okapi-Tenant': okapi.tenant };
        let url = endpoint;

        // endpoint url
        if (typeof endpoint === 'function') {
          url = `${okapi.url}/${endpoint(data, options)}`;
        } else {
          url = `${okapi.url}/${endpoint}`;
        }

        // request body
        if (method === 'PUT' || method === 'POST') {
          headers['Content-Type'] = 'application/json';
          body = JSON.stringify(serialize(data));

        // query params
        } else if (defaultParams) {
          let query = { ...defaultParams, ...data };

          if (Object.keys(query)) {
            let searchQuery = '';

            // "hack" to prevent query-string from removing/encoding null searches
            if (query.search === '%00') {
              let { search, ...q } = query;
              searchQuery = `search=${search}&${queryString.stringify(q)}`;
            } else {
              searchQuery = queryString.stringify(query);
            }

            url = `${url}?${searchQuery}`;
          }
        }

        // request which rejects when not OK
        let request = fetch(url, { headers, method, body })
            .then((response) => Promise.all([response.ok, parseResponseBody(response)]))
            .then(([ok, body]) => ok ? body : Promise.reject(body));

        return Observable.from(request)
          .map((payload) => resolveRequest(name, normalize(payload)))
          .catch((error) => Observable.of(rejectRequest(name, error)));
      })
  );
}

// Sometimes the response from the server (or mirage) does not include a
// body (null). This causes `response.json()` to error with something like
// "unexpected end of input". This workaround uses `response.text()` and
// when there are any errors parsing it using `JSON.parse`, the text is
// returned instead.
function parseResponseBody(response) {
  return response.text().then((text) => {
    try { return JSON.parse(text); }
    catch (e) { return text; }
  });
}
