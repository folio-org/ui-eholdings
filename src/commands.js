import { FormattedMessage } from 'react-intl';

const commands = [
  {
    name: 'new',
    label: (<FormattedMessage id="ui-eholdings.shortcut.createRecord" />),
    shortcut: 'alt+n',
  },
  {
    name: 'edit',
    label: (<FormattedMessage id="ui-eholdings.shortcut.editRecord" />),
    shortcut: 'mod+alt+e',
  },
  {
    name: 'save',
    label: (<FormattedMessage id="ui-eholdings.shortcut.saveRecord" />),
    shortcut: 'mod+s',
  },
  {
    name: 'expandAllSections',
    label: (<FormattedMessage id="ui-eholdings.shortcut.expandAll" />),
    shortcut: 'mod+alt+b'
  },
  {
    name: 'collapseAllSections',
    label: (<FormattedMessage id="ui-eholdings.shortcut.collapseAll" />),
    shortcut: 'mod+alt+g'
  },
  {
    name: 'search',
    label: (<FormattedMessage id="ui-eholdings.shortcut.goToSearchFilter" />),
    shortcut: 'mod+alt+h',
  },
  {
    name: 'openShortcutModal',
    label: (<FormattedMessage id="ui-eholdings.shortcut.openShortcutModal" />),
    shortcut: 'mod+alt+k',
  }
];

const commandsGeneral = [
  {
    label: (<FormattedMessage id="ui-eholdings.shortcut.expandCollapse" />),
    shortcut: 'spacebar'
  },
  {
    label: (<FormattedMessage id="ui-eholdings.shortcut.closeModal" />),
    shortcut: 'esc'
  },
  {
    label: (<FormattedMessage id="ui-eholdings.shortcut.copy" />),
    shortcut: 'mod+c'
  },
  {
    label: (<FormattedMessage id="ui-eholdings.shortcut.cut" />),
    shortcut: 'mod+x'
  },
  {
    label: (<FormattedMessage id="ui-eholdings.shortcut.paste" />),
    shortcut: 'mod+v'
  },
  {
    label: (<FormattedMessage id="ui-eholdings.shortcut.find" />),
    shortcut: 'mod+f'
  }
];

export {
  commands,
  commandsGeneral,
};
