export const GET_AGREEMENTS = 'GET_AGREEMENTS';

export function getAgreements(referenceId) {
  return {
    type: GET_AGREEMENTS,
    payload: {
      referenceId,
      isLoading: true,
    },
  };
}
