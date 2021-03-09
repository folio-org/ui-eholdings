import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  cleanup,
  fireEvent,
} from '@testing-library/react';

import KeyShortcutsWrapper from './key-shortcuts-wrapper';

const renderKeyShortcutsWrapper = ({
  toggleAllSections,
  onEdit,
  isPermission,
  formRef,
  focusSearchField,
  openCreateNewEntity,
}) => render(
  <KeyShortcutsWrapper>
    <div>Test</div>
  </KeyShortcutsWrapper>
);
