export const GET_CURRENCIES_FAILURE = 'GET_CURRENCIES_FAILURE';

export const getCurrenciesFailure = payload => ({
  type: GET_CURRENCIES_FAILURE,
  payload,
});
