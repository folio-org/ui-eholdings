import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';
import { IfPermission } from '@folio/stripes/core';
import {
  Headline,
  NavList,
  NavListItem,
  NavListSection,
  PaneBackLink,
  Pane,
} from '@folio/stripes/components';

import css from './settings.css';

class Settings extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    location: ReactRouterPropTypes.location.isRequired
  }

  render() {
    const {
      children,
      location: { pathname }
    } = this.props;

    return (
      <>
        <Pane
          defaultWidth="30%"
          paneTitle={
            <Headline tag="h3" margin="none">
              <FormattedMessage id="ui-eholdings.meta.title" />
            </Headline>
          }
          firstMenu={
            <PaneBackLink to="/settings" />
          }
        >
          <NavList>
            <NavListSection
              activeLink={pathname}
              className={css.listSection}
            >
              <IfPermission perm="ui-eholdings.settings.kb">
                <NavListItem to="/settings/eholdings/knowledge-base">
                  <FormattedMessage id="ui-eholdings.settings.kb" />
                </NavListItem>
              </IfPermission>

              <IfPermission perm="ui-eholdings.settings.root-proxy">
                <NavListItem to="/settings/eholdings/root-proxy">
                  <FormattedMessage id="ui-eholdings.settings.rootProxy" />
                </NavListItem>
              </IfPermission>

              <NavListItem to="/settings/eholdings/custom-labels">
                <FormattedMessage id="ui-eholdings.resource.customLabels" />
              </NavListItem>

              <NavListItem to="/settings/eholdings/access-status-types">
                <FormattedMessage id="ui-eholdings.settings.accessStatusTypes" />
              </NavListItem>
            </NavListSection>
          </NavList>
        </Pane>
        {children}
      </>
    );
  }
}

export default Settings;
