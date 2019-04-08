import isEqual from 'lodash/isEqual';
import { Collection } from './model';


/**
 * Resolver to retreive records and thir associated request object
 * from the data store's state
 */
export default class Resolver {
  /**
   * Initialized with the current data store state
   * @param {Object} state - the current data store state
   * @param {Array} models - array of model classes
   */
  constructor(state, models) {
    this.state = state;

    this.models = models.reduce((hash, model) => {
      hash[model.type] = model;
      return hash;
    }, {});
  }

  /**
   * Retrieves a model's class for a specific type. Throws an error if
   * the model was not registered with the resolver
   * @param {String} type - the model's type name
   * @returns {Class} - the model's associated class
   * @throws {Error} when the model can not be found
   */
  modelFor(type) {
    const ModelClass = this.models[type];

    if (!ModelClass) {
      throw Error(`Could not resolve model for "${type}"`);
    } else {
      return ModelClass;
    }
  }

  /**
   * Retrieves a request for the resource type that matches the
   * request data
   * @param {String} type - the request type ('find', 'query', or 'update')
   * @param {Object} data - data used when creating the request
   * @param {String} data.type - the requested resource's type
   * @param {Object} [data.params] - params used in the request
   * @param {String} [data.path] - path used to make the request
   * @param {Function} [filter] - function to optionally filter matching requests
   * @returns {Object} the last request state object associated with
   * the provided data
   */
  getRequest(type, data, filter = () => true) {
    const store = this.state[data.type];
    const params = Object.keys(data.params || {});

    // used when the request is not found
    const emptyRequest = {
      timestamp: 0,
      type,
      params: data.params || {},
      isPending: false,
      isResolved: false,
      isRejected: false,
      records: [],
      meta: {},
      errors: []
    };

    if (store) {
      return Object.keys(store.requests).reduce((ret, timestamp) => {
        const request = store.requests[timestamp];
        let isMatch = request.type === type &&
          params.every(key => isEqual(request.params[key], data.params[key]));
        const isNewer = timestamp > ret.timestamp;

        // if a path was specified, ensure it too matches
        if (isMatch && Object.hasOwnProperty.call(data, 'path')) {
          isMatch = request.path === data.path;
        }

        return isMatch && isNewer && filter(request) ? request : ret;
      }, emptyRequest);
    } else {
      return emptyRequest;
    }
  }

  /**
   * Helper to retrieve a record from the data store
   * @param {String} type - the resource type
   * @param {String} id - the record's ID
   * @returns {Object|Boolean} the record from the store, or false if
   * it cannot be found
   */
  getRecord(type, id) {
    return this.state[type] &&
      this.state[type].records[id];
  }

  /**
   * Returns a collection of records associate with a request
   * @param {String} type - the resource type
   * @param {Object} params - params used for the request
   * @param {String} options.path - the path used to make the request
   * @returns {Collection} a collection object that provides the
   * request and a simple map method to map over it's record models
   */
  query(type, params, options = {}) {
    let { path } = options;

    // when looking up a query via the resolver, the request
    // should have a path
    if (!path) {
      path = this.modelFor(type).path;
    }

    return new Collection({ type, params, path }, this);
  }

  /**
   * Returns a record model for a specific resource record
   * @param {String} type - the resource type
   * @param {String} id - the requested record id
   * @returns {Model} the model for the record
   */
  find(type, id) {
    const ModelClass = this.modelFor(type);
    return new ModelClass(id, this);
  }
}
