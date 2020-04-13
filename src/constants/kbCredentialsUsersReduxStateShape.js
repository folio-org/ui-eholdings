import PropTypes from 'prop-types';

const kbCredentialsUserShape = PropTypes.shape({
  attributes: PropTypes.shape({
    credentialsId: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string.isRequired,
    middleName: PropTypes.string,
    patronGroup: PropTypes.string.isRequired,
    userName: PropTypes.string,
  }).isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
});

const kbCredentialsUsersReduxStateShape = PropTypes.shape({
  errors: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
  })).isRequired,
  hasFailed: PropTypes.bool.isRequired,
  hasLoaded: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(kbCredentialsUserShape).isRequired,
});

export default {
  kbCredentialsUsersReduxStateShape,
  kbCredentialsUserShape,
};
