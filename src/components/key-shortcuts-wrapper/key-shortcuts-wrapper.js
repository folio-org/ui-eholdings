import React, {
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

import {
  checkScope,
  HasCommand,
} from '@folio/stripes-components';

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

  const editShortcuts = [
    {
      name: 'edit',
      handler: openEditEntity,
    },
    {
      name: 'expandAllSections',
      handler: expandAllSections,
    },
    {
      name: 'collapseAllSections',
      handler: collapseAllSections,
    },
  ];

  const saveShortcuts = [
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
    if (onEdit) return editShortcuts;

    if (formRef) return saveShortcuts;

    if (focusSearchField) return searchShortcuts;

    if (openCreateNewEntity) return createShortcuts;

    return [];
  }, [
    onEdit,
    editShortcuts,
    formRef,
    saveShortcuts,
    focusSearchField,
    searchShortcuts,
    openCreateNewEntity,
    createShortcuts,
  ]);

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
