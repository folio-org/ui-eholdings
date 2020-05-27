import React from 'react';
import { KeyValue } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import styles from './error-screen.css';

export default function UserNotAssignedToKbErrorScreen() {
  return (
    <div className={styles['eholdings-back-end-error']} data-test-eholdings-user-no-credentials>
      <KeyValue label={<FormattedMessage id="ui-eholdings.error" />}>
        <h1><FormattedMessage id="ui-eholdings.server.errors.userNotAssignedToKb" /></h1>
      </KeyValue>
    </div>
  );
}
