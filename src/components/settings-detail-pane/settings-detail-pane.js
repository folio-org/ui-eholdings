import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  IconButton,
  Pane
} from '@folio/stripes-components';
import { injectIntl, intlShape } from 'react-intl';

import styles from './settings-detail-pane.css';

class SettingsDetailPane extends Component {
  static propTypes = {
    children: PropTypes.node,
    intl: intlShape.isRequired,
    paneTitle: PropTypes.string
  };

  render() {
    let {
      children,
      intl,
      paneTitle,
      ...paneProps
    } = this.props;

    return (
      <Pane
        {...paneProps}
        defaultWidth="fill"
        paneTitle={paneTitle}
        firstMenu={(
          <IconButton
            icon="left-arrow"
            href="/settings/eholdings"
            ariaLabel={intl.formatMessage({ id: 'ui-eholdings.settings.goBackToEholdings' })}
            className={styles['settings-detail-pane-back-button']}
          />
        )}
      >
        <div className={styles['settings-detail-pane-body']}>
          {children}
        </div>
      </Pane>
    );
  }
}

export default injectIntl(SettingsDetailPane);
