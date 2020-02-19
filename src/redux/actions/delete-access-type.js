export const DELETE_ACCESS_TYPE = 'DELETE_ACCESS_TYPE';

export function deleteAccessType(id) {
  return {
    type: DELETE_ACCESS_TYPE,
    payload: { id },
  };
}
