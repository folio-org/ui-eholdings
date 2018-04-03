import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Pane from '@folio/stripes-components/lib/Pane';
import IconButton from '@folio/stripes-components/lib/IconButton';

import styles from './settings-detail-pane.css';

export default class SettingsDetailPane extends Component {
  static propTypes = {
    children: PropTypes.node,
    paneTitle: PropTypes.string
  };

  render() {
    let {
      children,
      paneTitle
    } = this.props;

    return (
      <Pane
        defaultWidth="fill"
        paneTitle={paneTitle}
        firstMenu={(
          <IconButton
            icon="left-arrow"
            href="/settings/eholdings"
            className={styles['settings-detail-pane-back-button']}
          />
        )}
      >
        {children}
      </Pane>
    );
  }
}
