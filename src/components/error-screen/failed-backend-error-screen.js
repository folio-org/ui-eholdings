import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  TextLink,
  Icon,
} from '@folio/stripes/components';
import styles from './error-screen.css';

export default function FailedBackendErrorScreen() {
  return (
    <div className={styles['eholdings-back-end-error']} data-test-eholdings-application-rejected>
      <KeyValue label={<FormattedMessage id="ui-eholdings.error" />}>
        <h1><FormattedMessage id="ui-eholdings.server.errors.failedBackend" /></h1>
      </KeyValue>
      <p>
        <FormattedMessage id="ui-eholdings.server.errors.errorDuringFetch" />
        <TextLink
          className={styles['ebsco-connect-link']}
          target="_blank"
          rel="noopener noreferrer"
          href="https://connect.ebsco.com"
        >
          <Icon
            icon="external-link"
            iconPosition="end"
            iconRootClass={styles['ebsco-connect-link-icon']}
          >
            <FormattedMessage id="ui-eholdings.server.errors.errorDuringFetch.ebscoConnect" />
          </Icon>
        </TextLink>
      </p>
    </div>
  );
}
