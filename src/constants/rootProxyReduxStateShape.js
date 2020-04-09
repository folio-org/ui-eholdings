import PropTypes from 'prop-types';

const RootProxyShape = PropTypes.shape({
  attributes: PropTypes.shape({
    id: PropTypes.string.isRequired,
    proxyTypeId: PropTypes.string.isRequired,
  }).isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
});

const RootProxyReduxStateShape = PropTypes.shape({
  data: RootProxyShape.isRequired,
  errors: PropTypes.array.isRequired,
  isFailed: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isUpdated: PropTypes.bool.isRequired,
});

export default {
  RootProxyShape,
  RootProxyReduxStateShape,
};
