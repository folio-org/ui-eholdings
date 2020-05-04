import PropTypes from 'prop-types';

export const accessStatusTypeDataShape = PropTypes.shape({
  attributes: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string.isRequired,
  }).isRequired,
  creator: PropTypes.objectOf(PropTypes.string),
  id: PropTypes.string.isRequired,
  metadata: PropTypes.shape({
    createdByUserId: PropTypes.string.isRequired,
    createdByUsername: PropTypes.string.isRequired,
    createdDate: PropTypes.string.isRequired,
    updatedByUserId: PropTypes.string,
    updatedDate: PropTypes.string,
  }),
  type: PropTypes.string.isRequired,
  updater: PropTypes.objectOf(PropTypes.string),
});

export default PropTypes.shape({
  isDeleted: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  items: PropTypes.shape({
    data: PropTypes.arrayOf(accessStatusTypeDataShape),
  }).isRequired,
});
