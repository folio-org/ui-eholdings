export const GET_PROXY_TYPES = 'GET_PROXY_TYPES';

export function getProxyTypes(credentialId) {
  return {
    type: GET_PROXY_TYPES,
    payload: credentialId,
  };
}
