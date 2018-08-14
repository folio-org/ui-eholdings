import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { Select } from '@folio/stripes-components';
import styles from './proxy-select-field.css';

export default function ProxySelectField({ proxyTypes, rootProxy }) {
  let proxyTypesRecords = proxyTypes.resolver.state.proxyTypes.records;
  let rootProxyId = rootProxy.data.attributes.proxyTypeId;
  let options = [];

  if (proxyTypesRecords && rootProxyId) {
    for (let proxyTypesRecord in proxyTypesRecords) {
      if (Object.prototype.hasOwnProperty.call(proxyTypesRecords, proxyTypesRecord)) {
        let selectValue = proxyTypesRecords[proxyTypesRecord].attributes.id;
        if (rootProxyId === selectValue) {
          options.push({ label: `Inherited-${proxyTypesRecords[proxyTypesRecord].attributes.name}`,
            value: proxyTypesRecords[proxyTypesRecord].attributes.id });
        } else {
          options.push({ label: proxyTypesRecords[proxyTypesRecord].attributes.name,
            value: proxyTypesRecords[proxyTypesRecord].attributes.id });
        }
      }
    }
  }

  return (
    <div
      data-test-eholdings-provider-proxy-select-field
      className={styles['proxy-select-field']}
    >
      <Field
        id="eholdings-providers-proxy-id"
        name="proxyId"
        component={Select}
        dataOptions={options}
        label="Proxy"
      />
    </div>
  );
}

ProxySelectField.propTypes = {
  proxyTypes: PropTypes.object.isRequired,
  rootProxy: PropTypes.object.isRequired
};
