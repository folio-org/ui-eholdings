import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { qs } from '../components/utilities';
import { mergeRelationships } from './helpers';

// actions
export const actionTypes = {
  QUERY: '@@ui-eholdings/db/QUERY',
  FIND: '@@ui-eholdings/db/FIND',
  SAVE: '@@ui-eholdings/db/SAVE',
  CREATE: '@@ui-eholdings/db/CREATE',
  DELETE: '@@ui-eholdings/db/DELETE',
  RESOLVE: '@@ui-eholdings/db/RESOLVE',
  REJECT: '@@ui-eholdings/db/REJECT',
  UNLOAD: '@@ui-eholdings/db/UNLOAD'
};

/**
 * Action creator for querying a set of records
 * @param {String} type - resource type
 * @param {Object} params - query params
 * @param {String} options.path - path to use for the query
 */
export const query = (type, params, { path }) => ({
  type: actionTypes.QUERY,
  data: {
    type,
    path,
    params,
    timestamp: Date.now()
  }
});

/**
 * Action creator for finding a single record
 * @param {String} type - resource type
 * @param {String} id - record id
 * @param {String} options.path - path to use for the request
 * @param {String|[String]} [options.include] - additional resources
 * to include via the `?include` query param
 */
export const find = (type, id, { path, include }) => ({
  type: actionTypes.FIND,
  data: {
    type,
    path,
    params: { id, include },
    timestamp: Date.now()
  }
});

/**
 * Action creator for saving a record
 * @param {String} type - resource type
 * @param {Object} payload - record payload
 * @param {String} [options.path] - path to use
 */
export const save = (type, payload, { path }) => ({
  type: actionTypes.SAVE,
  data: {
    type,
    path,
    params: { id: payload.data.id },
    timestamp: Date.now()
  },
  payload
});

/**
 * Action creator for creating a record
 * @param {String} type - resource type
 * @param {Object} payload - record payload
 * @param {String} [options.path] - path to use
 */
export const create = (type, payload, { path }) => ({
  type: actionTypes.CREATE,
  data: {
    type,
    path,
    params: {},
    timestamp: Date.now()
  },
  payload
});


/**
 * Action creator for destroying a record
 * @param {String} type - resource type
 * @param {Object} payload - record payload
 * @param {String} [options.path] - path to use
 */
export const destroy = (type, payload, { path }) => ({
  type: actionTypes.DELETE,
  data: {
    type,
    path,
    params: { id: payload.data.id },
    timestamp: Date.now()
  }
});

/**
 * Action creator for uloading a record
 * @param {String} type - resource type
 * @param {String|[String]} ids - one or more record ids
 */
export const unload = (type, ids) => ({
  type: actionTypes.UNLOAD,
  data: {
    type,
    ids: [].concat(ids)
  }
});

/**
 * Action creator for resolving a record or a set of records
 * @param {Object} request - the request state object associated with
 * the request being resolved
 * @param {Object} body - JSON API returned body
 * @param {Object} payload - payload sent with the request
 */
const resolve = (request, body, payload = {}) => {
  let data = body && body.data ? body.data : payload.data;
  let meta = body ? (body.meta || {}) : {};
  let records = [];
  let ids = [];

  // on request where neither a body or payload is sent
  // such as a delete request we need to pick id off request
  if (!data && request.params.id) {
    data = { id: request.params.id };
  }

  if (Array.isArray(data)) {
    records = records.concat(data);
    ids = records.map(({ id }) => id);
  } else if (data) {
    records = [data];
    ids = [data.id];
  }

  if (body && body.included) {
    records = records.concat(body.included);
  }

  return {
    type: actionTypes.RESOLVE,
    data: { type: request.resource, ids },
    request: { ...request, records: ids, meta },
    records
  };
};

/**
 * Action creator for rejecting a request
 * @param {Object} request - the request state object associated with
 * the request being resolved
 * @param {Array} errors - response errors
 * @param {Object} data - data associated with the request
 */
