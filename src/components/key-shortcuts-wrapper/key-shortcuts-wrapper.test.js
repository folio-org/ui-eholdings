import {
  render,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';

import {
  CommandList,
  defaultKeyboardShortcuts,
} from '@folio/stripes-components';

import KeyShortcutsWrapper from './key-shortcuts-wrapper';

import {
  openNewShortcut,
  openEditShortcut,
  collapseAllShortcut,
  expandAllShortcut,
  focusSearchShortcut,
  saveShortcut,
} from '../../../test/jest/utilities';

import { handleSaveKeyFormSubmit } from '../utilities';

jest.mock('../utilities', () => ({
  handleSaveKeyFormSubmit: jest.fn(),
}));

const renderKeyShortcutsWrapper = ({
  toggleAllSections,
  onEdit,
  isPermission,
  formRef,
  focusSearchField,
  openCreateNewEntity,
}) => render(
  <CommandList commands={defaultKeyboardShortcuts}>
    <KeyShortcutsWrapper
      toggleAllSections={toggleAllSections}
      onEdit={onEdit}
      isPermission={isPermission}
      formRef={formRef}
      focusSearchField={focusSearchField}
      openCreateNewEntity={openCreateNewEntity}
    >
      <div data-testid='data-test-wrapper-children'>
        Test
      </div>
    </KeyShortcutsWrapper>
  </CommandList>
);


describe('KeyShortcutsWrapper', () => {
  afterEach(cleanup);

  it('should render children', () => {
    const { getByTestId } = renderKeyShortcutsWrapper({});

    expect(getByTestId('data-test-wrapper-children')).toBeDefined();
  });

  it('should call openCreateNewEntity function', () => {
    const openCreateNewEntityMock = jest.fn();
    const { getByTestId } = renderKeyShortcutsWrapper({
      openCreateNewEntity: openCreateNewEntityMock,
    });
    const testDiv = getByTestId('data-test-wrapper-children');

    testDiv.focus();

    openNewShortcut(testDiv);

    expect(openCreateNewEntityMock).toHaveBeenCalledTimes(1);
  });

  it('should call handleSaveKeyFormSubmit function', () => {
    const { getByTestId } = renderKeyShortcutsWrapper({ formRef: {} });
    const testDiv = getByTestId('data-test-wrapper-children');

    testDiv.focus();

    saveShortcut(testDiv);

    expect(handleSaveKeyFormSubmit).toHaveBeenCalled();
  });

  it('should call focusSearchField function', () => {
    const focusSearchFieldMock = jest.fn();
    const { getByTestId } = renderKeyShortcutsWrapper({
      focusSearchField: focusSearchFieldMock,
    });
    const testDiv = getByTestId('data-test-wrapper-children');

    testDiv.focus();

    focusSearchShortcut(testDiv);

    expect(focusSearchFieldMock).toHaveBeenCalledTimes(1);
  });

  describe('Edit shortcuts', () => {
    const onEditMock = jest.fn();
    const toggleAllSectionsMock = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call onEdit function if user has permission', () => {
      const { getByTestId } = renderKeyShortcutsWrapper({
        onEdit: onEditMock,
        toggleAllSections: toggleAllSectionsMock,
        isPermission: true,
      });
      const testDiv = getByTestId('data-test-wrapper-children');

      testDiv.focus();

      openEditShortcut(testDiv);

      expect(onEditMock).toHaveBeenCalledTimes(1);
    });

    it('should not call onEdit function if user has not permission', () => {
      const { getByTestId } = renderKeyShortcutsWrapper({
        onEdit: onEditMock,
        toggleAllSections: toggleAllSectionsMock,
        isPermission: false,
      });
      const testDiv = getByTestId('data-test-wrapper-children');

      testDiv.focus();

      openEditShortcut(testDiv);

      expect(onEditMock).not.toHaveBeenCalled();
    });

    it('should call toggleAllSections on collapse all shortcut', () => {
      const { getByTestId } = renderKeyShortcutsWrapper({
        onEdit: onEditMock,
        toggleAllSections: toggleAllSectionsMock,
        isPermission: true,
      });
      const testDiv = getByTestId('data-test-wrapper-children');

      collapseAllShortcut(testDiv);

      expect(toggleAllSectionsMock).toHaveBeenCalled();
    });

    it('should call toggleAllSections on expand all shortcut', () => {
      const { getByTestId } = renderKeyShortcutsWrapper({
        onEdit: onEditMock,
        toggleAllSections: toggleAllSectionsMock,
        isPermission: true,
      });
      const testDiv = getByTestId('data-test-wrapper-children');

      expandAllShortcut(testDiv);

      expect(toggleAllSectionsMock).toHaveBeenCalled();
    });
  });
});
