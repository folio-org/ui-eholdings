import React from 'react';
import { Link } from 'react-router-dom';
import KeyValueLabel from '../key-value-label';
import styles from './error-screen.css';

export default function InvalidBackendErrorScreen() {
  return (
    <div className={styles['eholdings-back-end-error']} data-test-eholdings-unconfigured-backend>
      <KeyValueLabel label="Error">
        <h1>Knowledge base not configured</h1>
      </KeyValueLabel>
      <p>The eHoldings application detected the presence of a knowledge base, but the knowledge base does not appear to be configured.</p>
      <p>Please configure the knowledge base with your credentials in <Link to="/settings/eholdings">Settings/eHoldings</Link>.</p>
    </div>
  );
}
