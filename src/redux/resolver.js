import dasherize from 'lodash/kebabCase';
import { find, query, save } from './data';

/**
 * Helper to return the resource type for a relationship
 * @param {String} key - the relationship key to default to
 * @param {Object} rel - relationship options (hasMany or belongsTo)
 * @returns {String} the relationship resource type
 */
function typeForRelationship(key, rel = {}) {
  if (typeof rel.hasMany === 'string') {
    return rel.hasMany;
  } else if (typeof rel.belongsTo === 'string') {
    return rel.belongsTo;
  } else {
    return key;
  }
}

/**
 * The model for a resource type. Extend this class and register it
 * with the resolver so the resolver can return the proper models for
 * the data store's records
 */
export class Model {
  /**
   * Override this static property with the type this model is for
   */
  static type = '';

  /**
   * Override this static property to provide an alternate path for
   * requesting resources. (default is `/${this.type}`)
   */
  static path = '';

  /**
   * Override this static property to provide getters for model
   * attributes. The values associated with each attribute becomes the
   * default value when the attributes are accessed before the record
   * has been loaded into the data store.
   */
  static attributes = {};

  /**
   * Override this static property to provide getters for model
   * relationships. The values associated with each relationship
   * determine the type of relationship and with which resource
   * type. To specify a different type for a key, use that resource
   * type as the value for the relationship type.
   *
   * i.e.
   *    static relationships = {
   *      titles: { hasMany: true },
   *      vendor: { belongsTo: 'vendors' }
   *    }
   */
  static relationships = {};

  /**
   * Returns the path for this model, optionally with an id
   * @param {String} [id] - record id
   */
  static pathFor(id) {
    let path = this.path || `/${this.type}`;
    return id ? `${path}/${id}` : path;
  }

  /**
   * Action creator for querying this specific model's resource
   * @param {Object} [params={}] - query params for the request
   */
  static query(params = {}) {
    return query(this.type, params, {
      path: this.pathFor()
    });
  }

  /**
   * Action creator for querying related resources
   * @param {String} id - the resource with related documents
   * @param {String} rel - the relationship key (dasherized as the endpoint)
   * @param {Object} [params={}] - query params to send with the request
   */
  static queryRelated(id, rel, params = {}) {
    let type = typeForRelationship(rel, this.relationships[rel] || {});

    return query(type, params, {
      path: `${this.pathFor(id)}/${dasherize(rel)}`
    });
  }

  /**
   * Action creator for saving a record
   * @param {Object} model - the record's model
   */
  static save(model) {
    let data = {
      id: model.id,
      type: this.type,
      attributes: {}
    };

    for (let attr of Object.keys(this.attributes)) {
      data.attributes[attr] = model[attr];
    }

    return save(this.type, { data }, {
      path: this.pathFor(model.id)
    });
  }

  /**
   * Action creator for finding a record for this specific model's resource
   * @param {String} id - the record's id
   * @param {String|[String]} [options.include] - additional resources
   * to include with the response via the `?include` query param
   */
  static find(id, { include } = {}) {
    let path = this.pathFor(id);
    return find(this.type, id, { path, include });
  }

  /**
   * Initialized with the record data and the request state object
   * associated with the record.
   * @param {Object} record - record data from the data store
   * @param {Object} request - the request associated with this record
   * @param {Resolver} resolver - the current resolver instance
   */
  constructor(record, request, resolver) {
    this.data = record || { attributes: {} };
    this.request = request;
    this.resolver = resolver;

    // for each attribute defined in the static attributes, assign
    // it's value to an instance property
    for (let attr of Object.keys(this.constructor.attributes)) {
      this[attr] = Object.prototype.hasOwnProperty.call(this.data.attributes, attr)
        ? this.data.attributes[attr]
        : this.constructor.attributes[attr];
    }

    // for each relationship defined in the static relationships,
    // assign a getter which returns a collection or model for
    // the related resource
    for (let rel of Object.keys(this.constructor.relationships)) {
      Object.defineProperty(this, rel, {
        configurable: true,
        get() {
          let opts = this.constructor.relationships[rel];
          let related = record.relationships[rel];
          let type = typeForRelationship(rel, related);
          let ModelClass = resolver.modelFor(type);
          let ret;

          // if the relationship isn't defined in the record, return
          // an empty collection or model for the resource type
          if (!Object.prototype.hasOwnProperty.call(this.data.relationships, rel)) {
            ret = opts.hasMany
              ? new Collection(type, [], request, resolver) // eslint-disable-line no-use-before-define
              : new ModelClass({}, request, resolver);

          // if we know the ids of the related resources, simply use
          // the resolver to look up the data for the resource
          } else if (related && related.data) {
            // map related data with records from the resolver and
            // return a new collection or model for the resource(s)
            if (opts.hasMany) {
              let records = related.data.map(({ id }) => resolver.getRecord(type, id));

              // look up a request for related resources
              let req = resolver.getRequest('query', {
                path: `${this.constructor.pathFor(record.id)}/${dasherize(rel)}`,
                type
              });

              req = req.timestamp > request.timestamp ? req : request;
              ret = new Collection(type, records, req, resolver); // eslint-disable-line no-use-before-define
            } else if (opts.belongsTo) {
              let relatedRecord = resolver.getRecord(type, related.data.id);

              // look up a request specific to this record
              let req = resolver.getRequest('find', { type, id: relatedRecord.id });

              req = req.timestamp > request.timestamp ? req : request;
              ret = new ModelClass(relatedRecord, req, resolver);
            }
          } else {
            // if there is no included relationship on our record, use
            // the resolver to find records from another request
            ret = resolver.query(type, {});
          }

          // this essentially caches this property
          Object.defineProperty(this, rel, {
            get() { return ret; }
          });

          return ret;
        }
      });
    }
  }

