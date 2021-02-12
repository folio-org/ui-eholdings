export const GET_USAGE_CONSOLIDATION_KEY = 'GET_USAGE_CONSOLIDATION_KEY';

export const getUsageConsolidationKey = credentialId => ({
  type: GET_USAGE_CONSOLIDATION_KEY,
  payload: credentialId,
});
