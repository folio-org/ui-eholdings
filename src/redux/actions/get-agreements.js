export const GET_AGREEMENTS = 'GET_AGREEMENTS';

export function getAgreements(payload) {
  return {
    type: GET_AGREEMENTS,
    payload: {
      ...payload,
      isLoading: true,
    },
  };
}
