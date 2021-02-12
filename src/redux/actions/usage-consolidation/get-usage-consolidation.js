export const GET_USAGE_CONSOLIDATION = 'GET_USAGE_CONSOLIDATION';

export const getUsageConsolidation = credentialId => ({
  type: GET_USAGE_CONSOLIDATION,
  payload: credentialId,
});
