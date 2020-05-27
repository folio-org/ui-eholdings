export const GET_ROOT_PROXY_FAILURE = 'GET_ROOT_PROXY_FAILURE';

export function getRootProxyFailure({ errors }) {
  return {
    type: GET_ROOT_PROXY_FAILURE,
    payload: errors,
  };
}
