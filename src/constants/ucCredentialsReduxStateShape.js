import PropTypes from 'prop-types';

export default PropTypes.shape({
  errors: PropTypes.array.isRequired,
  isFailed: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isPresent: PropTypes.bool.isRequired,
  isUpdated: PropTypes.bool.isRequired,
}).isRequired;
