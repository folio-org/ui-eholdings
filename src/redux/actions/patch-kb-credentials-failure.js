export const PATCH_KB_CREDENTIALS_FAILURE = 'PATCH_KB_CREDENTIALS_FAILURE';

export const patchKBCredentialsFailure = ({ errors }) => ({
  type: PATCH_KB_CREDENTIALS_FAILURE,
  payload: errors,
});
