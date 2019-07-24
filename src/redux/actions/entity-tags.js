import actionTypes from '../constants/actionTypes';

const tagActions = {
  updateEntityTags: (payload) => {
    return {
      type: actionTypes.UPDATE_ENTITY_TAGS,
      payload,
    };
  },
  updateEntityTagsSuccess: () => {
    debugger;
    return {
      type: actionTypes.UPDATE_ENTITY_TAGS_SUCCESS,
    };
  },
  updateEntityTagsFailure: (payload) => {
    debugger;
    return {
      type: actionTypes.UPDATE_ENTITY_TAGS,
      payload,
    };
  },
};

export default tagActions;
