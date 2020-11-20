export const GET_PACKAGE_COST_PER_USE = 'GET_PACKAGE_COST_PER_USE';

export const getPackageCostPerUse = (packageId, filterData) => ({
  type: GET_PACKAGE_COST_PER_USE,
  payload: {
    packageId,
    filterData,
  },
});
