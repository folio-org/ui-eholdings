import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  checkScope,
  HasCommand,
} from '@folio/stripes/components';

import { handleSaveKeyFormSubmit } from '../utilities';

const KeyShortcutsWrapper = ({
  children,
  toggleAllSections,
  onEdit,
  isPermission,
  formRef,
  focusSearchField,
  openCreateNewEntity,
}) => {
  const openEditEntity = useCallback(() => {
    if (isPermission) {
      onEdit();
    }
  }, [isPermission, onEdit]);

  const expandAllSections = useCallback((e) => {
    e.preventDefault();
    toggleAllSections(true);
  }, [toggleAllSections]);

  const collapseAllSections = useCallback((e) => {
    e.preventDefault();
    toggleAllSections(false);
  }, [toggleAllSections]);

  const toggleSectionsShortcuts = useMemo(() => {
    if (!toggleAllSections) return [];

    return ([
      {
        name: 'expandAllSections',
        handler: expandAllSections,
      },
      {
        name: 'collapseAllSections',
        handler: collapseAllSections,
      },
    ]);
  }, [collapseAllSections, expandAllSections, toggleAllSections]);

  const editShortcuts = [
    ...toggleSectionsShortcuts,
    {
      name: 'edit',
      handler: openEditEntity,
    },
  ];

  const saveShortcuts = [
    ...toggleSectionsShortcuts,
    {
      name: 'save',
      handler: handleSaveKeyFormSubmit(formRef),
    },
  ];

  const searchShortcuts = [
    {
      name: 'search',
      handler: focusSearchField
    },
  ];

  const createShortcuts = [
    {
      name: 'new',
      handler: openCreateNewEntity,
    },
  ];

  const shortcuts = useMemo(() => {
    let shortcutsArray = [];

    if (onEdit) {
      shortcutsArray = [...shortcutsArray, ...editShortcuts];
    }

    if (formRef) {
      shortcutsArray = [...shortcutsArray, ...saveShortcuts];
    }

    if (focusSearchField) {
      shortcutsArray = [...shortcutsArray, ...searchShortcuts];
    }

    if (openCreateNewEntity) {
      shortcutsArray = [...shortcutsArray, ...createShortcuts];
    }

    return shortcutsArray;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onEdit, formRef, focusSearchField, openCreateNewEntity]);

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      {children}
    </HasCommand>
  );
};

KeyShortcutsWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  focusSearchField: PropTypes.func,
  formRef: PropTypes.object,
  isPermission: PropTypes.bool,
  onEdit: PropTypes.func,
  openCreateNewEntity: PropTypes.func,
  toggleAllSections: PropTypes.func,
};

export default KeyShortcutsWrapper;
