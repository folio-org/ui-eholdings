import PropTypes from 'prop-types';

const UsageConsolidationShape = PropTypes.shape({
  credentialsId: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  customerKey: PropTypes.string.isRequired,
  metricType: PropTypes.string,
  platformType: PropTypes.string.isRequired,
  startMonth: PropTypes.string.isRequired,
});

const UsageConsolidationReduxStateShape = PropTypes.shape({
  data: UsageConsolidationShape.isRequired,
  errors: PropTypes.array.isRequired,
  isFailed: PropTypes.bool.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
});

export default {
  UsageConsolidationShape,
  UsageConsolidationReduxStateShape,
};
