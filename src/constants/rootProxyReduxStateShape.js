import PropTypes from 'prop-types';

const RootProxyShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  attributes: PropTypes.shape({
    id: PropTypes.string.isRequired,
    proxyTypeId: PropTypes.string.isRequired,
  }).isRequired,
});

const RootProxyReduxStateShape = PropTypes.shape({
  isLoading: PropTypes.bool.isRequired,
  isFailed: PropTypes.bool.isRequired,
  data: RootProxyShape.isRequired,
  errors: PropTypes.array.isRequired,
  isUpdated: PropTypes.bool.isRequired,
});

export default {
  RootProxyShape,
  RootProxyReduxStateShape,
};
