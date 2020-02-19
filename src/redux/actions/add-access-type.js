export const ADD_ACCESS_TYPE = 'ADD_ACCESS_TYPE';

export function addAccessType(payload) {
  return {
    type: ADD_ACCESS_TYPE,
    payload,
  };
}
