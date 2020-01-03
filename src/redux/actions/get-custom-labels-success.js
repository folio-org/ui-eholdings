export const GET_CUSTOM_LABELS_SUCCESS = 'GET_CUSTOM_LABELS_SUCCESS';

export function getCustomLabelsSuccess(customLabels) {
  return {
    type: GET_CUSTOM_LABELS_SUCCESS,
    payload: { customLabels },
  };
}