const reject = (request, errors, data) => ({
  type: actionTypes.REJECT,
  request,
  errors,
  data
});


/**
 * Helper for creating request state objects
 * @param {String} type - one of 'query', 'find', or 'update'
 * @param {Number} data.timestamp - the action timestamp
 * @param {String} data.type - the resource type
 * @param {Object} data.params - request params
 */
const makeRequest = (type, data) => {
  return {
    [data.timestamp]: {
      timestamp: data.timestamp,
      type,
      path: data.path,
      resource: data.type,
      params: data.params,
      isPending: true,
      isResolved: false,
      isRejected: false,
      records: data.params.id ? [data.params.id] : [],
      changedAttributes: data.changedAttributes,
      meta: {},
      errors: []
    }
  };
};

/**
 * Helper for retrieving or creating a record from the resource
 * type's state leaf
 * @param {Object} store - the resource type's state leaf
 * @param {String} id - the record's id
 */
const getRecord = (store, id) => (
  store.records[id] || {
    id,
    isLoading: true,
    isLoaded: false,
    isSaving: false,
    attributes: {},
    relationships: {}
  }
);

/**
 * Reducer helper to reduce a specific resource type's state leaf
 * @param {String} type - the resource type
 * @param {Object} state - current resource type state
 * @param {Function} fn - the actual reducing function
 */
const reduceData = (type, state, fn) => {
  let store = state[type] || {
    requests: {},
    records: {}
  };

  return {
    ...state,
    [type]: {
      ...store,
      ...fn(store)
    }
  };
};

/**
 * Helper for formatting errors returned from a rejected response
 * @param {Mixed} errors - the error or errors
 * @returns {Array} array of error objects
 */
const formatErrors = (errors) => {
  let format = (err) => {
    if (typeof err === 'string') {
      return { title: err };
    } else if (err && err.message) {
      return { title: err.message };
    } else if (err && err.title) {
      return err;
    } else {
      return { title: 'An unknown error occurred' };
    }
  };

  if (Array.isArray(errors)) {
    return errors.map(format);
  } else {
    return [format(errors)];
  }
};

/**
 * Helper for calculating the difference between old and new state
 * with model.save(). Borrows heavily from Ember Data.
 * @param {Object} oldData - current state of attributes in store
 * @param {Object} newData - requested new state of attributes
 * @returns {Object} set of attributes with change
 */
const getChangedAttributes = (oldData, newData) => {
  let diffData = Object.create(null);
  let newDataKeys = Object.keys(newData);

  for (let i = 0, length = newDataKeys.length; i < length; i++) {
    let key = newDataKeys[i];
    if (oldData[key] !== newData[key]) {
      diffData[key] = {
        prev: oldData[key],
        next: newData[key]
      };
    }
  }

  return diffData;
};

