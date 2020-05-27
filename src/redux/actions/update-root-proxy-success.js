export const UPDATE_ROOT_PROXY_SUCCESS = 'UPDATE_ROOT_PROXY_SUCCESS';

export function updateRootProxySuccess(payload) {
  return {
    type: UPDATE_ROOT_PROXY_SUCCESS,
    payload,
  };
}
