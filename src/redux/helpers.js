import { foldl, append } from 'funcadelic';

/**
 * Helper to merge incoming `relationship` information non-
 * destructively.  Relationship data held in the store will not
 * be overwritten with empty data: only by new data.
 *
 * NOTE: for now, this is specific to `relationship` keys in the store, and so
 * it may seem strange that it lives in a generic 'helpers' file all by itself.
 * I do not make cuts before they're required, but it seems imminent that this
 * pattern will be applied to other areas of the store.  Pulling in the FP
 * power of Funcadelic here will allow us to extract common logical operations like
 * this one and genericize them to work against complex data structures like
 * the store.
 *
 * @param {Object} existing - `relationship` data from a record in the store
 * @param {Object} incoming - `relationship` data from an incoming request
 * @returns {Object} safely merged relationship data fit to be persisted
 */

// eslint-disable-next-line import/prefer-default-export
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
