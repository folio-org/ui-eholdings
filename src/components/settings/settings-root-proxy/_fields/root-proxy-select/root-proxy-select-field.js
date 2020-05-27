import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Select } from '@folio/stripes/components';
import styles from './root-proxy-select-field.css';

function RootProxySelectField({ proxyTypes }) {
  if (!proxyTypes?.items?.length) {
    return null;
  }

  const options = proxyTypes.items.map((proxyType) => {
    return (
      <option
        key={proxyType.attributes.id}
        value={proxyType.attributes.id}
      >
        {proxyType.attributes.name}
      </option>
    );
  });

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
