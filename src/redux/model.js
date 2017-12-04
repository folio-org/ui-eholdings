import dasherize from 'lodash/kebabCase';
import { pluralize } from 'inflected';
import { find, query, save } from './data';

/**
 * Collection object which provides the request state object created
 * as a result of the query request, and a map method to map over the
 * collection's record models
 * @param {String} type - the collection resource type
 * @param {[Object]} records - array of record data
 * @param {Object} request - the request state object for the query
 * @param {Resolver} resolver - the current resolver instance
 */
export class Collection {
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
 * The base model for a resource type. Extended during creation of the
 * model via the model decorator below.
 */
class BaseModel {
  /**
   * The model's type. By default, this is a lowercased, pluralized
   * version of the class name
   */
  static type = '';

  /**
   * The path used to query records of this model's type. When
   * requesting a single resource, its id is appended to the
   * path. When requesting related resources for a particular
   * resource, its id and the relationship key is appended.
   */
  static path = '';

  /**
   * The model's relationship types keyed by their associated key on
   * the model
   */
  static relTypes = {};

  /**
   * Returns the path for this model, optionally with an id
   * @param {String} [id] - record id
   */
  static pathFor(id) {
    return id ? `${this.path}/${id}` : this.path;
  }

  /**
   * Action creator for finding a record for this specific model's resource
   * @param {String} id - the record's id
   * @param {String|[String]} [options.include] - additional resources
   * to include with the response via the `?include` query param
   */
  static find(id, { include } = {}) {
    return find(this.type, id, {
      path: this.pathFor(id),
      include
    });
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
    return query((this.relTypes[rel] || rel), params, {
      path: `${this.pathFor(id)}/${dasherize(rel)}`
    });
  }

  /**
   * Action creator for saving a record
   * @param {Object} model - the record's model
   */
  static save(model) { // eslint-disable-line no-shadow
    return save(this.type, model.serialize(), {
      path: this.pathFor(model.id)
    });
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
  }

  /**
   * Serializes the model to a JSON API payload
   * @returns {Object} JSON API serialized data
   */
  serialize() {
    let data = {
      id: this.id,
      type: this.type,
      attributes: {}
    };

    for (let attr of Object.keys(this.data.attributes)) {
      data.attributes[attr] = this[attr];
    }

    return { data };
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
 * Helper to check if a property exists on an object and it is not null
 * @param {Object} obj - the object to check own properties of
 * @param {String} prop - the property key to check
 * @returns {Boolean} true if the own property exists on the object
 * and is not null
 */
function hasOwnProperty(obj, prop) {
  return obj && Object.prototype.hasOwnProperty.call(obj, prop) && obj[prop] !== null;
}

/**
 * Helper to produce a property descriptor for a hasMany relationship
 * on a model
 * @param {String} key - the relationship key
 * @param {String} [relType=key] - the relationship type, defaults to
 * the relationship key
 * @returns {Object} a property descriptor for this relationship
 */
function describeHasMany(key, relType = key) {
  return {
    get() {
      let collection = new Collection(relType, [], this.request, this.resolver);

      if (hasOwnProperty(this.data.relationships, key)) {
        let related = this.data.relationships[key];
        let records = related.data.map(({ id }) => this.resolver.getRecord(relType, id));
        let request = this.resolver.getRequest('query', {
          path: `${this.constructor.pathFor(this.id)}/${dasherize(key)}`,
          type: relType
        });

        request = request.timestamp > this.request.timestamp ? request : this.request;
        collection = new Collection(relType, records, request, this.resolver);
      }

      return collection;
    }
  };
}

/**
 * Helper to produce a property descriptor for a belongsTo relationship
 * on a model
 * @param {String} key - the relationship key
 * @param {String} [relType=key] - the relationship type, defaults to
 * the relationship key
 * @returns {Object} a property descriptor for this relationship
 */
function describeBelongsTo(key, relType = key) {
  return {
    get() {
      let Model = this.resolver.modelFor(relType);
      let model = new Model({}, this.request, this.resolver); // eslint-disable-line no-shadow

      if (hasOwnProperty(this.data.relationships, key)) {
        let related = this.data.relationships[key];
        let record = this.resolver.getRecord(relType, related.data.id);
        let request = this.resolver.getRequest('find', { type: relType, id: record.data.id });

        request = request.timestamp > this.request.timestamp ? request : this.request;
        model = new Model(record, request, this.resolver);
      }

      return model;
    }
  };
}

/**
 * Helper to produce a property descriptor for a model's
 * attribute. The model's attribute should return a default value when
 * there is no data to read from. The attribute should also be
 * writeable for serializing the model later on
 * @param {String} key - the attribute key
 * @param {Mixed} [defaultValue] - the default value for this attribute
 * @returns {Object} a property descriptor for this attribute
 */
function describeAttribute(key, defaultValue) {
  return {
    configurable: true,
    enumerable: true,
    get() {
      return this.data && hasOwnProperty(this.data.attributes, key)
        ? this.data.attributes[key]
        : defaultValue;
    },
    set(value) {
      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: true,
        writable: true,
        value
      });
    }
  };
}

/**
 * A class decorator for creating a resource model to be used with the
 * resolver when accessing JSON API data
 * @param {String} type - the model's type, defaults to the lowercase,
 * pluralized class name
 * @param {String} path - the resource path, defaults to `/${type}`
 * @returns {Class} the new model class for a particular resource type
 */
export default function model({ type, path } = {}) {
  return (Class) => {
    let modelType = type || pluralize(Class.name).toLowerCase();
    let modelPath = path || `/${modelType}`;

    let instance = new Class();
    let properties = Object.getOwnPropertyNames(instance);
    let relTypes = {};

    // strip the constructor so not to override the BaseModel constructor
    // eslint-disable-next-line no-unused-vars
    let { constructor, ...proto } = Object.getOwnPropertyDescriptors(Class.prototype);

    for (let i = 0, l = properties.length; i < l; i++) {
      let key = properties[i];
      let value = instance[key];

      if (value && hasOwnProperty(value, '_hasMany')) {
        proto[key] = describeHasMany(key, value._hasMany);
        relTypes[key] = value._hasMany || key;
      } else if (value && hasOwnProperty(value, '_belongsTo')) {
        proto[key] = describeBelongsTo(key, value._belongsTo);
        relTypes[key] = value._belongsTo || key;
      } else {
        proto[key] = describeAttribute(key, value);
      }
    }

    class Model extends BaseModel {
      static type = modelType;
      static path = modelPath;
      static relTypes = relTypes;
    }

    Object.defineProperty(Model, 'name', { value: `${Class.name}Model` });
    Object.defineProperties(Model.prototype, proto);

    return Model;
  };
}

/**
 * Helper for declaring hasMany relationships on a model's definition class
 * @param {String} [type] - the relationship's resource type
 * @returns {Object} a special object used during the model class
 * creation in the model decorator above
 */
export function hasMany(type) {
  return { _hasMany: type };
}

/**
 * Helper for declaring belongsTo relationships on a model's definition class
 * @param {String} [type] - the relationship's resource type
 * @returns {Object} a special object used during the model class
 * creation in the model decorator above
 */
export function belongsTo(type) {
  return { _belongsTo: type };
}
