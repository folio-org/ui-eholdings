export const GET_CUSTOM_LABELS = 'GET_CUSTOM_LABELS';

export function getCustomLabels(credentialId) {
  return {
    type: GET_CUSTOM_LABELS,
    payload: credentialId,
  };
}
