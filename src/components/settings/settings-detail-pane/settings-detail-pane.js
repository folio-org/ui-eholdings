import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
  PaneCloseLink,
} from '@folio/stripes/components';

class SettingsDetailPane extends Component {
  static propTypes = {
    children: PropTypes.node,
    paneTitle: PropTypes.node
  };

  render() {
    const {
      children,
      paneTitle,
      ...paneProps
    } = this.props;

    return (
      <Pane
        {...paneProps}
        paneTitle={paneTitle}
        defaultWidth="fill"
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
        {children}
      </Pane>
    );
  }
}

export default SettingsDetailPane;
