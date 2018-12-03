import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  IconButton,
  Pane
} from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

import styles from './settings-detail-pane.css';

class SettingsDetailPane extends Component {
  static propTypes = {
    children: PropTypes.node,
    paneTitle: PropTypes.node
  };

  render() {
    let {
      children,
      paneTitle,
      ...paneProps
    } = this.props;

    return (
      <Pane
        {...paneProps}
        defaultWidth="fill"
        paneTitle={paneTitle}
        firstMenu={(
          <FormattedMessage id="ui-eholdings.settings.goBackToEholdings">
            {ariaLabel => (
              <IconButton
                icon="arrow-left"
                href="/settings/eholdings"
                ariaLabel={ariaLabel}
                className={styles['settings-detail-pane-back-button']}
              />
            )}
          </FormattedMessage>
        )}
      >
        <div className={styles['settings-detail-pane-body']}>
          {children}
        </div>
      </Pane>
    );
  }
}

export default SettingsDetailPane;
