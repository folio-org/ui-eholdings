export const GET_ACCESS_TYPES_SUCCESS = 'GET_ACCESS_TYPES_SUCCESS';

export function getAccessTypesSuccess(accessTypes) {
  return {
    type: GET_ACCESS_TYPES_SUCCESS,
    payload: { accessTypes },
  };
}
