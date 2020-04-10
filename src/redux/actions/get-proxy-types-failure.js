export const GET_PROXY_TYPES_FAILURE = 'GET_PROXY_TYPES_FAILURE';

export function getProxyTypesFailure({ errors }) {
  return {
    type: GET_PROXY_TYPES_FAILURE,
    payload: errors,
  };
}
