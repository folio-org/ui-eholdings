import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

export default function ProxyDisplay({ model, proxyTypes }) {
  let proxyTypesRecords = proxyTypes.resolver.state.proxyTypes.records;
  let proxyId = model.proxy.id;

  if (proxyTypesRecords && proxyId) {
    let selectedValue = proxyTypesRecords[Object.keys(proxyTypesRecords).find(key => key.toLowerCase() === proxyId.toLowerCase())];
    let name = selectedValue.attributes.name;

    return (
      <div data-test-eholdings-provider-details-proxy>
        {model.proxy.inherited ? (<span><FormattedMessage id="ui-eholdings.provider.inherited" />&nbsp;-&nbsp;{name}</span>) : `${name}`}
      </div>);
  }
}

ProxyDisplay.propTypes = {
  model: PropTypes.object.isRequired,
  proxyTypes: PropTypes.object.isRequired
};
