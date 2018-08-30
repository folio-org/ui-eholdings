import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { KeyValue, Icon } from '@folio/stripes-components';

export default function ProxyDisplay({ model, proxyTypes }) {
  let proxyTypesRecords = proxyTypes.resolver.state.proxyTypes.records;
  let proxyId = model.proxy.id;

  if (proxyTypesRecords && proxyId) {
    let selectedValue = proxyTypesRecords[Object.keys(proxyTypesRecords).find(key => key.toLowerCase() === proxyId.toLowerCase())];
    let name = selectedValue.attributes.name;

    return (
      <KeyValue label={<FormattedMessage id="ui-eholdings.proxy" />}>
        <div data-test-eholdings-details-proxy>
          {model.proxy.inherited ?
            (<span><FormattedMessage id="ui-eholdings.proxy.inherited" />&nbsp;-&nbsp;{name}</span>) :
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
