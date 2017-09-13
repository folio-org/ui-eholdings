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

/**
 * Creates an action creator to start a request for a specific named epic
 *
 * @param {string} name - name of the request epic to trigger
 * @param {object} [options={}] - additional options for this request
 * (currently only `method` is supported)
 * @returns {function} named request action creator
 */
export function createRequestCreator(name, options = {}) {
  /**
   * Named request action creator
   *
   * @param {object} [data={}] - data to provide to the request (query
   * params for GET/DELETE; body data for PUT/POST)
   */
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

/**
 * Request reducer creator
 *
 * Creates a reducer that responds to three basic request actions to
 * provide promise-like state properties for the request.
 *
 * - REQUEST_MAKE sets `isPending` to `true` and reinits the default
 * promise-like properties.
 * - REQUEST_RESOLVE sets `isPending` to `false`, `isResolved` to
 * `true`, and `content` to the action's payload.
 * - REQUEST_REJECT sets `isPending` to `false`, `isRejected` to
 * `true`, and `error` to the action's error property.
 *
 * In order for request reducers to receive actions from a specific
 * request epic, the names of each reducer/epic combo must match
 * exactly. Additonally, it must be unique to a reducer/epic combo,
 * otherwise other epics with the same name will trigger the reducer.
 *
 * if `handleActions` is provided, other actions can be included in
 * the reducer to further alter it's state. When one of the request
 * actions are provided, it acts as middleware, and the resulting
 * state is reduced again by the default request action handler to
 * maintain the promise-like properties of the state.
 *
 * For example:
 *
 *   handleActions: {
 *     [REQUEST_MAKE]: (state, action) => ({
 *       ...state,
 *       query: action.data
 *     })
 *   }
 *
 * Then the reducer would take this resulting state and pass it along
 * to the original REQUEST_MAKE handler, producing this:
 *
 *   {
 *     isPending: true,
 *     isResolved: false,
 *     isRejected: false,
 *     content: {},       // or whatever `initialContent` was
 *     error: null,
 *     query: {...}       // data passed to the last request action
 *   }
 *
 * NOTE: if you need to modify the `content` property during
 * REQUEST_RESOLVE, consider using the `serialize` argument of the
 * related epic.
 *
 * if `handleRequests` is provided, the reducer is given the
 * oppurtinity to reduce _other_ request actions. The keys of this
 * object should be names of other request reducer/epic combos.
 *
 * For example, if you would like to update the contents of the
 * state when a request is resolved for 'resource-toggle-selected'
 * (using `handleActions` from redux-actions):
 *
 *   handleRequests: {
 *     'resource-toggle-selected': handleActions({
 *        [REQUEST_RESOLVE]: (state, action) => ({
 *          ...state,
 *          content: {
 *            ...state.content,
 *            isSelected: !state.content.isSelected
 *          }
 *        })
 *      })
 *   }
 *
 * @param {string} name - name of this request reducer; must match a
 * corrisponding request epic
 * @param {mixed} [initialContent=null] - initial `content` property
 * for this request; usually an empy object or array
 * @param {object} [handleActions={}] - additional actions to handle
 * in this reducer; provided request actions are reduced twice to
 * preserve the promise-like state
 * @param {object} [handleRequests={}] - handlers that reduce this
 * state when other requests are initiated
 * @param {object} [initialState={}] - additional initial state to
 * include in this reducer
 * @returns {function} reducer function to use with redux
 */
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

/**
 * Request epic creator
 *
 * Creates an epic that watches for REQUEST_MAKE actions for a
 * specific name and performs said request. When an error is returned
 * from the response the REQUEST_REJECT action is dispatched with the
 * error; otherwise REQUEST_RESOLVE is dispatched with the deserialized
 * payload.
 *
 * In order for request epics to handle actions for a specific
 * request reducer, the names of each reducer/epic combo must match
 * exactly. Additonally, it must be unique to a reducer/epic combo,
 * otherwise other request actions with the same name will trigger
 * the epic.
 *
 * The `serialize` function parameters will be the `data` and
 * `options` arguments provided to the request action. This should
 * return serialized data to send with the request (params or body).
 *
 * The `deserialize` function will simply recieve the payload from the
 * request's response along with the `options` argument provided to
 * the initial request's action.
 *
 * When `defaultParams` is `false`, no query params will ever be
 * appended to the URL. To append query params, simply provide an
 * empty object. Key-values will be used as defaults for the query.
 *
 * @param {string} name - name of this request epic; must match a
 * corrisponding request reducer
 * @param {string|function} [endpoint=''] - string or generator which when
 * combined with `okapi.url` will become the request URL
 * @param {object|false} [defaultParams=false] - when `false` this request has
 * no query options; when an object is provided, it will be merged with
 * `data` before being stringified and appended to GET and DELETE URLs
 * @param {function} [deserialize=identity] - transforms data being
 * received from the response before it is dispatched to the reducer
 * @param {function} [serialize=identity] - transforms data being sent
 * with the request before the request is made
 * @returns {function} epic function to use with redux-observable
 */
export function createRequestEpic({
  name,
  endpoint = '',
  defaultParams = false,
  deserialize = (i) => i,
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
          .map((payload) => resolveRequest(name, deserialize(payload)))
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
