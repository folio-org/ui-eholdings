/**
 * Helper to merge incoming `relationship` information non-
 * destructively.  Relationship data held in the store will not
 * be overwritten with empty data: only by new data.
 * @param {Object} existing - `relationship` data from a record in the store
 * @param {Object} incoming - `relationship` data from an incoming request
 * @returns {Object} safely merged relationship data fit to be persisted
 */

// eslint-disable-next-line import/prefer-default-export
export function mergeRelationships(existing, incoming) {
  if (!incoming) { return existing; }

  let mergedRelationships = {};

  for (let recordType in incoming) {
    if (incoming[recordType] && incoming[recordType].data) {
      mergedRelationships[recordType] = incoming[recordType];
    } else {
      mergedRelationships[recordType] = existing[recordType] || {};
    }
  }

  return mergedRelationships;
}
