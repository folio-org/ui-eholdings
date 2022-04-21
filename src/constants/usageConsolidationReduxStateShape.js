import PropTypes from 'prop-types';

const UsageConsolidationShape = PropTypes.shape({
  credentialsId: PropTypes.string,
  currency: PropTypes.string,
  customerKey: PropTypes.string,
  metricType: PropTypes.string,
  platformType: PropTypes.string,
  startMonth: PropTypes.string,
});

const UsageConsolidationReduxStateShape = PropTypes.shape({
  data: UsageConsolidationShape.isRequired,
  errors: PropTypes.array.isRequired,
  isFailed: PropTypes.bool.isRequired,
  isKeyFailed: PropTypes.bool.isRequired,
  isKeyLoaded: PropTypes.bool.isRequired,
  isKeyLoading: PropTypes.bool.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
});

export default {
  UsageConsolidationShape,
  UsageConsolidationReduxStateShape,
};
