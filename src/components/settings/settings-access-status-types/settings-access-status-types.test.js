import {
  render,
  fireEvent,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import { MemoryRouter } from 'react-router-dom';
import Harness from '../../../../test/jest/helpers/harness';

import SettingsAccessStatusTypes from './settings-access-status-types';

const accessStatusTypesColumns = {
  TYPE: 'type',
  DESCRIPTION: 'description',
  LAST_UPDATED: 'lastUpdated',
  NUM_OF_RECORDS: 'records',
};

const formItems = [
  {
    attributes: {
      name: 'test-access-type',
      description: 'test-description',
      credentialsId: 'test-credentials-id',
    },
    creator: {
      firstName: 'ADMINISTRATOR',
      lastName: 'DIKU',
    },
    id: 'test-id',
    type: 'accessTypes',
  },
];

const accessTypesData = {
  errors: [],
  isLoading: false,
  isDeleted: false,
  items: [{
    attributes: {
      name: 'test-access-type',
      description: 'test-description',
      credentialsId: 'test-credentials-id',
    },
    creator: {
      firstName: 'ADMINISTRATOR',
      lastName: 'DIKU',
    },
    id: 'test-id',
    type: 'accessTypes',
    metadata: {
      createdByUsername: 'user name',
      createdByUserId: '56502487-370d-56f1-a207-4ffe3d8b4771',
      updatedByUserId: '56502487-370d-56f1-a207-4ffe3d8b4771',
      updatedDate: '2022-04-13T09:57:06.302+00:00',
      createdDate: '2022-04-13T09:57:06.302+00:00',
    },
  }],
};

const getSettingsAccessStatusTypes = ({ editableListFormProps = {}, props = {} }) => (
  <MemoryRouter>
    <Harness
      storeReducers={{
        form: () => ({
          editableListForm: {
            values: {
              items: formItems,
            },
            ...editableListFormProps,
          },
        }),
      }}
    >
      <SettingsAccessStatusTypes
        accessTypesData={accessTypesData}
        kbId="test-kb-id"
        confirmDelete={() => {}}
        onCreate={() => {}}
        onDelete={() => {}}
        onUpdate={() => {}}
        {...props}
      />
    </Harness>
  </MemoryRouter>
);

const renderSettingsAccessStatusTypes = ({ editableListFormProps = {}, props = {} }) => render(
  getSettingsAccessStatusTypes({ editableListFormProps, props }),
);

describe('Given SettingsAccessStatusTypes', () => {
  const mockOnCreate = jest.fn();
  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();
  const mockConfirmDelete = jest.fn();

  it('should render SettingsAccessStatusTypes component', () => {
    const { getByTestId } = renderSettingsAccessStatusTypes({});

    expect(getByTestId('settings-access-status-types')).toBeDefined();
  });

  it('should display `Access status types` in the pane header and as the headline', () => {
    const { getAllByText } = renderSettingsAccessStatusTypes({});

    expect(getAllByText('ui-eholdings.settings.accessStatusTypes')).toHaveLength(2);
  });

  it('should display New button', () => {
    const { getByRole } = renderSettingsAccessStatusTypes({});

    expect(getByRole('button', { name: 'ui-eholdings.new' })).toBeDefined();
  });

  it('should display table columns titles', () => {
    const { getByText } = renderSettingsAccessStatusTypes({});

    Object.values(accessStatusTypesColumns).forEach(column => {
      expect(getByText(`ui-eholdings.settings.accessStatusTypes.${column}`)).toBeDefined();
    });
    expect(getByText('stripes-smart-components.editableList.actionsColumnHeader')).toBeDefined();
  });

  it('should display access status type info', () => {
    const { getByText } = renderSettingsAccessStatusTypes({});

    expect(getByText('test-access-type')).toBeDefined();
    expect(getByText('test-description')).toBeDefined();
  });

  describe('when metadata of access status type is passed', () => {
    it('should display metadata info', () => {
      const { getByText } = renderSettingsAccessStatusTypes({
        editableListFormProps: {
          values: {
            items: [{
              ...formItems[0],
              metadata: {
                createdByUsername: 'user name',
                createdByUserId: 'user-id',
                updatedByUserId: '56502487-370d-56f1-a207-4ffe3d8b4771',
                createdDate: 'created-date',
                updatedDate: '2022-04-13T09:57:06.302+00:00',
              },
            }],
          },
        },
        props: {
          accessTypesData: {
            ...accessTypesData,
          },
        },
      });

      expect(getByText('ui-eholdings.settings.accessStatusTypes.lastUpdated.data')).toBeDefined();
    });
  });

  it('should display edit icon', () => {
    const { getByRole } = renderSettingsAccessStatusTypes({});

    expect(getByRole('button', { name: 'stripes-components.editThisItem' })).toBeDefined();
  });

  it('should display delete icon', () => {
    const { getByRole } = renderSettingsAccessStatusTypes({});

    expect(getByRole('button', { name: 'stripes-components.deleteThisItem' })).toBeDefined();
  });

  describe('when click on New button', () => {
    it('should display fields to add a new access status type', () => {
      const { getByRole } = renderSettingsAccessStatusTypes({});

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.new' }));

      const accessStatusTypeInput = getByRole('textbox', { name: 'ui-eholdings.settings.accessStatusTypes.type' });
      const descriptionInput = getByRole('textbox', { name: 'ui-eholdings.settings.accessStatusTypes.description' });
      const cancelButton = getByRole('button', { name: 'stripes-core.button.cancel' });
      const saveButton = getByRole('button', { name: 'stripes-core.button.save' });

      expect(accessStatusTypeInput).toBeDefined();
      expect(descriptionInput).toBeDefined();
      expect(cancelButton).toBeDefined();
      expect(saveButton).toBeDefined();
    });

    describe('when cancel creating new access status type', () => {
      it('should hide fields to add a new access status type', async () => {
        const { getByRole } = renderSettingsAccessStatusTypes({});

        fireEvent.click(getByRole('button', { name: 'ui-eholdings.new' }));

        const accessStatusTypeInput = getByRole('textbox', { name: 'ui-eholdings.settings.accessStatusTypes.type' });
        const descriptionInput = getByRole('textbox', { name: 'ui-eholdings.settings.accessStatusTypes.description' });
        const cancelButton = getByRole('button', { name: 'stripes-core.button.cancel' });
        const saveButton = getByRole('button', { name: 'stripes-core.button.save' });

        fireEvent.click(cancelButton);

        await waitFor(() => {
          expect(accessStatusTypeInput).not.toBeInTheDocument();
          expect(descriptionInput).not.toBeInTheDocument();
          expect(cancelButton).not.toBeInTheDocument();
          expect(saveButton).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('when add new access status type', () => {
    it('should handle onCreate', () => {
      const { getByRole } = renderSettingsAccessStatusTypes({
        editableListFormProps: {
          values: {
            items: [{
              attributes: { name: 'test' },
            }],
          },
          fields: {
            items: [{
              attributes: {
                name: { active: true },
              },
            }],
          },
        },
        props: {
          onCreate: mockOnCreate,
        },
      });

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.new' }));

      const accessStatusTypeInput = getByRole('textbox', { name: 'ui-eholdings.settings.accessStatusTypes.type' });
      const saveButton = getByRole('button', { name: 'stripes-core.button.save' });

      fireEvent.change(accessStatusTypeInput, { target: { value: 'test' } });
      fireEvent.blur(accessStatusTypeInput);

      fireEvent.click(saveButton);

      expect(mockOnCreate).toBeCalled();
    });
  });

  describe('when edit existing access status type', () => {
    it('should handle onUpdate', () => {
      const [testFormItem] = formItems;

      const { getByRole } = renderSettingsAccessStatusTypes({
        editableListFormProps: {
          values: {
            items: [{
              ...testFormItem,
              attributes: {
                ...testFormItem.attributes,
                name: 'test-edited',
              },
            }],
          },
          fields: {
            items: [{
              attributes: {
                name: {
                  visited: true,
                  touched: true,
                },
              },
            }],
          },
          anyTouched: true,
        },
        props: {
          onUpdate: mockOnUpdate,
        },
      });

      fireEvent.click(getByRole('button', { name: 'stripes-components.editThisItem' }));

      const accessStatusTypeInput = getByRole('textbox', { name: 'ui-eholdings.settings.accessStatusTypes.type' });
      const saveButton = getByRole('button', { name: 'stripes-core.button.save' });

      fireEvent.change(accessStatusTypeInput, { target: { value: 'test-edited' } });
      fireEvent.blur(accessStatusTypeInput);

      fireEvent.click(saveButton);

      expect(mockOnUpdate).toBeCalled();
    });
  });

  describe('when delete access status type', () => {
    it('should handle onDelete', () => {
      const {
        getByRole,
        getByText,
      } = renderSettingsAccessStatusTypes({
        props: {
          onDelete: mockOnDelete,
        },
      });

      fireEvent.click(getByRole('button', { name: 'stripes-components.deleteThisItem' }));

      const confirmationModalDeleteButton = getByText('ui-eholdings.settings.accessStatusTypes.delete.confirm');

      fireEvent.click(confirmationModalDeleteButton);

      expect(mockOnDelete).toBeCalled();
    });

    it('should handle confirmDelete and show success toast message', () => {
      const {
        getByRole,
        getByText,
        rerender,
      } = renderSettingsAccessStatusTypes({
        props: {
          onDelete: mockOnDelete,
        },
      });

      fireEvent.click(getByRole('button', { name: 'stripes-components.deleteThisItem' }));

      const confirmationModalDeleteButton = getByText('ui-eholdings.settings.accessStatusTypes.delete.confirm');

      fireEvent.click(confirmationModalDeleteButton);

      expect(mockOnDelete).toBeCalled();

      rerender(
        getSettingsAccessStatusTypes({
          editableListFormProps: {
            values: {
              items: [],
            },
          },
          props: {
            accessTypesData: {
              ...accessTypesData,
              isDeleted: true,
            },
            confirmDelete: mockConfirmDelete,
          },
        }),
      );

      expect(mockConfirmDelete).toBeCalled();
      expect(getByText('ui-eholdings.settings.accessStatusTypes.delete.toast')).toBeDefined();
    });
  });

  describe('when there are errors', () => {
    describe('when error message ends with not found', () => {
      it('should display a toast with an error message', () => {
        const { getByText } = renderSettingsAccessStatusTypes({
          props: {
            accessTypesData: {
              ...accessTypesData,
              errors: [{ title: 'This access status type is not found' }],
            },
          },
        });

        expect(getByText('ui-eholdings.settings.accessStatusTypes.delete.error')).toBeDefined();
      });
    });

    describe('when error message does not end with not found', () => {
      it('should not display a toast with an error message', () => {
        const { queryByText } = renderSettingsAccessStatusTypes({
          props: {
            accessTypesData: {
              ...accessTypesData,
              errors: [{ title: 'Error message' }],
            },
          },
        });

        expect(queryByText('ui-eholdings.settings.accessStatusTypes.delete.error')).toBeNull();
      });
    });
  });

  describe('when click on delete icon', () => {
    it('should display a confirmation modal', () => {
      const {
        getByRole,
        getByText,
        getAllByText,
      } = renderSettingsAccessStatusTypes({});

      fireEvent.click(getByRole('button', { name: 'stripes-components.deleteThisItem' }));

      const confirmationModalTitle = 'ui-eholdings.settings.accessStatusTypes.delete';
      const confirmationModalText = 'ui-eholdings.settings.accessStatusTypes.delete.description';
      const confirmationModalCancelButton = 'ui-eholdings.settings.accessStatusTypes.delete.cancel';
      const confirmationModalDeleteButton = 'ui-eholdings.settings.accessStatusTypes.delete.confirm';

      expect(getAllByText(confirmationModalTitle)).toBeDefined();
      expect(getByText(confirmationModalText)).toBeDefined();
      expect(getByText(confirmationModalCancelButton)).toBeDefined();
      expect(getByText(confirmationModalDeleteButton)).toBeDefined();
    });
  });

  describe('when click on cancel button on delete confirmation modal', () => {
    it('should hide confirmation modal', async () => {
      const {
        getByRole,
        getByText,
        queryByText,
        getAllByText,
      } = renderSettingsAccessStatusTypes({});

      fireEvent.click(getByRole('button', { name: 'stripes-components.deleteThisItem' }));

      const confirmationModalTitle = 'ui-eholdings.settings.accessStatusTypes.delete';
      const confirmationModalText = 'ui-eholdings.settings.accessStatusTypes.delete.description';
      const confirmationModalCancelButton = 'ui-eholdings.settings.accessStatusTypes.delete.cancel';
      const confirmationModalDeleteButton = 'ui-eholdings.settings.accessStatusTypes.delete.confirm';

      expect(getAllByText(confirmationModalTitle)).toBeDefined();
      expect(getByText(confirmationModalText)).toBeDefined();
      expect(getByText(confirmationModalCancelButton)).toBeDefined();
      expect(getByText(confirmationModalDeleteButton)).toBeDefined();

      fireEvent.click(getByText(confirmationModalCancelButton));

      await waitFor(() => {
        expect(queryByText(confirmationModalTitle)).toBeNull();
        expect(queryByText(confirmationModalText)).toBeNull();
        expect(queryByText(confirmationModalCancelButton)).toBeNull();
        expect(queryByText(confirmationModalDeleteButton)).toBeNull();
      });
    });
  });

  describe('when max number of access status types reached', () => {
    it('should disable New button', () => {
      const MAX_ACCESS_STATUS_TYPES_COUNT = 15;
      const accessTypesDataItems = [];

      for (let i = 0; i < MAX_ACCESS_STATUS_TYPES_COUNT; i++) {
        accessTypesDataItems.push({
          id: `item-${i}`,
          attributes: {
            name: `name-${i}`,
          },
          type: 'accessTypes',
          metadata: {
            createdByUsername: 'user name',
            createdByUserId: 'user-id',
            updatedByUserId: '56502487-370d-56f1-a207-4ffe3d8b4771',
            createdDate: 'created-date',
            updatedDate: '2022-04-13T09:57:06.302+00:00',
          },
        });
      }

      const { getByRole } = renderSettingsAccessStatusTypes({
        props: {
          accessTypesData: {
            ...accessTypesData,
            items: accessTypesDataItems,
          },
        },
      });

      expect(getByRole('button', { name: 'ui-eholdings.new' })).toBeDisabled();
    });
  });
});
