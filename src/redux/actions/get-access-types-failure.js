export const GET_ACCESS_TYPES_FAILURE = 'GET_ACCESS_TYPES_FAILURE';

export function getAccessTypesFailure({ errors }) {
  return {
    type: GET_ACCESS_TYPES_FAILURE,
    payload: errors,
  };
}
