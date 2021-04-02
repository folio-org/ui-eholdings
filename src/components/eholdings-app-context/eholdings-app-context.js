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
    {(handleToggle) => (
      <NavList>
        <NavListSection>
          <NavListItem
            id="eholdings-app-item"
            to="/eholdings"
            onClick={handleToggle}
          >
            <FormattedMessage id="ui-eholdings.navigation.app" />
          </NavListItem>
          <NavListItem
            id="content-item"
            href="https://www.tfaforms.com/306425"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleToggle}
          >
            <Icon
              icon="external-link"
              iconPosition="end"
              iconClassName={css['icon-link']}
            >
              <FormattedMessage id="ui-eholdings.navigation.content" />
            </Icon>
          </NavListItem>
          <NavListItem
            id="system-status-item"
            href="https://status.ebsco.com/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleToggle}
          >
            <Icon
              icon="external-link"
              iconPosition="end"
              iconClassName={css['icon-link']}
            >
              <FormattedMessage id="ui-eholdings.navigation.systemStatus" />
            </Icon>
          </NavListItem>
        </NavListSection>
      </NavList>
    )}
  </AppContextMenu>
);

export default EHoldingsAppContext;
