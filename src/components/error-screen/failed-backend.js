import React from 'react';
import KeyValueLabel from '../key-value-label';
import styles from './error-screen.css';

export default function FailedBackendErrorScreen() {
  return (
    <div className={styles['eholdings-back-end-error']} data-test-eholdings-application-rejected>
      <KeyValueLabel label="Error">
        <h1>Could not retrieve configuration information</h1>
      </KeyValueLabel>
      <p>There was a server error while retrieving your knowledge base configuration.</p>
    </div>
  );
}
