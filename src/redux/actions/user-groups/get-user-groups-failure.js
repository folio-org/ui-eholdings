export const GET_USER_GROUPS_FAILURE = 'GET_USER_GROUPS_FAILURE';

export const getUserGroupsFailure = ({ errors }) => ({
  type: GET_USER_GROUPS_FAILURE,
  payload: errors,
});
