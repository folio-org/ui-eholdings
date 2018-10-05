import React from 'react';
import { Link } from 'react-router-dom';
import { KeyValue } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import styles from './error-screen.css';

export default function InvalidBackendErrorScreen() {
  return (
    <div className={styles['eholdings-back-end-error']} data-test-eholdings-unconfigured-backend>
      <KeyValue label={<FormattedMessage id="ui-eholdings.error" />}>
        <h1><FormattedMessage id="ui-eholdings.server.errors.kbNotConfigured" /></h1>
      </KeyValue>
      <p><FormattedMessage id="ui-eholdings.server.errors.detectedUnconfiguredKb" /></p>
      <p>
        <FormattedMessage
          id="ui-eholdings.server.errors.configureKbLinkMsg"
          values={{
            link: (
              <Link to="/settings/eholdings/knowledge-base">
                <FormattedMessage id="ui-eholdings.server.errors.configureKbLinkText" />
              </Link>
            )
          }}
        />
      </p>
    </div>
  );
}
