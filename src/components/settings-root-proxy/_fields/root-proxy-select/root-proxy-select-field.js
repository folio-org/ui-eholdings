import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { intlShape, injectIntl } from 'react-intl';

import { Select } from '@folio/stripes/components';
import styles from './root-proxy-select-field.css';

function RootProxySelectField({ proxyTypes, intl }) {
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
        label={intl.formatMessage({ id: 'ui-eholdings.settings.rootProxy.server' })}
      />
    </div>
  );
}

RootProxySelectField.propTypes = {
  intl: intlShape.isRequired,
  proxyTypes: PropTypes.object.isRequired
};

export default injectIntl(RootProxySelectField);
