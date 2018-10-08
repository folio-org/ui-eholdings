import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { KeyValue, Icon } from '@folio/stripes/components';

export default function ProxyDisplay({ model, proxyTypes, inheritedProxyId }) {
  let proxyTypesRecords = proxyTypes.resolver.state.proxyTypes.records;

  if (proxyTypesRecords && model.proxy && model.proxy.id && inheritedProxyId) {
    let proxyId = model.proxy.id;
    let selectedValue = proxyTypesRecords[Object.keys(proxyTypesRecords).find(key => key.toLowerCase() === proxyId.toLowerCase())];
    let name = selectedValue.attributes.name;
    let checkIfInherited = inheritedProxyId.toLowerCase() === proxyId.toLowerCase();

    return (
      <KeyValue label={<FormattedMessage id="ui-eholdings.proxy" />}>
        <div data-test-eholdings-details-proxy>
          {checkIfInherited ?
            (<FormattedMessage id="ui-eholdings.proxy.inherited" values={{ proxy: name }} />) :
            `${name}`}
        </div>
      </KeyValue>
    );
  } else {
    return (
      <Icon icon="spinner-ellipsis" />
    );
  }
}

ProxyDisplay.propTypes = {
  model: PropTypes.object.isRequired,
  proxyTypes: PropTypes.object.isRequired
};
