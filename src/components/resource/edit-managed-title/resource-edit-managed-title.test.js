
import {
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

jest.mock('../../navigation-modal', () => ({ when }) => (when ? <span>NavigationModal</span> : null));

jest.mock('../../../features', () => ({
  ...jest.requireActual('../../../features'),
  CustomLabelsAccordion: () => () => (<span>CustomLabelsAccordion</span>),
}));

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
  isSelected: true,
  isLoaded: true,
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

const renderResourceEditManagedTitle = (props = {}) => render(
  <Harness>
    <CommandList commands={defaultKeyboardShortcuts}>
      <ResourceEditManagedTitle
        closeSelectionModal={noop}
        model={model}
        proxyTypes={proxyTypes}
        accessStatusTypes={accessStatusTypes}
        onCancel={noop}
        showSelectionModal={false}
        handleDeleteConfirmation={noop}
        handleOnSubmit={noop}
        getFooter={noop}
        getSectionHeader={noop}
        {...props}
      />
    </CommandList>
  </Harness>
);

describe('Given ResourceEditManagedTitle', () => {
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
});
