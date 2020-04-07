export const GET_ROOT_PROXY_SUCCESS = 'GET_ROOT_PROXY_SUCCESS';

export function getRootProxySuccess(payload) {
  return {
    type: GET_ROOT_PROXY_SUCCESS,
    payload,
  };
}
