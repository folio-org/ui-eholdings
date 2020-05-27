export const GET_USER_GROUPS_SUCCESS = 'GET_USER_GROUPS_SUCCESS';

export const getUserGroupsSuccess = ({ usergroups }) => ({
  type: GET_USER_GROUPS_SUCCESS,
  payload: usergroups
});
