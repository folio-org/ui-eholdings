export const GET_AGREEMENTS_FAILURE = 'GET_AGREEMENTS_FAILURE';

export function getAgreementsFailure(payload) {
  return {
    type: GET_AGREEMENTS_FAILURE,
    payload,
  };
}
