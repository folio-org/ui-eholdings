import entityTagsActionTypes from '../constants/entityTagsActionTypes';

export default function updateEntityTags(type, payload, path) {
  return {
    type: entityTagsActionTypes.UPDATE_ENTITY_TAGS,
    data: {
      type,
      path,
      params: { id: payload.id },
      timestamp: Date.now()
    },
    payload: payload.payload
  };
}
