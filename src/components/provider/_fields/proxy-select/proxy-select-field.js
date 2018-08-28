import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { intlShape, injectIntl } from 'react-intl';

import { Select } from '@folio/stripes-components';
import styles from './proxy-select-field.css';

function ProxySelectField({ proxyTypes, rootProxy, intl }) {
  let proxyTypesRecords = proxyTypes.resolver.state.proxyTypes.records;
  let rootProxyId = rootProxy.data.attributes.proxyTypeId.toLowerCase();
  let options = [];

  if (proxyTypesRecords && rootProxyId) {
    for (let proxyTypesRecord in proxyTypesRecords) {
      if (Object.prototype.hasOwnProperty.call(proxyTypesRecords, proxyTypesRecord)) {
        let selectValue = proxyTypesRecords[proxyTypesRecord].attributes.id.toLowerCase();
        if (rootProxyId === selectValue) {
          options.push({ label: `${intl.formatMessage({ id: 'ui-eholdings.provider.inherited' })}-${proxyTypesRecords[proxyTypesRecord].attributes.name}`,
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
        label={intl.formatMessage({ id: 'ui-eholdings.provider.proxy' })}
        disabled={options.length < 2}
      />
    </div>
  );
}

ProxySelectField.propTypes = {
  proxyTypes: PropTypes.object.isRequired,
  rootProxy: PropTypes.object.isRequired,
  intl: intlShape.isRequired
};

export default injectIntl(ProxySelectField);
