import PropTypes from 'prop-types';

const CostPerUseShape = PropTypes.shape({
  attributes: PropTypes.shape({
    analysis: PropTypes.shape({
      cost: PropTypes.number.isRequired,
      costPerUse: PropTypes.number.isRequired,
      usage: PropTypes.number.isRequired,
    }).isRequired,
    parameters: PropTypes.shape({
      currency: PropTypes.string.isRequired,
      startMonth: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
});

const CostPerUseReduxStateShape = PropTypes.shape({
  data: CostPerUseShape,
  errors: PropTypes.array.isRequired,
  isFailed: PropTypes.bool.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
});

export default {
  CostPerUseShape,
  CostPerUseReduxStateShape,
};
