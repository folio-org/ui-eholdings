export const UPDATE_ROOT_PROXY_FAILURE = 'UPDATE_ROOT_PROXY_FAILURE';

export function updateRootProxyFailure(payload) {
  return {
    type: UPDATE_ROOT_PROXY_FAILURE,
    payload,
  };
}
