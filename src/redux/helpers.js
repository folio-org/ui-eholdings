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
