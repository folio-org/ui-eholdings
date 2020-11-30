export const GET_TITLE_COST_PER_USE = 'GET_TITLE_COST_PER_USE';

export const getTitleCostPerUse = (titleId, filterData) => ({
  type: GET_TITLE_COST_PER_USE,
  payload: {
    titleId,
    filterData,
  },
});