// reducer handlers
const handlers = {

  /**
   * Handles reducing the data store when querying for a new set of resources
   * @param {Object} state - data store state
   * @param {Object} action.data - data associated with the query
   */
  [actionTypes.QUERY]: (state, { data }) => {
    return reduceData(data.type, state, store => ({
      requests: {
        ...store.requests,
        ...makeRequest('query', data)
      }
    }));
  },

  /**
   * Handles reducing the data store when finding a single record
   * @param {Object} state - data store state
   * @param {Object} action.data - data associated with the query
   * @param {Object} action.data.params.id - the id of the requested record
   */
  [actionTypes.FIND]: (state, { data }) => {
    return reduceData(data.type, state, store => ({
      requests: {
        ...store.requests,
        ...makeRequest('find', data)
      },
      records: {
        ...store.records,
        [data.params.id]: {
          ...getRecord(store, data.params.id),
          isLoading: true
        }
      }
    }));
  },

  /**
   * Handles reducing the data store when saving a single record
   * @param {Object} state - data store state
   * @param {Object} action.data - data associated with the query
   * @param {String} action.data.params.id - the id of the requested record
   */
  [actionTypes.SAVE]: (state, { data, payload }) => {
    return reduceData(data.type, state, (store) => {
      let record = getRecord(store, data.params.id);

      return {
        requests: {
          ...store.requests,
          ...makeRequest('update', {
            ...data,
            changedAttributes: getChangedAttributes(record.attributes, payload.data.attributes)
          })
        },
        records: {
          ...store.records,
          [data.params.id]: {
            ...record,
            isSaving: true
          }
        }
      };
    });
  },

  /**
   * Handles reducing the data store when creating a new record
   * @param {Object} state - data store state
   * @param {Object} action.data - data associated with the query
   */
  [actionTypes.CREATE]: (state, { data }) => {
    return reduceData(data.type, state, store => ({
      requests: {
        ...store.requests,
        ...makeRequest('create', data)
      }
    }));
  },

  /**
   * Handles reducing the data store when deleting a single record
   * @param {Object} state - data store state
   * @param {Object} action.data - data associated with the query
   * @param {String} action.data.params.id - the id of the requested record
   */
  [actionTypes.DELETE]: (state, { data }) => {
    return reduceData(data.type, state, (store) => {
      return {
        requests: {
          ...store.requests,
          ...makeRequest('destroy', data)
        },
      };
    });
  },

  /**
   * Handles reducing the data store when unloading records
   * @param {Object} state - data store state
   * @param {Object} action.data - data associated with the action
   * @param {String} action.data.ids - ids of records
   */
  [actionTypes.UNLOAD]: (state, { data }) => {
    return reduceData(data.type, state, store => ({
      // remove the records from the store
      records: data.ids.reduce((records, id) => {
        // eslint-disable-next-line no-unused-vars
        let { [id]: r, ...rest } = records;
        return rest;
      }, store.records),

      // remove reqeusts for this record and flag query requests with `hasUnloaded`
      requests: Object.keys(store.requests).reduce((reqs, timestamp) => {
        let request = store.requests[timestamp];

        // if the request does not include any unloaded ids, keep it
        if (request.type === 'destroy' || !request.records.some(id => data.ids.includes(id))) {
          reqs[timestamp] = request;

        // if a query request includes unloaded ids, falg is with `hasUnloaded`
        } else if (request.type === 'query') {
          reqs[timestamp] = {
            ...request,
            hasUnloaded: true
          };
        }

        return reqs;
      }, {})
    }));
  },

  /**
   * Handles reducing the data store when resolving a resource request
   * @param {Object} state - data store state
   * @param {Object} action.request - the request state object
   * @param {Array} action.records - array of resolved records
   */
  [actionTypes.RESOLVE]: (state, action) => {
    let { request, records } = action;
    // first we reduce the request state object
    let next = reduceData(request.resource, state, store => ({
      requests: {
        ...store.requests,
        [request.timestamp]: {
          ...store.requests[request.timestamp],
          records: request.records,
          meta: request.meta,
          isPending: false,
          isResolved: true
        }
      }
    }));

    // then we reduce each record in the set of records
    next = records.reduce((next, record) => { // eslint-disable-line no-shadow
      return reduceData(record.type, next, (store) => {
        let recordState = getRecord(store, record.id);

        return {
          records: {
            ...store.records,
            [record.id]: {
              ...recordState,
              attributes: record.attributes || {},
              relationships: mergeRelationships(recordState.relationships, record.relationships),
              isSaving: false,
              isLoading: false,
              isLoaded: true
            }
          }
        };
      });
    }, next);

    if (request.type === 'destroy') {
      next = handlers[actionTypes.UNLOAD](next, action);
    }

    return next;
  },

  /**
   * Handles reducing the data store when rejecting a resource request
   * @param {Object} state - data store state
   * @param {Object} action.request - the request state object
   * @param {Array} action.errors - response errors
   * @param {Object} action.data - data used to create the request
   */
  [actionTypes.REJECT]: (state, { request, errors, data }) => {
    // first we reduce the request state object
    let next = reduceData(request.resource, state, store => ({
      requests: {
        ...store.requests,
        [request.timestamp]: {
          ...store.requests[request.timestamp],
          errors: formatErrors(errors),
          isPending: false,
          isRejected: true
        }
      }
    }));

    // if we requested a single record, reduce that record's state
    if (data.params.id) {
      next = reduceData(data.type, next, store => ({
        records: {
          ...store.records,
          [data.params.id]: {
            ...getRecord(store, data.params.id),
            isLoading: false,
            isSaving: false
          }
        }
      }));
    }

    return next;
  }
};


