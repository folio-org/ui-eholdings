export const DELETE_KB_CREDENTIALS_USER_FAILURE = 'DELETE_KB_CREDENTIALS_USER_FAILURE';

export const deleteKBCredentialsUserFailure = ({ errors }) => ({
  type: DELETE_KB_CREDENTIALS_USER_FAILURE,
  payload: errors,
});
