export const GET_COST_PER_USE_PACKAGE_TITLES = 'GET_COST_PER_USE_PACKAGE_TITLES';

export const getCostPerUsePackageTitles = (packageId, filterData, loadMore) => ({
  type: GET_COST_PER_USE_PACKAGE_TITLES,
  payload: {
    id: packageId,
    filterData,
    loadMore,
  },
});
