import PropTypes from 'prop-types';

export default PropTypes.shape({
  data: PropTypes.object.isRequired,
  errors: PropTypes.array.isRequired,
  isClientIdFailed: PropTypes.bool.isRequired,
  isClientIdLoaded: PropTypes.bool.isRequired,
  isClientIdLoading: PropTypes.bool.isRequired,
  isFailed: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isPresent: PropTypes.bool.isRequired,
  isUpdated: PropTypes.bool.isRequired,
}).isRequired;
