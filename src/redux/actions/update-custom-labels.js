export const UPDATE_CUSTOM_LABELS = 'UPDATE_CUSTOM_LABELS';

export function updateCustomLabels(customLabels, credentialId) {
  return {
    type: UPDATE_CUSTOM_LABELS,
    payload: { customLabels, credentialId },
  };
}
