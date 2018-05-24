/**
 * Helper Name Compare function used when sorting results (A-Z in ascending order)
 *
 * Uses the following options from string localeCompare
 *  numeric so that numbers are sorted naturally ( 1 < 2 < 10)
 *  base for a case insensitive sort
 */
export function nameCompare(model, modelCompare) {
  let name = model.attributes.name;
  let compareName = modelCompare.attributes.name;
  if (name && compareName) {
    return name.localeCompare(compareName, undefined, { numeric: true, sensitivity: 'base' });
  }
  return 0;
}

/**
 * Helper Relevance Compare function used when sorting results.
 *
 * Simulates sorting results by relevance
 * Results contains the highest number of words from original query appear earlier in results
 * Results containing the same number of words from original query use default nameCompare
 *
 */
export function relevanceCompare(query) {
  return function RelSort(model, modelCompare) {
    let name = model.attributes.name;
    let compareName = modelCompare.attributes.name;
    if (name && compareName) {
      let words = query.split(' ');
      words.push(query);
      let modelCount = words.reduce((total, word) => {
        return name.toLowerCase().includes(word) ? total + 1 : total;
      }, 0);
      let modelCompareCount = words.reduce((total, word) => {
        return compareName.toLowerCase().includes(word) ? total + 1 : total;
      }, 0);
      if (modelCount !== modelCompareCount) {
        return modelCount < modelCompareCount;
      }

      return nameCompare(model, modelCompare);
    }
    return 0;
  };
}
/**
 * Helper function returns query based on request and resource type
 * @param {String} resourceType - resource type (titles, providers, packages)
 * @param {Object} req - request object
 * @returns {String} query - lower case query string
 */
export function getQuery(resourceType, req) {
  if (resourceType === 'titles') {
    let name = req.queryParams['filter[name]'];
    let isxn = req.queryParams['filter[isxn]'];
    let subject = req.queryParams['filter[subject]'];
    let publisher = req.queryParams['filter[publisher]'];

    if (name) {
      return name.toLowerCase();
    } else if (isxn) {
      return isxn.toLowerCase();
    } else if (subject) {
      return subject.toLowerCase();
    } else if (publisher) {
      return publisher.toLowerCase();
    } else {
      return '';
    }
  } else if (req.queryParams.q) {
    return req.queryParams.q.toLowerCase();
  } else {
    return null;
  }
}
/**
 * Helper function which tests a string to determine if it includes
 * any words found within a query string.
 */
export function includesWords(testString, query) {
  if (testString && query) {
    return query.toLowerCase().split(' ').some(w => testString.toLowerCase().includes(w));
  } else { return false; }
}
/**
 * Helper for creating a search route for a resource type.
 *
 * Currently, our real backend omits some fields for search
 * results. For this reason, this route helper uses a *List serializer
 * for the resource type.
 *
 * @param {String} resourceType - resource type's model name
 * @param {Function} filter - filter function specific to this resource
 * @returns {Function} route handler for a search route of this
 * resource type
 */
export function searchRouteFor(resourceType, filter) {
  return function (schema, req) { // eslint-disable-line func-names
    let page = Math.max(parseInt(req.queryParams.page || 1, 10), 1);
    let count = parseInt(req.queryParams.count || 25, 10);
    let offset = (page - 1) * count;

    let collection = schema[resourceType];
    // `resourceType` is typically pluralized, the serializer is not
    let serializerType = `${resourceType.slice(0, -1)}-list`;
    let json = this.serialize(collection.all().filter((model) => {
      return filter(model, req);
    }), serializerType);

    json.meta = { totalResults: json.data.length };

    let sort = req.queryParams.sort;
    let query = getQuery(resourceType, req);

    if (sort && sort === 'name') {
      json.data = json.data.sort(nameCompare);
    } else if (query) {
      json.data = json.data.sort(relevanceCompare(query));
    }

    json.data = json.data.slice(offset, offset + count);
    return json;
  };
}

/**
 * Helper for creating a nested resource route. Currently only accepts
 * page and count params.
 * @param {String} foreignKey - parent resource foreign key prefix
 * @param {String} resourceType - nested resource's model name
 * @param {Function} filter - filter function specific to this resource
 * @returns {Function} route handler for a nested resource
 */
export function nestedResourceRouteFor(foreignKey, resourceType, filter = () => true) {
  return function (schema, req) { // eslint-disable-line func-names
    let page = Math.max(parseInt(req.queryParams.page || 1, 10), 1);
    let count = parseInt(req.queryParams.count || 25, 10);
    let offset = (page - 1) * count;

    let json = this.serialize(schema[resourceType].where({
      [`${foreignKey}Id`]: req.params.id
    }).filter((model) => filter(model, req)));

    let sort = req.queryParams.sort;
    let query = getQuery(resourceType, req);

    if (sort && sort === 'name') {
      json.data = json.data.sort(nameCompare);
    } else if (query) {
      json.data = json.data.sort(relevanceCompare(query));
    }

    json.meta = { totalResults: json.data.length };
    json.data = json.data.slice(offset, offset + count);
    return json;
  };
}
