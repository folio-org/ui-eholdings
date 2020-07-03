export const PATCH_KB_CREDENTIALS = 'PATCH_KB_CREDENTIALS';

export const patchKBCredentials = (data, credentialId) => ({
  type: PATCH_KB_CREDENTIALS,
  payload: {
    data,
    credentialId,
  },
});
