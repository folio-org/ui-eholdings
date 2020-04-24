// eslint-disable-next-line max-classes-per-file
import dasherize from 'lodash/kebabCase';
import { pluralize } from 'inflected';
import { qs } from '../components/utilities';
import {
  find,
  query,
  save,
  unload,
  destroy,
  create,
  removeRequests,
} from './data';

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
  constructor({ type, params = {}, path }, resolver) {
    const { page = 1, ...queryParams } = params;
    const { pageSize = 25 } = queryParams;

    this.type = type;
    this.params = params;
    this.path = path;
    this.resolver = resolver;
    this.pages = [];
    this.records = [];
    this.pageSize = parseInt(pageSize, 10);
    this.currentPage = parseInt(page, 10);

    // unique to a specific search regardless of page
    this.key = `${type}::${path}?${qs.stringify(queryParams)}`;
  }

  /**
   * Gets the request and records for a page with the same params used
   * to initialize this collection instance
   * @param {Number} page - the page number
   * @returns {Object} object containing the request and associated records
   */
  getPage(page) {
    if (!this.pages[page]) {
      let request = this.resolver.getRequest('query', {
        type: this.type,
        params: { ...this.params, page },
        path: this.path
      });

      // the first page might not have a page param
      if (!request.timestamp && page === 1) {
        request = this.resolver.getRequest('query', {
          type: this.type,
          params: { ...this.params, page: undefined },
          path: this.path
        });
      }

      const records = request.records.map((id) => {
        return this.resolver.find(this.type, id);
      });

      // cache this page for this instance
      this.pages[page] = { request, records };
    }

    return this.pages[page];
  }

  /**
   * Gets a record at the given read offset
   * @param {Number} offset - zero based read offset
   * @returns {Model} the model for a record at the offset
   */
  getRecord(offset) {
    if (!this.records[offset]) {
      const pageOffset = Math.floor(offset / this.pageSize);
      const recordOffset = offset % this.pageSize;
      const page = this.getPage(pageOffset + 1);
      const record = page.records[recordOffset];

      // the record does not exist, return an empty one
      if (!record) {
        return this.resolver.find(this.type, null);
      }

      // cache this record for this instance
      this.records[offset] = record;
    }

    return this.records[offset];
  }

  /**
   * Caches and returns the first resolved page request for
   * this collection
   * @returns {Object} the request object
   */
  get request() {
    const { page, ...queryParams } = this.params;

    // without including the page param, this will return the last
    // query request for any page of this collection
    const request = this.resolver.getRequest('query', {
      type: this.type,
      params: queryParams,
      path: this.path
    }, req => req.isResolved);

    // cache the request for this instance
    Object.defineProperty(this, 'request', {
      get() { return request; }
    });

    return request;
  }

  /**
   * Gets the first resolved page for this instance to find the total
   * results meta property.
   * @returns {Number}
   */
  get length() {
    return this.request.meta.totalResults || this.records.length;
  }

  /**
   * Caches and returns the calculated total page count
   * @returns {Number} total pages
   */
  get totalPages() {
    const total = Math.ceil(this.length / this.pageSize);

    // cache the total for this instance
    Object.defineProperty(this, 'totalPages', {
      get() { return total; }
    });

    return total;
  }

  /**
   * Maps over the current records or predicted records for this
   * collection instance.
   * @param {Function} callback - called for each record
   * @param {Mixed} ctx - the context to use for the callback
   * @returns {Array} array of mapped records
   */
  map(callback, ctx) {
    let offset = 0;
    let record = this.getRecord(offset);
    const ret = [];

    while (offset < this.length || record.id) {
      ret.push(callback.call(ctx, record, offset));
      offset += 1;
      record = this.getRecord(offset);
    }

    return ret;
  }

  /**
   * Slices the current records for this collection via `getRecord`
   * @param {Number} start - the start index to slice
   * @param {Number} end - the end index to slice
   * @returns {Array} array of records for the range
   */
  slice(start, end) {
    const last = Math.min(end, this.length) - 1;
    const ret = [];

    for (let i = start; i <= last; i++) {
      const record = this.getRecord(i);

      if (record.id) {
        ret.push(record);
      } else {
        break;
      }
    }

    return ret;
  }

  /**
   * True when the current request is pending or when there is no
   * request and no records
   * @returns {Boolean}
   */
  get isLoading() {
    const { request } = this.getPage(this.currentPage);
    const isRequested = !!request.timestamp || !!this.length;
    return request.isPending || !isRequested;
  }

  /**
   * True when any requests have been resolved
   * @returns {Boolean}
   */
  get hasLoaded() {
    return !!this.request.timestamp && !this.request.isPending;
  }

  /**
   * True when any requests have unloaded records; caches it's
   * results for efficiency
   * @returns {Boolean}
   */
  get hasUnloaded() {
    let hasUnloaded = !!this.getPage(this.currentPage).request.hasUnloaded;
    const pageLimit = this.totalPages;
    let page = 1;

    // find the first page up to a page limit with an unloaded record
    while (!hasUnloaded && page < pageLimit) {
      hasUnloaded = !!this.getPage(page).request.hasUnloaded;
      page += 1;
    }

    // cache the result for this instance
    Object.defineProperty(this, 'hasUnloaded', {
      get() { return hasUnloaded; }
    });

    return hasUnloaded;
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
   * Action creator for removing requests of given type for specific model's resource
   */
  static removeRequests(requestType) {
    return removeRequests(this.type, requestType);
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
   * @param {Model} updatedModel - the record's model
   */
  static save(updatedModel) {
    return save(this.type, updatedModel.serialize(), {
      path: this.pathFor(updatedModel.id)
    });
  }

  /**
   * Action creator for creating a record
   * @param {Object} attrs - the record's attributes
   */
  static create(attrs) {
    const newModel = new this.prototype.constructor();
    newModel.data.attributes = attrs;

    return create(this.type, newModel.serialize(), {
      path: this.pathFor()
    });
  }

  /**
   * Action creator for deleting a record
   * @param {Model} modelToDestroy - the record's model
   */
  static destroy(modelToDestroy) {
    return destroy(this.type, modelToDestroy.serialize(), {
      path: this.pathFor(modelToDestroy.id)
    });
  }

  /**
   * Action creator for unloading records
   * @param {Model|Collection} modelOrCollection - the record model or collection
   */
  static unload(modelOrCollection) {
    let ids = [];

    // unload a single model
    if (modelOrCollection instanceof BaseModel) {
      ids = modelOrCollection.id;

    // unload each page of records
    } else if (modelOrCollection instanceof Collection) {
      let page = 1;

      while (page <= modelOrCollection.totalPages) {
        ids = ids.concat(modelOrCollection.getPage(page).request.records);
        page += 1;
      }
    }

    return unload(this.type, ids);
  }

  /**
   * Initialized with the record data and the request state object
   * associated with the record.
   * @param {Object} record - record data from the data store
   * @param {Object} request - the request associated with this record
   * @param {Resolver} resolver - the current resolver instance
   */
  constructor(id, resolver) {
    this.id = id;
    this.resolver = resolver;
    this.data = (resolver && resolver.getRecord(this.type, id)) || {};
  }

  /**
   * Serializes the model to a JSON API payload
   * @returns {Object} JSON API serialized data
   */
  serialize() {
    const data = {
      id: this.id,
      type: this.type,
      attributes: {}
    };

    for (const attr of Object.keys(this.data.attributes)) {
      if (attr !== 'tags') data.attributes[attr] = this[attr];
    }

    return { data };
  }

  /**
   * Lazily looks up a find request for this record
   * @returns {Object} the find request state object
   */
  get request() {
    const request = this.resolver.getRequest('find', {
      type: this.type,
      params: { id: this.id }
    });

    // this will essentially cache this request
    Object.defineProperty(this, 'request', {
      get() { return request; }
    });

    return request;
  }

  /**
   * Lazily looks up an update request for this record
   * @returns {Object} the update request state object
   */
  get update() {
    const update = this.resolver.getRequest('update', {
      type: this.type,
      params: { id: this.id }
    });

    // this will essentially cache this request
    Object.defineProperty(this, 'update', {
      get() { return update; }
    });

    return update;
  }

  /**
   * Lazily looks up an delete request for this record
   * @returns {Object} the delete request state object
   */
  get destroy() {
    const destroyReq = this.resolver.getRequest('destroy', {
      type: this.type,
      params: { id: this.id }
    });

    // this will essentially cache this request
    Object.defineProperty(this, 'destroy', {
      get() { return destroyReq; }
    });

    return destroyReq;
  }

  // simple properties to map type, id, and status

  get type() {
    return this.constructor.type;
  }

  get isLoading() {
    return !!this.data.isLoading;
  }

  get isLoaded() {
    return !!this.data.isLoaded;
  }

  get isSaving() {
    return !!this.data.isSaving;
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
      let collection = new Collection({
        type: relType,
        path: `${this.constructor.pathFor(this.id)}/${dasherize(key)}`
      }, this.resolver);

      if (!collection.length &&
          hasOwnProperty(this.data.relationships, key) &&
          this.data.relationships[key].data) {
        collection = new Collection({ type: relType }, this.resolver);
        collection.records = this.data.relationships[key].data
          .map(({ id }) => this.resolver.find(relType, id));
      }

      return collection;
    }
  };
}

