import React from 'react';
import { KeyValue } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import styles from './error-screen.css';

export default function NoBackendErrorScreen() {
  return (
    <div className={styles['eholdings-back-end-error']} data-test-eholdings-no-backend>
      <KeyValue label={<FormattedMessage id="ui-eholdings.error" />}>
        <h1><FormattedMessage id="ui-eholdings.server.errors.noKbDetected" /></h1>
      </KeyValue>
      <p><FormattedMessage id="ui-eholdings.server.errors.kbRequired" /></p>
      <p><FormattedMessage id="ui-eholdings.server.errors.installBackend" /></p>
    </div>
  );
}
