import React from 'react';
import { Link } from 'react-router-dom';
import { KeyValue } from '@folio/stripes-components';
import styles from './error-screen.css';

export default function InvalidBackendErrorScreen() {
  return (
    <div className={styles['eholdings-back-end-error']} data-test-eholdings-unconfigured-backend>
      <KeyValue label="Error">
        <h1>Knowledge base not configured</h1>
      </KeyValue>
      <p>The eHoldings application detected the presence of a knowledge base, but the knowledge base does not appear to be configured.</p>
      <p>Please configure the knowledge base with your credentials in <Link to="/settings/eholdings/knowledge-base">Settings/eHoldings</Link>.</p>
    </div>
  );
}
