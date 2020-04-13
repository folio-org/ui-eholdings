export const POST_KB_CREDENTIALS_USER_SUCCESS = 'POST_KB_CREDENTIALS_USER_SUCCESS';

export const postKBCredentialsUserSuccess = userData => ({
  type: POST_KB_CREDENTIALS_USER_SUCCESS,
  payload: userData,
});
