export const DELETE_KB_CREDENTIALS_FAILURE = 'DELETE_KB_CREDENTIALS_FAILURE';

export const deleteKBCredentialsFailure = ({ errors }) => ({
  type: DELETE_KB_CREDENTIALS_FAILURE,
  payload: errors,
});
