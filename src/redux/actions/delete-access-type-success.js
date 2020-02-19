export const DELETE_ACCESS_TYPE_SUCCESS = 'DELETE_ACCESS_TYPE_SUCCESS';

export function deleteAccessTypeSuccess(id) {
  return {
    type: DELETE_ACCESS_TYPE_SUCCESS,
    payload: id,
  };
}
