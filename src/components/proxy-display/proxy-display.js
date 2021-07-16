import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  Icon,
} from '@folio/stripes/components';

const ProxyDisplay = ({
  proxy,
  proxyTypesRecords,
  inheritedProxyId,
}) => {
  if (proxyTypesRecords && proxy?.id && inheritedProxyId) {
    const proxyId = proxy.id;
    const selectedValue = proxyTypesRecords[Object.keys(proxyTypesRecords).find(key => key === proxyId)];
    const name = selectedValue.attributes.name;
    const checkIfInherited = inheritedProxyId === proxyId;

    return (
      <KeyValue label={<FormattedMessage id="ui-eholdings.proxy" />}>
        <div
          id="proxy-display"
          data-test-eholdings-details-proxy
        >
          {checkIfInherited
            ? (
              <FormattedMessage
                id="ui-eholdings.proxy.inherited"
                values={{ proxy: name }}
              />
            )
            : name
          }
        </div>
      </KeyValue>
    );
  }

  return <Icon icon="spinner-ellipsis" />;
};

ProxyDisplay.propTypes = {
  inheritedProxyId: PropTypes.string.isRequired,
  proxy: PropTypes.shape({
    id: PropTypes.string.isRequired,
    inherited: PropTypes.bool.isRequired,
  }).isRequired,
  proxyTypesRecords: PropTypes.objectOf(PropTypes.shape({
    attributes: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      urlMask: PropTypes.string.isRequired,
    }).isRequired,
    id: PropTypes.string.isRequired,
    isLoaded: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
  })).isRequired,
};

export default ProxyDisplay;
