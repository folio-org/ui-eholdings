export const UPDATE_ACCESS_TYPE_SUCCESS = 'UPDATE_ACCESS_TYPE_SUCCESS';

export function updateAccessTypeSuccess(payload) {
  return {
    type: UPDATE_ACCESS_TYPE_SUCCESS,
    payload,
  };
}
