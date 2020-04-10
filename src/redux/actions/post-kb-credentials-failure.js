export const POST_KB_CREDENTIALS_FAILURE = 'POST_KB_CREDENTIALS_FAILURE';

export const postKBCredentialsFailure = ({ errors }) => ({
  type: POST_KB_CREDENTIALS_FAILURE,
  payload: errors,
});
