import { foldl, append } from 'funcadelic';

/**
 * Helper to merge incoming `relationship` information non-
 * destructively.  Relationship data held in the store will not
 * be overwritten with empty data: only by new data.
 *
 * @param {Object} existing - `relationship` data from a record in the store
 * @param {Object} incoming - `relationship` data from an incoming request
 * @returns {Object} safely merged relationship data fit to be persisted
 */
export function mergeRelationships(existing, incoming) {
  if (!incoming) { return existing; }

  return foldl((relationships, { key: recordType, value: relationshipData }) => {
    if (relationshipData && relationshipData.data) {
      return append(relationships, { [recordType]: relationshipData });
    } else {
      return append(relationships, { [recordType]: existing[recordType] || {} });
    }
  }, {}, incoming);
}

/**
 * Helper to merge incoming `attribute` information non-
 * destructively. If an attribute is defined, it will be written to
 * the store; if undefined, the store's value (if any) will persist.
 *
 * @param {Object} existing - attributes from a record in the store
 * @param {Object} incoming - attributes from an incoming request
 * @returns {Object} safely merged attributes fit to be persisted
 */
export function mergeAttributes(existing, incoming) {
  if (!incoming) { return existing; }

  return append(existing, incoming);
}

/**
 * Helper to format tags data retrieved from resolved
 * request according to JSON:API specification
 * @param {Object} request - the request state object associated with
 * the request being resolved
 * @param {Object} body - returned body
 * @returns {Object|Array} tags data object or array formatted according to JSON:API
 */
export const getTagsData = (request, body) => {
  if (!body.tags) {
    return {
      type: request.resource,
      id: body.id,
      attributes: body,
    };
  }

  return body.tags.map((tag) => ({
    id: tag.id,
    type: request.resource,
    attributes: tag,
  }));
};

/**
 * Helper for creating request state objects
 * @param {String} type - one of 'query', 'find', or 'update'
 * @param {Number} data.timestamp - the action timestamp
 * @param {String} data.type - the resource type
 * @param {Object} data.params - request params
 */
export const makeRequest = (type, data) => {
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
export const getRecord = (store, id) => (
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
export const reduceData = (type, state, fn) => {
  const store = state[type] || {
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
export const formatErrors = (errors) => {
  const format = (err) => {
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
export const getChangedAttributes = (oldData, newData) => {
  const diffData = Object.create(null);
  const newDataKeys = Object.keys(newData);

  for (let i = 0, length = newDataKeys.length; i < length; i++) {
    const key = newDataKeys[i];
    if (oldData[key] !== newData[key]) {
      diffData[key] = {
        prev: oldData[key],
        next: newData[key]
      };
    }
  }

  return diffData;
};
