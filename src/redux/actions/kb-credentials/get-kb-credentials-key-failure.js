export const GET_KB_CREDENTIALS_KEY_FAILURE = 'GET_KB_CREDENTIALS_KEY_FAILURE';

export const getKbCredentialsKeyFailure = ({ errors }) => ({
  type: GET_KB_CREDENTIALS_KEY_FAILURE,
  payload: errors,
});
