import React from 'react';
import { KeyValue } from '@folio/stripes-components';
import styles from './error-screen.css';

export default function FailedBackendErrorScreen() {
  return (
    <div className={styles['eholdings-back-end-error']} data-test-eholdings-application-rejected>
      <KeyValue label="Error">
        <h1>Could not retrieve configuration information</h1>
      </KeyValue>
      <p>There was a server error while retrieving your knowledge base configuration.</p>
    </div>
  );
}
