import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import {
  useIntl,
} from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import { Select } from '@folio/stripes/components';
import styles from './root-proxy-select-field.css';

const RootProxySelectField = ({ proxyTypes }) => {
  const intl = useIntl();
  const stripes = useStripes();
  const label = intl.formatMessage({ id: 'ui-eholdings.settings.rootProxy.server' });

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
        label={label}
        aria-label={label}
        disabled={!stripes.hasPerm('ui-eholdings.settings.root-proxy.edit')}
        data-testid="root-proxy-select-field"
      >
        {options}
      </Field>
    </div>
  );
};

RootProxySelectField.propTypes = {
  proxyTypes: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape({
      attributes: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      }),
    })),
  }).isRequired,
};

export default RootProxySelectField;
