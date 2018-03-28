import React from 'react';
import { KeyValue } from '@folio/stripes-components';
import styles from './error-screen.css';

export default function NoBackendErrorScreen() {
  return (
    <div className={styles['eholdings-back-end-error']} data-test-eholdings-no-backend>
      <KeyValue label="Error">
        <h1>No knowledge base detected</h1>
      </KeyValue>
      <p>The eHoldings package requires a knowledge base to be present for proper operation.</p>
      <p>Please install an appropriate backend module with your instance of OKAPI.</p>
    </div>
  );
}