  /**
   * Lazily looks up an update request for this record
   * @returns {Object} the update request state object
   */
  get update() {
    let update = this.resolver.getRequest('update', {
      type: this.type,
      params: { id: this.id }
    });

    // this will essentially cache this request
    Object.defineProperty(this, 'update', {
      get() { return update; }
    });

    return update;
  }

  // simple properties to map type, id, and status

  get type() {
    return this.constructor.type;
  }

  get id() {
    return this.data.id;
  }

  get isLoading() {
    return this.data.isLoading;
  }

  get isLoaded() {
    return this.data.isLoaded;
  }

  get isSaving() {
    return this.data.isSaving;
  }
}

/**
 * Collection object which provides the request state object created
 * as a result of the query request, and a map method to map over the
 * collection's record models
 * @param {String} type - the collection resource type
 * @param {[Object]} records - array of record data
 * @param {Object} request - the request state object for the query
 * @param {Resolver} resolver - the current resolver instance
 */
class Collection {
  constructor(type, records, request, resolver) {
    this.data = records || [];
    this.request = request;
    this.resolver = resolver;
    this.models = [];

    for (let i = 0, l = this.data.length; i < l; i++) {
      let ModelClass = resolver.modelFor(type);

      // check for any newer requests for this specific record
      let req = resolver.getRequest('find', { type, params: { id: records[i].id } });

      req = req.timestamp > request.timestamp ? req : request;
      this.models[i] = new ModelClass(records[i], req, resolver);
    }
  }

  get length() {
    // if this doesn't check for models, it will error when inspecting
    // it via react dev tools
    return this.models ? this.models.length : 0;
  }

  get isLoaded() {
    return this.length && this.models.every(m => m.isLoaded);
  }

  get isLoading() {
    return !this.length || this.models.some(m => m.isLoading);
  }

  map(...args) {
    return this.models.map(...args);
  }
}

/**
 * Resolver to retreive records and thir associated request object
 * from the data store's state
 */
export default class Resolver {
  static models = {};

  /**
   * Registers models classes to their type names
   * @param {Class} ModelClass - model class
   */
  static register(ModelClass) {
    this.models = {
      ...this.models,
      [ModelClass.type]: ModelClass
    };
  }

  /**
   * Initialized with the current data store state
   * @param {Object} state - the current data store state
   */
  constructor(state) {
    this.state = state;
  }

  /**
   * Retrieves a model's class for a specific type. Throws an error if
   * the model was not registered with the resolver
   * @param {String} type - the model's type name
   * @returns {Class} - the model's associated class
   * @throws {Error} when the model can not be found
   */
  modelFor(type) {
    let ModelClass = this.constructor.models[type];

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
   * @returns {Object} the last request state object associated with
   * the provided data
   */
  getRequest(type, data) {
    let store = this.state[data.type];
    let params = Object.keys(data.params || {});

    // used when the request is not found
    let emptyRequest = {
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
        let request = store.requests[timestamp];
        let isMatch = request.type === type &&
          params.every(key => request.params[key] === data.params[key]);
        let isNewer = timestamp > ret.timestamp;

        // if a path was specified, ensure it too matches
        if (isMatch && data.path) {
          isMatch = request.path === data.path;
        }

        return isMatch && isNewer ? request : ret;
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
  query(type, params, { path } = {}) {
    let request = this.getRequest('query', { type, params, path });
    let records = request ? request.records.map((id) => {
      return this.getRecord(type, id);
    }) : [];

    return new Collection(type, records, request, this);
  }

  /**
   * Returns a record model for a specific resource record
   * @param {String} type - the resource type
   * @param {String} id - the requested record id
   * @returns {Model} the model for the record
   */
  find(type, id) {
    let ModelClass = this.modelFor(type);
    let record = this.getRecord(type, id);
    let request = this.getRequest('find', { type, params: { id } });

    return new ModelClass(record, request, this);
  }
}
