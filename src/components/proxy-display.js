import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  Icon,
} from '@folio/stripes/components';

const ProxyDisplay = ({
  proxy,
  proxyTypes,
  inheritedProxyId,
}) => {
  const proxyTypesRecords = proxyTypes.resolver.state.proxyTypes.records;

  if (proxyTypesRecords && proxy && proxy.id && inheritedProxyId) {
    const proxyId = proxy.id;
    const selectedValue = proxyTypesRecords[Object.keys(proxyTypesRecords)
      .find(key => key.toLowerCase() === proxyId.toLowerCase())];
    const name = selectedValue.attributes.name;
    const checkIfInherited = inheritedProxyId.toLowerCase() === proxyId.toLowerCase();

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
            : `${name}`
          }
        </div>
      </KeyValue>
    );
  } else {
    return (
      <Icon icon="spinner-ellipsis" />
    );
  }
};

ProxyDisplay.propTypes = {
  inheritedProxyId: PropTypes.string,
  proxy: PropTypes.shape({
    id: PropTypes.string,
    inherited: PropTypes.bool,
  }).isRequired,
  proxyTypes: PropTypes.object.isRequired,
};

export default ProxyDisplay;
