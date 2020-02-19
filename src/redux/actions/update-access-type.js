export const UPDATE_ACCESS_TYPE = 'UPDATE_ACCESS_TYPE';

export function updateAccessType(payload) {
  return {
    type: UPDATE_ACCESS_TYPE,
    payload,
  };
}
