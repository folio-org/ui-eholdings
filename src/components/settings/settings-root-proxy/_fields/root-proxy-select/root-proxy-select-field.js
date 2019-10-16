import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Select } from '@folio/stripes/components';
import styles from './root-proxy-select-field.css';

function RootProxySelectField({ proxyTypes }) {
  const proxyTypesRecords = proxyTypes.resolver.state.proxyTypes.records;
  const options = [];

  if (proxyTypesRecords) {
    for (const proxyTypesRecord in proxyTypesRecords) {
      if (Object.prototype.hasOwnProperty.call(proxyTypesRecords, proxyTypesRecord)) {
        options.push(
          <option
            key={proxyTypesRecords[proxyTypesRecord].attributes.id}
            value={proxyTypesRecords[proxyTypesRecord].attributes.id}
          >
            {proxyTypesRecords[proxyTypesRecord].attributes.name}
          </option>
        );
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
        label={<FormattedMessage id="ui-eholdings.settings.rootProxy.server" />}
      >
        {options}
      </Field>
    </div>
  );
}

RootProxySelectField.propTypes = {
  proxyTypes: PropTypes.object.isRequired
};

export default RootProxySelectField;
