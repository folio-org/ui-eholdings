import React, { Component, Fragment } from 'react';
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
} from '@folio/stripes/components';

import { Pane } from './paneset';

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
      <Fragment>
        <Pane
          static
          flexGrow={1}
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
            >
              <IfPermission perm="module.eholdings.enabled">
                <NavListItem to="/settings/eholdings/knowledge-base">
                  <FormattedMessage id="ui-eholdings.settings.kb" />
                </NavListItem>
              </IfPermission>

              <IfPermission perm="module.eholdings.enabled">
                <NavListItem to="/settings/eholdings/root-proxy">
                  <FormattedMessage id="ui-eholdings.settings.rootProxy" />
                </NavListItem>
              </IfPermission>
            </NavListSection>
          </NavList>
        </Pane>
        {children}
      </Fragment>
    );
  }
}

export default Settings;
