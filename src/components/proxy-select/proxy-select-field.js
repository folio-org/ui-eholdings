import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Select } from '@folio/stripes/components';

import { getProxyTypesRecords } from '../utilities';

function ProxySelectField({ proxyTypes, inheritedProxyId }) {
  const proxyTypesRecords = getProxyTypesRecords(proxyTypes);

  const checkIfInherited = proxyTypeId => (inheritedProxyId && inheritedProxyId.toLowerCase() === proxyTypeId.toLowerCase());

  let options = [];

  options = proxyTypesRecords && Object.values(proxyTypesRecords)
    .map(proxyType => (
      <FormattedMessage
        key={proxyType.id}
        id="ui-eholdings.proxy.inherited"
        values={{
          proxy: proxyType.attributes.name
        }}
      >
        {(message) => (
          <option value={proxyType.id}>
            {checkIfInherited(proxyType.id) ? message : `${proxyType.attributes.name}`}
          </option>
        )}
      </FormattedMessage>
    ));

  return (
    <div data-test-eholdings-proxy-select-field>
      <Field
        id="eholdings-proxy-id"
        name="proxyId"
        component={Select}
        label={<FormattedMessage id="ui-eholdings.proxy" />}
        disabled={options.length < 2}
      >
        {options}
      </Field>
    </div>
  );
}

ProxySelectField.propTypes = {
  inheritedProxyId: PropTypes.string.isRequired,
  proxyTypes: PropTypes.object.isRequired
};

export default ProxySelectField;
