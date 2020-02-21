export const UPDATE_ACCESS_TYPE_FAILURE = 'UPDATE_ACCESS_TYPE_FAILURE';

export function updateAccessTypeFailure(payload) {
  return {
    type: UPDATE_ACCESS_TYPE_FAILURE,
    payload,
  };
}
