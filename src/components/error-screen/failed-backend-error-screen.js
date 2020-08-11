import React from 'react';
import { FormattedMessage } from 'react-intl';

import { KeyValue } from '@folio/stripes/components';
import styles from './error-screen.css';

export default function FailedBackendErrorScreen() {
  return (
    <div className={styles['eholdings-back-end-error']} data-test-eholdings-application-rejected>
      <KeyValue label={<FormattedMessage id="ui-eholdings.error" />}>
        <h1><FormattedMessage id="ui-eholdings.server.errors.failedBackend" /></h1>
      </KeyValue>
      <p>
        <FormattedMessage
          id="ui-eholdings.server.errors.errorDuringFetch"
          values={{
            a: chunks => (
              <a href="https://connect.ebsco.com">{chunks}</a>
            ),
          }}
        />
      </p>
    </div>
  );
}
