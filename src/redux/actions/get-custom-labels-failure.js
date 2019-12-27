export const GET_CUSTOM_LABELS_FAILURE = 'GET_CUSTOM_LABELS_FAILURE';

export function getCustomLabelsFailure({ errors }) {
  return {
    type: GET_CUSTOM_LABELS_FAILURE,
    payload: errors,
  };
}
