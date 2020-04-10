export const POST_KB_CREDENTIALS_FAILURE = 'POST_KB_CREDENTIALS_FAILURE';

export const postKBCredentialsFailure = payload => ({
  type: POST_KB_CREDENTIALS_FAILURE,
  payload,
});
