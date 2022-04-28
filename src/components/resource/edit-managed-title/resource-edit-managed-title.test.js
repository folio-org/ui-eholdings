
import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';
import { noop } from 'lodash';

import {
  CommandList,
  defaultKeyboardShortcuts,
} from '@folio/stripes-components';

import ResourceEditManagedTitle from './resource-edit-managed-title';
import Harness from '../../../../test/jest/helpers/harness';
import getAxe from '../../../../test/jest/helpers/get-axe';

jest.mock('../../navigation-modal', () => ({ when }) => (when ? <span>NavigationModal</span> : null));

const accessStatusTypes = {
  errors: [],
  isDeleted: false,
  isLoading: false,
  items: { data: [] },
};

const proxyTypes = {
  resolver: {
    state: {
      proxyTypes: {
        records: {},
      },
    },
  },
  request: {
    isResolved: false,
  },
};

const model = {
  name: 'resource-name',
  isSelected: true,
  isLoaded: true,
  isLoading: false,
  visibilityData: {
    isHidden: false,
  },
  customCoverages: [],
  coverageStatement: '',
  customEmbargoPeriod: {
    embargoValue: 0,
  },
  proxy: {
    id: 'ezproxy',
    inherited: true,
  },
  update: {
    errors: [],
    isPending: false,
    isRejected: false,
    isResolved: false,
    changedAttributes: [],
  },
  request: {
    errors: [],
    isRejected: false,
  },
  destroy: {
    errors: [],
    isRejected: false,
  },
  title: {
    name: 'titleName',
  },
  package: {
    name: 'packageName',
    proxy: {
      id: 'proxyId',
    },
    visibilityData: {
      isHidden: false,
      reason: '',
    },
  },
  data: {
    relationships: {
      accessType: {
        data: {
          id: 'accessTypeId',
        },
      },
    },
  },
  userDefinedField1: '',
  userDefinedField2: '',
  userDefinedField3: '',
  userDefinedField4: '',
  userDefinedField5: '',
  managedCoverages: [],
  publicationType: 'Book',
  isTitleCustom: false,
};

const mockHandleOnSubmit = jest.fn();
const axe = getAxe();

const renderResourceEditManagedTitle = (props = {}) => render(
  <Harness
    storeInitialState={{
      data: {
        customLabels: {
          errors: [],
          items: {
            data: [{
              type: 'customLabels',
              attributes: {
                id: 1,
                displayLabel: 'customLabel1',
                displayOnFullTextFinder: true,
                displayOnPublicationFinder: false,
              },
            }],
          },
        },
      },
    }}
  >
    <CommandList commands={defaultKeyboardShortcuts}>
      <ResourceEditManagedTitle
        closeSelectionModal={noop}
        model={model}
        proxyTypes={proxyTypes}
        accessStatusTypes={accessStatusTypes}
        onCancel={noop}
        showSelectionModal={false}
        handleDeleteConfirmation={noop}
        handleOnSubmit={mockHandleOnSubmit}
        getFooter={() => (
          <button
            buttonStyle="primary mega"
            type="submit"
          >
            Save & close
          </button>
        )}
        getSectionHeader={(id) => id}
        {...props}
      />
    </CommandList>
  </Harness>
);

describe('Given ResourceEditManagedTitle', () => {
  afterEach(() => {
    cleanup();
    mockHandleOnSubmit.mockClear();
  });

  it('should have no a11y issues', async () => {
    const { container } = renderResourceEditManagedTitle();
    const a11yResults = await axe.run(container);

    expect(a11yResults.violations.length).toEqual(0);
  });

  it('should check dates radio button', () => {
    const { getByLabelText } = renderResourceEditManagedTitle();

    expect(getByLabelText('ui-eholdings.label.dates').checked).toBeTruthy();
    expect(getByLabelText('ui-eholdings.label.coverageStatement').checked).toBeFalsy();
  });

  describe('when coverage statement is not empty', () => {
    it('should check coverage statement radio button', () => {
      const { getByLabelText } = renderResourceEditManagedTitle({
        model: {
          ...model,
          coverageStatement: '123',
        },
      });

      expect(getByLabelText('ui-eholdings.label.dates').checked).toBeFalsy();
      expect(getByLabelText('ui-eholdings.label.coverageStatement').checked).toBeTruthy();
    });
  });

  describe('selection modal', () => {
    it('should have no a11y issues', async () => {
      const { container } = renderResourceEditManagedTitle({
        showSelectionModal: true,
      });
      const a11yResults = await axe.run(container);

      expect(a11yResults.violations.length).toEqual(0);
    });

    it('should show confirm button in selection modal', () => {
      const { getByText } = renderResourceEditManagedTitle({
        showSelectionModal: true,
      });

      expect(getByText('ui-eholdings.resource.modal.buttonConfirm')).toBeDefined();
    });

    describe('when model updating on pending', () => {
      it('should show removing button in selection modal', () => {
        const { getByText } = renderResourceEditManagedTitle({
          showSelectionModal: true,
          model: {
            ...model,
            update: {
              ...model.update,
              isPending: true,
            },
          },
        });

        expect(getByText('ui-eholdings.resource.modal.buttonWorking')).toBeDefined();
      });
    });

    describe('when close selection modal', () => {
      const mockCloseSelectionModal = jest.fn();

      it('should handle closeSelectionModal', () => {
        const { getByText } = renderResourceEditManagedTitle({
          closeSelectionModal: mockCloseSelectionModal,
          showSelectionModal: true,
        });

        fireEvent.click(getByText('ui-eholdings.resource.modal.buttonCancel'));

        expect(mockCloseSelectionModal).toHaveBeenCalled();
      });
    });
  });

  describe('when saving a managed resource in a managed package', () => {
    it('should not edit url', () => {
      const {
        getByText,
        getByLabelText,
      } = renderResourceEditManagedTitle({
        model: {
          ...model,
          url: 'https://www.test.com',
          isPackageCustom: false,
        },
      });

      fireEvent.change(getByLabelText('customLabel1'), {
        target: {
          value: 'testvalue',
        },
      });
      fireEvent.blur(getByLabelText('customLabel1'));

      fireEvent.click(getByText('Save & close'));

      const formValues = mockHandleOnSubmit.mock.calls[0][0];
      expect(formValues.customUrl).toBeUndefined();
    });
  });

  describe('when saving a managed resource in a custom package', () => {
    it('should save url', () => {
      const {
        getByText,
        getByLabelText,
      } = renderResourceEditManagedTitle({
        model: {
          ...model,
          url: 'https://www.test.com',
          isPackageCustom: true,
        },
      });

      fireEvent.change(getByLabelText('customLabel1'), {
        target: {
          value: 'testvalue',
        },
      });
      fireEvent.blur(getByLabelText('customLabel1'));

      fireEvent.click(getByText('Save & close'));

      const formValues = mockHandleOnSubmit.mock.calls[0][0];
      expect(formValues.customUrl).toEqual('https://www.test.com');
    });
  });
});
