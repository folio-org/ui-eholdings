export const GET_AGREEMENTS_SUCCESS = 'GET_AGREEMENTS_SUCCESS';

export function getAgreementsSuccess(agreements) {
  return {
    type: GET_AGREEMENTS_SUCCESS,
    payload: { items: agreements },
  };
}
