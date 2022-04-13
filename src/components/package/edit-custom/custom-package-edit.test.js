import noop from 'lodash/noop';

import {
  render,
  fireEvent,
} from '@testing-library/react';

import Harness from '../../../../test/jest/helpers/harness';

import CustomPackageEdit from './custom-package-edit';

jest.mock('../../navigation-modal', () => ({ when }) => (when ? <div>NavigationModal component</div> : null));

const model = {
  name: 'Package name',
  contentType: 'book',
  customCoverage: {
    beginCoverage: '',
    endCoverage: '',
  },
  packageToken: {
    value: 'token',
  },
  visibilityData: {
    isHidden: false,
    reason: '',
  },
  proxy: {
    id: 'proxy-id',
  },
  isSelected: true,
  isLoaded: true,
  isLoading: false,
  isCustom: true,
  request: {
    isRejected: false,
    errors: [],
  },
  update: {
    isPending: false,
    isRejected: false,
    isResolved: true,
    errors: [],
  },
  destroy: {
    isPending: false,
    errors: [],
  },
};

const provider = {
  data: {
    isLoaded: true,
    isLoading: false,
  },
  providerToken: {
    prompt: '',
  },
  proxy: {
    id: 'proxy-id',
  },
};

const accessStatusTypes = {
  isDeleted: false,
  isLoading: false,
  items: {
    data: [{
      id: 'access-type-id',
      type: 'accessTypes',
      attributes: {
        name: 'access type',
      },
    }],
  },
};

const proxyTypes = {
  request: {
    isResolved: true,
  },
  resolver: {
    state: {
      proxyTypes: {
        records: {
          'proxy-id': {
            id: 'proxy-id',
            attributes: {
              name: 'Some Proxy',
            },
          },
          'proxy-id-2': {
            id: 'proxy-id-2',
            attributes: {
              name: 'Some Other Proxy',
            },
          },
        },
      },
    },
  },
};

const renderCustomPackageEdit = (props = {}) => render(
  <Harness>
    <CustomPackageEdit
      model={model}
      proxyTypes={proxyTypes}
      provider={provider}
      onCancel={noop}
      onSubmit={noop}
      accessStatusTypes={accessStatusTypes}
      addPackageToHoldings={noop}
      {...props}
    />
  </Harness>
);

describe('Given CustomPackageEdit', () => {
  describe('when package is not selected', () => {
    it('should not show delete package button', () => {
      const { queryByText } = renderCustomPackageEdit({
        model: {
          ...model,
          isSelected: false,
        },
      });

      expect(queryByText('ui-eholdings.package.deletePackage')).toBeNull();
    });
  });

  describe('when some fields were edited', () => {
    it('should show navigation modal', () => {
      const {
        getByLabelText,
        getByText,
      } = renderCustomPackageEdit({
        model: {
          ...model,
          update: {
            ...model.update,
            isResolved: false,
          },
        },
      });

      fireEvent.change(getByLabelText('ui-eholdings.date.startDate'), { target: { value: '01/01/2021' } });

      fireEvent.click(getByText('stripes-components.cancel'));

      expect(getByText('NavigationModal component')).toBeDefined();
    });
  });

  describe('when click "Delete package" in actions menu', () => {
    it('should display Selection Modal', () => {
      const {
        getByRole,
        getByTestId,
      } = renderCustomPackageEdit();

      fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));
      fireEvent.click(getByRole('button', { name: 'ui-eholdings.package.deletePackage' }));

      expect(getByTestId('eholdings-confirmation-modal')).toBeDefined();
    });
  });

  describe('when model update isPending', () => {
    it('should display "Deleting..." button instead of "Yes, delete" on Selection Modal', () => {
      const {
        getByRole,
        getByTestId,
      } = renderCustomPackageEdit({
        model: {
          ...model,
          proxy: {
            id: 'proxyId',
          },
          destroy: {
            ...model.destroy,
            isPending: true,
          },
        },
      });

      fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));
      fireEvent.click(getByRole('button', { name: 'ui-eholdings.package.deletePackage' }));

      expect(getByTestId('eholdings-confirmation-modal')).toBeDefined();
      expect(getByRole('button', { name: 'ui-eholdings.package.modal.buttonWorking.isCustom' })).toBeDefined();
    });
  });
});
