export const GET_ROOT_PROXY = 'GET_ROOT_PROXY';

export function getRootProxy(credentialId) {
  return {
    type: GET_ROOT_PROXY,
    payload: credentialId,
  };
}