/**
 * Helper to produce a property descriptor for a belongsTo relationship
 * on a model
 *
 * For `belongsTo`, there are two potential locations for relationship data:
 * in the case that related records have been fetched via JSONAPI `include` keyword,
 * the linkage can be found in the `relationships` key, but to link stored records
 * without a `relationship` key we can also examine the record's attributes on the
 * assumption that foreign keys are of the form `datatypeId` (i.e. packageId, providerId, etc.)
 *
 * @param {String} key - the relationship key
 * @param {String} [relType=key] - the relationship type, defaults to
 * the pluralized relationship key
 * @returns {Object} a property descriptor for this relationship
 */
function describeBelongsTo(key, relType = pluralize(key)) {
  return {
    get() {
      const Model = this.resolver.modelFor(relType);
      const relId = `${key}Id`;

      // check for related records first based on `relationship` if it exists
      if (hasOwnProperty(this.data.relationships, key) && this.data.relationships[key].data) {
        return new Model(this.data.relationships[key].data.id, this.resolver);
      // in absence of explicit `relationship` data, check for foreign keys in attributes
      } else if (hasOwnProperty(this.data.attributes, relId) && this.data.attributes[relId]) {
        return new Model(this.data.attributes[relId], this.resolver);
      }

      return new Model(null, this.resolver);
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
    const modelType = type || pluralize(Class.name).toLowerCase();
    const modelPath = path || `/${modelType}`;

    const instance = new Class();
    const properties = Object.getOwnPropertyNames(instance);
    const relTypes = {};

    // strip the constructor so not to override the BaseModel constructor
    const { constructor, ...proto } = Object.getOwnPropertyDescriptors(Class.prototype);

    for (let i = 0, l = properties.length; i < l; i++) {
      const key = properties[i];
      const value = instance[key];

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
