export const GET_PROXY_TYPES_SUCCESS = 'GET_PROXY_TYPES_SUCCESS';

export function getProxyTypesSuccess(proxyTypes) {
  return {
    type: GET_PROXY_TYPES_SUCCESS,
    payload: proxyTypes,
  };
}
