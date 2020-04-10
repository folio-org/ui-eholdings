export const PUT_KB_CREDENTIALS_FAILURE = 'PUT_KB_CREDENTIALS_FAILURE';

export const putKBCredentialsFailure = ({ errors }) => ({
  type: PUT_KB_CREDENTIALS_FAILURE,
  payload: errors,
});
