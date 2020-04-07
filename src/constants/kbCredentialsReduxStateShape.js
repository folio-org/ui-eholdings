import PropTypes from 'prop-types';

const CredentialShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  attributes: PropTypes.shape({
    name: PropTypes.string.isRequired,
    apiKey: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    customerId: PropTypes.string.isRequired,
  }).isRequired,
  metadata: PropTypes.shape({
    createdDate: PropTypes.string.isRequired,
    updatedDate: PropTypes.string.isRequired,
    createdByUserId: PropTypes.string.isRequired,
    updatedByUserId: PropTypes.string,
    createdByUsername: PropTypes.string.isRequired,
    updatedByUsername: PropTypes.string,
  }).isRequired,
});

const KbCredentialsReduxStateShape = PropTypes.shape({
  isLoading: PropTypes.bool.isRequired,
  hasLoaded: PropTypes.bool.isRequired,
  hasFailed: PropTypes.bool.isRequired,
  hasUpdated: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(CredentialShape).isRequired,
  errors: PropTypes.array.isRequired,
});

export default {
  CredentialShape,
  KbCredentialsReduxStateShape,
};
