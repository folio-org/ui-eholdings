import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { Select } from '@folio/stripes-components';
import styles from './root-proxy-select-field.css';

export default function RootProxySelectField({ proxyTypes }) {
  let proxyTypesRecords = proxyTypes.resolver.state.proxyTypes.records;
  let options = [];

  if (proxyTypesRecords) {
    for (let proxyTypesRecord in proxyTypesRecords) {
      if (Object.prototype.hasOwnProperty.call(proxyTypesRecords, proxyTypesRecord)) {
        options.push({ label: proxyTypesRecords[proxyTypesRecord].attributes.name,
          value: proxyTypesRecords[proxyTypesRecord].attributes.id });
      }
    }
  }

  return (
    <div
      data-test-eholdings-root-proxy-select-field
      className={styles['root-proxy-select-field']}
    >
      <Field
        id="eholdings-settings-root-proxy-server"
        name="rootProxyServer"
        component={Select}
        dataOptions={options}
        label="Root Proxy Server"
      />
    </div>
  );
}

RootProxySelectField.propTypes = {
  proxyTypes: PropTypes.object.isRequired
};
