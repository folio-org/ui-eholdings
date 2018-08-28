import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { KeyValue } from '@folio/stripes-components';

export default function ProxyDisplay({ model, proxyTypes }) {
  let proxyTypeRecords = proxyTypes.resolver.state.proxyTypes && proxyTypes.resolver.state.proxyTypes.records;
  let name = proxyTypeRecords[model.proxy.id] && proxyTypeRecords[model.proxy.id].attributes.name;

  return (
    <KeyValue label={<FormattedMessage id="ui-eholdings.resource.proxy" />}>
      <div data-test-eholdings-resource-proxy>
        {model.proxy.inherited ?
          (<FormattedMessage id="ui-eholdings.resource.proxy.inherited" values={{ proxy: name }} />) :
          `${name}`}
      </div>
    </KeyValue>
  );
}

ProxyDisplay.propTypes = {
  model: PropTypes.object.isRequired,
  proxyTypes: PropTypes.object.isRequired,
};
