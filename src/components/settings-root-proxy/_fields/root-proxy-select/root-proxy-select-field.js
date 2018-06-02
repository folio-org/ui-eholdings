import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { Select } from '@folio/stripes-components';
import styles from './root-proxy-select-field.css';

export default function RootProxySelectField({ proxyTypes }) {
  let rootProxyRecords = proxyTypes.resolver.state.proxyTypes.records;
  let options = [];

  if (rootProxyRecords) {
    for (let rootProxyRecord in rootProxyRecords) {
      if (Object.prototype.hasOwnProperty.call(rootProxyRecords, rootProxyRecord)) {
        options.push({ label: rootProxyRecords[rootProxyRecord].attributes.name,
          value: rootProxyRecords[rootProxyRecord].attributes.id });
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
        label="Root Proxy Server"
        dataOptions={options}
      />
    </div>
  );
}

RootProxySelectField.propTypes = {
  proxyTypes: PropTypes.object.isRequired
};
