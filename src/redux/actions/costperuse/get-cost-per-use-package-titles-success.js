export const GET_COST_PER_USE_PACKAGE_TITLES_SUCCESS = 'GET_COST_PER_USE_PACKAGE_TITLES_SUCCESS';

export const getCostPerUsePackageTitlesSuccess = (data, loadMore) => ({
  type: GET_COST_PER_USE_PACKAGE_TITLES_SUCCESS,
  payload: {
    data,
    loadMore,
  },
});
