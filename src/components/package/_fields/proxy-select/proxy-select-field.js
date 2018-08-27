import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { intlShape, injectIntl } from 'react-intl';
import { Select } from '@folio/stripes-components';
import styles from './proxy-select-field.css';

function ProxySelectField({ proxyTypes, inheritedProxy, intl }) {
  let proxyTypesRecords = proxyTypes.resolver.state.proxyTypes.records;
  let checkIfInherited = proxyTypeId => (inheritedProxy && inheritedProxy.id && proxyTypeId.toLowerCase() === inheritedProxy.id.toLowerCase());

  let options = proxyTypesRecords && Object.values(proxyTypesRecords)
    .map(proxyType => ({
      label: checkIfInherited(proxyType.id) ?
        intl.formatMessage({ id: 'ui-eholdings.proxy.inherited' }, { proxy: proxyType.attributes.name }) :
        `${proxyType.attributes.name}`,
      value: proxyType.id
    }));

  return (
    <div
      data-test-eholdings-package-proxy-select-field
      className={styles['proxy-select-field']}
    >
      <Field
        id="eholdings-package-proxy-id"
        name="proxyId"
        component={Select}
        dataOptions={options}
        label={intl.formatMessage({ id: 'ui-eholdings.proxy' })}
        disabled={options.length < 2}
      />
    </div>
  );
}

ProxySelectField.propTypes = {
  inheritedProxy: PropTypes.object.isRequired,
  proxyTypes: PropTypes.object.isRequired,
  intl: intlShape.isRequired
};

export default injectIntl(ProxySelectField);
