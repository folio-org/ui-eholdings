export const GET_COST_PER_USE = 'GET_COST_PER_USE';

export const getCostPerUse = (listType, id, filterData) => ({
  type: GET_COST_PER_USE,
  payload: {
    listType,
    id,
    filterData,
  },
});
