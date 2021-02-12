import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Icon } from '@folio/stripes/components';

import styles from './loading-message.css';

const propTypes = {
  label: PropTypes.string.isRequired,
};

const LoadingMessage = ({ label }) => (
  <div
    data-test-usage-consolidation-loading-message
    className={styles.loadingMessage}
  >
    <div className={styles.loadingMessageLabelWrap}>
      <Icon iconRootClass={styles.loadingMessageIcon} icon="spinner-ellipsis" />
      <span className={styles.loadingMessageLabel}>
        <FormattedMessage id={label} />
      </span>
    </div>
  </div>
);

LoadingMessage.propTypes = propTypes;

export default LoadingMessage;
