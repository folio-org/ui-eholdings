import React from 'react';
import { FormattedMessage } from 'react-intl';

import { KeyValue } from '@folio/stripes/components';
import styles from './error-screen.css';

export default function ApiLimitExceededErrorScreen() {
  return (
    <div className={styles['eholdings-back-end-error']} data-test-eholdings-api-limit-exceeded>
      <KeyValue label={<FormattedMessage id="ui-eholdings.error" />}>
        <h1><FormattedMessage id="ui-eholdings.server.errors.unableToCompleteOperation" /></h1>
      </KeyValue>
      <p>
        <FormattedMessage id="ui-eholdings.server.errors.apiLimitExceeded" />
      </p>
    </div>
  );
}
