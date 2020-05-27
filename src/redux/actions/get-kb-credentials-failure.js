export const GET_KB_CREDENTIALS_FAILURE = 'getKbCredentialsFailure';

export const getKbCredentialsFailure = ({ errors }) => ({
  type: GET_KB_CREDENTIALS_FAILURE,
  payload: errors,
});