/**
 * Helper for creating headers when making a request
 * @param {String} method - request method
 * @param {String} state.okapi.tenant - the Okapi tenant
 * @param {String} state.okapi.token - the Okapi user token
 * @returns {Object} headers for a new request
 */
const getHeaders = (method, { okapi }) => {
  let headers = {
    'X-Okapi-Tenant': okapi.tenant,
    'X-Okapi-Token': okapi.token
  };

  if (method === 'PUT' || method === 'POST') {
    headers['Content-Type'] = 'application/vnd.api+json';
  }

  return headers;
};

/**
 * Sometimes the response from the server (or mirage) does not include a
 * body (null). This causes `response.json()` to error with something like
 * "unexpected end of input". This workaround uses `response.text()` and
 * when there are any errors parsing it using `JSON.parse`, the text is
 * returned instead.
 */
const parseResponseBody = (response) => {
  return response.text().then((text) => {
    try { return JSON.parse(text); } catch (e) { return text; }
  });
};

/**
 * The main data store reducer simply uses the handlers defined above
 * @param {Object} state - data store state leaf
 * @param {Object} action - redux action being dispatched
 */
export function reducer(state = {}, action) {
  if (handlers[action.type]) {
    return handlers[action.type](state, action);
  } else {
    return state;
  }
}

/**
 * The epic used to actually make a requests when an action is dispatched
 * @param {Observable} action$ - the observable action
 * @param {Function} store.getState - get's the most recent redux state
 */
export function epic(action$, { getState }) {
  let actionMethods = {
    [actionTypes.QUERY]: 'GET',
    [actionTypes.FIND]: 'GET',
    [actionTypes.SAVE]: 'PUT',
    [actionTypes.CREATE]: 'POST',
    [actionTypes.DELETE]: 'DELETE'
  };

  return action$
    .filter(({ type }) => actionMethods[type])
    .mergeMap(({ type, data, payload }) => {
      let state = getState();
      let method = actionMethods[type];

      // the request object created from this action
      let request = state.eholdings.data[data.type].requests[data.timestamp];

      // used for the actual request
      let url = `${state.okapi.url}${data.path}`;
      let headers = getHeaders(method, state);
      let body;

      // if we're querying a set of records, data.params are the
      // parameters needed in the request URL
      if (type === actionTypes.QUERY) {
        url = `${url}?${qs.stringify(data.params)}`;
      }

      // if we need to include additional resources in the response,
      // we need to add the proper query param to the request URL.
      if (data.params.include) {
        let include = data.params.include;
        include = Array.isArray(include) ? include.join(',') : include;
        url = `${url}?${qs.stringify({ include })}`;
      }

      // When PUTing, the payload needs to be stringified
      if (method === 'PUT' || method === 'POST') {
        body = JSON.stringify(payload);
      }

      // request which rejects when not OK
      let promise = fetch(url, { headers, method, body })
        .then(response => Promise.all([response.ok, parseResponseBody(response)]))
        .then(([ok, body]) => (ok ? body : Promise.reject(body.errors))); // eslint-disable-line no-shadow

      // an observable from resolving or rejecting the request payload
      return Observable.from(promise)
        .map(responseBody => resolve(request, responseBody, payload))
        .catch(errors => Observable.of(reject(request, errors, data)));
    });
}
