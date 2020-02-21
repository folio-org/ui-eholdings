export const DELETE_ACCESS_TYPE_FAILURE = 'DELETE_ACCESS_TYPE_FAILURE';

export function deleteAccessTypeFailure({ errors }) {
  return {
    type: DELETE_ACCESS_TYPE_FAILURE,
    payload: errors,
  };
}
