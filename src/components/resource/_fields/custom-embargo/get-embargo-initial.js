const getEmbargoInitial = ({ embargoValue, embargoUnit }) => {
  return embargoValue
    ? [{
      embargoValue,
      embargoUnit,
    }]
    : [];
};

export default getEmbargoInitial;
