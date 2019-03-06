export const GET_AGREEMENTS_SUCCESS = 'GET_AGREEMENTS_SUCCESS';

export function getAgreementsSuccess(payload) {
  return {
    type: GET_AGREEMENTS_SUCCESS,
    payload: {
      ...payload,
      isLoading: false,
    },
  };
};