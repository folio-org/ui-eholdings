import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  NavList,
  NavListItem,
  NavListSection,
  Icon,
  KeyboardShortcutsModal,
  HasCommand,
  checkScope,
} from '@folio/stripes/components';
import {
  AppContextMenu,
} from '@folio/stripes/core';

import {
  commands,
  commandsGeneral,
} from '../../commands';

import css from './eholdings-app-context.css';

const EHoldingsAppContext = () => {
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  const shortcuts = [{
    name: 'openShortcutModal',
    handler: () => setIsShortcutsModalOpen(true),
  }];

  return (
    <>
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
                id="keyboard-shortcuts-item"
                onClick={() => setIsShortcutsModalOpen(true)}
              >
                <FormattedMessage id="ui-eholdings.navigation.keyboardShortcuts" />
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
      <HasCommand
        commands={shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
      >
        {isShortcutsModalOpen && (
          <KeyboardShortcutsModal
            onClose={() => setIsShortcutsModalOpen(false)}
            allCommands={[...commands, ...commandsGeneral]}
          />
        )}
      </HasCommand>
    </>
  );
};

export default EHoldingsAppContext;
