export const UPDATE_CUSTOM_LABELS_FAILURE = 'UPDATE_CUSTOM_LABELS_FAILURE';

export function updateCustomLabelsFailure(payload) {
  return {
    type: UPDATE_CUSTOM_LABELS_FAILURE,
    payload,
  };
}
