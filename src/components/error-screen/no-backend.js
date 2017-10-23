import React from 'react';
import KeyValueLabel from '../key-value-label';
import styles from './error-screen.css';

export default function NoBackendErrorScreen() {
  return (
    <div className={styles['eholdings-back-end-error']} data-test-eholdings-no-backend>
      <KeyValueLabel label="Error">
        <h1>No knowledge base detected</h1>
      </KeyValueLabel>
      <p>The eHoldings package requires a knowledge base to be present for proper operation.</p>
      <p>Please install an appropriate backend module with your instance of OKAPI.</p>
    </div>
  );
}
