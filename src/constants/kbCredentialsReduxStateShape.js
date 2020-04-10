import PropTypes from 'prop-types';

const CredentialShape = PropTypes.shape({
  attributes: PropTypes.shape({
    apiKey: PropTypes.string.isRequired,
    customerId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  id: PropTypes.string.isRequired,
  metadata: PropTypes.shape({
    createdByUserId: PropTypes.string.isRequired,
    createdByUsername: PropTypes.string.isRequired,
    createdDate: PropTypes.string.isRequired,
    updatedByUserId: PropTypes.string,
    updatedByUsername: PropTypes.string,
    updatedDate: PropTypes.string.isRequired,
  }).isRequired,
  type: PropTypes.string.isRequired,
});

const KbCredentialsReduxStateShape = PropTypes.shape({
  errors: PropTypes.array.isRequired,
  hasFailed: PropTypes.bool.isRequired,
  hasLoaded: PropTypes.bool.isRequired,
  hasUpdated: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(CredentialShape).isRequired,
});

export default {
  CredentialShape,
  KbCredentialsReduxStateShape,
};
