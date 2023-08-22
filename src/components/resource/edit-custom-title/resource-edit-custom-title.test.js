import {
  fireEvent,
  render,
} from '@folio/jest-config-stripes/testing-library/react';
import { noop } from 'lodash';

import {
  CommandList,
  defaultKeyboardShortcuts,
} from '@folio/stripes-components';

import ResourceEditCustomTitle from './resource-edit-custom-title';
import Harness from '../../../../test/jest/helpers/harness';
import getAxe from '../../../../test/jest/helpers/get-axe';

jest.mock('../../navigation-modal', () => ({ when }) => (when ? <span>NavigationModal</span> : null));

jest.mock('../../../features', () => ({
  ...jest.requireActual('../../../features'),
  CustomLabelsAccordion: () => (<span>CustomLabelsAccordion</span>),
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
  name: 'resource name',
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
    isPending: false,
    isRejected: false,
    isResolved: false,
  },
  title: {
    name: 'titleName',
  },
  package: {
    name: 'packageName',
    titleCount: 4,
    proxy: {
      id: 'proxyId',
    },
    isCustom: true,
    visibilityData: {
      isHidden: false,
      reason: '',
    },
  },
  url: 'http://www.test-url.com',
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
  isTitleCustom: true,
};

const renderResourceEditCustomTitle = (props = {}) => render(
  <Harness>
    <CommandList commands={defaultKeyboardShortcuts}>
      <ResourceEditCustomTitle
        closeSelectionModal={noop}
        model={model}
        proxyTypes={proxyTypes}
        accessStatusTypes={accessStatusTypes}
        onCancel={noop}
        showSelectionModal={false}
        handleDeleteConfirmation={noop}
        handleOnSubmit={noop}
        getFooter={noop}
        getSectionHeader={(id) => id}
        {...props}
      />
    </CommandList>
  </Harness>
);

const axe = getAxe();

describe('Given ResourceEditCustomTitle', () => {
  it('should have no a11y issues', async () => {
    const { container } = renderResourceEditCustomTitle();
    const a11yResults = await axe.run(container);

    expect(a11yResults.violations.length).toEqual(0);
  });

  it('should check dates radio button', () => {
    const { getByLabelText } = renderResourceEditCustomTitle();

    expect(getByLabelText('ui-eholdings.label.dates').checked).toBeTruthy();
    expect(getByLabelText('ui-eholdings.label.coverageStatement').checked).toBeFalsy();
  });

  describe('when coverage statement is not empty', () => {
    it('should check coverage statement radio button', () => {
      const { getByLabelText } = renderResourceEditCustomTitle({
        model: {
          ...model,
          coverageStatement: '123',
        },
      });

      expect(getByLabelText('ui-eholdings.label.dates').checked).toBeFalsy();
      expect(getByLabelText('ui-eholdings.label.coverageStatement').checked).toBeTruthy();
    });
  });

  it('should display custom URL', () => {
    const { getByText, getByDisplayValue } = renderResourceEditCustomTitle();

    expect(getByText('ui-eholdings.customUrl')).toBeDefined();
    expect(getByDisplayValue('http://www.test-url.com')).toBeDefined();
  });

  it('should not display action menu', () => {
    const { queryByText } = renderResourceEditCustomTitle({
      model: {
        ...model,
        isSelected: false,
      },
    });

    expect(queryByText('ui-eholdings.resource.actionMenu.removeHolding')).toBeNull();
  });

  describe('selection modal', () => {
    it('should have no a11y issues', async () => {
      const { container } = renderResourceEditCustomTitle({
        showSelectionModal: true,
      });
      const a11yResults = await axe.run(container);

      expect(a11yResults.violations.length).toEqual(0);
    });

    it('should display remove title warning', () => {
      const { queryByText } = renderResourceEditCustomTitle({
        showSelectionModal: true,
      });

      expect(queryByText('ui-eholdings.resource.modal.body')).toBeDefined();
    });

    it('should display remove last title warning', () => {
      const { queryByText } = renderResourceEditCustomTitle({
        showSelectionModal: true,
        model: {
          ...model,
          package: {
            ...model.package,
            titleCount: 1,
          },
        },
      });

      expect(queryByText('ui-eholdings.resource.modal.body.isCustom.lastTitle')).toBeDefined();
    });

    it('should show confirm button in selection modal', () => {
      const { getByText } = renderResourceEditCustomTitle({
        showSelectionModal: true,
      });

      expect(getByText('ui-eholdings.resource.modal.buttonConfirm')).toBeDefined();
    });

    describe('when model updating on pending', () => {
      it('should show removing button in selection modal', () => {
        const { getByText } = renderResourceEditCustomTitle({
          showSelectionModal: true,
          model: {
            ...model,
            destroy: {
              ...model.destroy,
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
        const { getByText } = renderResourceEditCustomTitle({
          closeSelectionModal: mockCloseSelectionModal,
          showSelectionModal: true,
        });

        fireEvent.click(getByText('ui-eholdings.resource.modal.buttonCancel'));

        expect(mockCloseSelectionModal).toHaveBeenCalled();
      });
    });
  });
});
