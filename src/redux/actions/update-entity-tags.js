import entityTagsActionTypes from '../constants/entityTagsActionTypes';

export default function updateEntityTags(type, { id, data }, path) {
  return {
    type: entityTagsActionTypes.UPDATE_ENTITY_TAGS,
    data: {
      type,
      path,
      params: { id },
      timestamp: Date.now()
    },
    payload: { data }
  };
}
