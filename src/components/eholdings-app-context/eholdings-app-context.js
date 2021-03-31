import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  NavList,
  NavListItem,
  NavListSection,
  Icon,
} from '@folio/stripes/components';
import {
  AppContextMenu,
} from '@folio/stripes/core';

import css from './eholdings-app-context.css';

const EHoldingsAppContext = () => (
  <AppContextMenu>
    {() => (
      <NavList>
        <NavListSection>
          <NavListItem
            id="eholdings-app-item"
            to="eholdings"
          >
            <FormattedMessage id="ui-eholdings.navigation.app" />
          </NavListItem>
          <NavListItem id="content-item">
            <a
              href="https://www.tfaforms.com/306425"
              target="_blank"
              rel="noopener noreferrer"
              className={css['external-link']}
            >
              <Icon
                icon="external-link"
                iconPosition="end"
                iconClassName={css['icon-link']}
              >
                <FormattedMessage id="ui-eholdings.navigation.content" />
              </Icon>
            </a>
          </NavListItem>
          <NavListItem id="system-status-item">
            <a
              href="https://status.ebsco.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={css['external-link']}
            >
              <Icon
                icon="external-link"
                iconPosition="end"
                iconClassName={css['icon-link']}
              >
                <FormattedMessage id="ui-eholdings.navigation.systemStatus" />
              </Icon>
            </a>
          </NavListItem>
        </NavListSection>
      </NavList>
    )}
  </AppContextMenu>
);

export default EHoldingsAppContext;
