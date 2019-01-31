import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  PaneCloseLink,
} from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

import { Pane } from '../paneset';
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
        paneTitle={paneTitle}
        flexGrow={3}
        firstMenu={(
          <FormattedMessage id="ui-eholdings.settings.goBackToEholdings">
            {ariaLabel => (
              <PaneCloseLink
                ariaLabel={ariaLabel}
                to="/settings/eholdings"
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
