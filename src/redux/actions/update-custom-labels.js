export const UPDATE_CUSTOM_LABELS = 'UPDATE_CUSTOM_LABELS';

export function updateCustomLabels(payload) {
  return {
    type: UPDATE_CUSTOM_LABELS,
    payload,
  };
}
