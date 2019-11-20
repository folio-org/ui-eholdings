export const GET_AGREEMENTS = 'GET_AGREEMENTS';

export function getAgreements(refId) {
  return {
    type: GET_AGREEMENTS,
    payload: {
      refId,
    },
  };
}
