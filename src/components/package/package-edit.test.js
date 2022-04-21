import {
  render,
  cleanup,
  fireEvent,
} from '@testing-library/react';

import PackageEdit from './package-edit';
import Harness from '../../../test/jest/helpers/harness';
import getAxe from '../../../test/jest/helpers/get-axe';
import wait from '../../../test/jest/helpers/wait';

const model = {
  name: 'Package name',
  contentType: 'book',
  customCoverage: {
    beginCoverage: '2021-01-01',
    endCoverage: '2021-01-31',
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
    isResolved: true,
    errors: [],
  },
  destroy: {
    isPending: false,
    errors: [],
  },
};

const mockAddPackageToHoldings = jest.fn();
const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

jest.mock('./edit/components/edit-package-information', () => () => <div>Edit package information</div>);
jest.mock('./edit/components/edit-package-settings', () => () => <div>Edit package settings</div>);

const renderPackageEdit = (props = {}) => render(
  <Harness>
    <PackageEdit
      model={model}
      provider={{
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
      }}
      accessStatusTypes={{
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
      }}
      addPackageToHoldings={mockAddPackageToHoldings}
      onSubmit={mockOnSubmit}
      onCancel={mockOnCancel}
      proxyTypes={{
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
      }}
      {...props}
    />
  </Harness>
);

const axe = getAxe();

describe('Given PackageEdit', () => {
  afterEach(() => {
    cleanup();
    mockAddPackageToHoldings.mockClear();
  });

  it('should render page view', () => {
    const { getAllByText } = renderPackageEdit();

    expect(getAllByText('Package name')).toBeDefined();
  });

  it('should have no a11y issues', async () => {
    const { container } = renderPackageEdit();
    const a11yResults = await axe.run(container);

    expect(a11yResults.violations.length).toEqual(0);
  });

  it('should render coverage settings', () => {
    const { getByText } = renderPackageEdit();

    expect(getByText('ui-eholdings.package.coverageSettings')).toBeDefined();
  });

  it('should render package settings', () => {
    const { getByText } = renderPackageEdit();

    expect(getByText('Edit package settings')).toBeDefined();
  });

  it('should render package information', () => {
    const { getByText } = renderPackageEdit();

    expect(getByText('Edit package information')).toBeDefined();
  });

  describe('when editing a field', () => {
    it('should enable form buttons', () => {
      const {
        getByText,
        getByLabelText,
      } = renderPackageEdit({
        model: {
          ...model,
          isSelected: true,
        },
      });

      fireEvent.change(getByLabelText('ui-eholdings.date.startDate'), { target: { value: '01/01/2021' } });
      fireEvent.change(getByLabelText('ui-eholdings.date.endDate'), { target: { value: '01/31/2021' } });

      expect(getByText('stripes-components.saveAndClose')).toBeEnabled();
      expect(getByText('stripes-components.cancel')).toBeEnabled();
    });
  });

  describe('when clicking selection toggle button', () => {
    it('should show selection modal', async () => {
      const {
        getByText,
      } = renderPackageEdit({
        model: {
          ...model,
          isSelected: true,
        },
      });

      fireEvent.click(getByText('ui-eholdings.package.deletePackage'));
      await wait(1000);

      expect(getByText('ui-eholdings.package.modal.header.isCustom')).toBeDefined();
    });
  });

  describe('when confirming package deselection', () => {
    it('should submit form', async () => {
      const {
        getByText,
      } = renderPackageEdit({
        model: {
          ...model,
          isSelected: true,
        },
      });

      fireEvent.click(getByText('ui-eholdings.package.deletePackage'));
      await wait(1000);
      fireEvent.click(getByText('ui-eholdings.package.modal.buttonConfirm.isCustom'));
      await wait(1000);

      expect(mockOnSubmit).toBeCalled();
    });
  });

  describe('when package is managed', () => {
    it('should render page view', () => {
      const { getAllByText } = renderPackageEdit({
        model: {
          ...model,
          isCustom: false,
        },
      });

      expect(getAllByText('Package name')).toBeDefined();
    });

    it('should have no a11y issues', async () => {
      const { container } = renderPackageEdit({
        model: {
          ...model,
          isCustom: false,
        },
      });
      const a11yResults = await axe.run(container);

      expect(a11yResults.violations.length).toEqual(0);
    });

    it('should render coverage settings', () => {
      const { getByText } = renderPackageEdit({
        model: {
          ...model,
          isCustom: false,
        },
      });

      expect(getByText('ui-eholdings.package.coverageSettings')).toBeDefined();
    });

    it('should render package settings', () => {
      const { getByText } = renderPackageEdit({
        model: {
          ...model,
          isCustom: false,
        },
      });

      expect(getByText('Edit package settings')).toBeDefined();
    });

    describe('when editing a field', () => {
      it('should enable form buttons', () => {
        const {
          getByText,
          getByLabelText,
        } = renderPackageEdit({
          model: {
            ...model,
            isCustom: false,
            isSelected: true,
          },
        });

        fireEvent.change(getByLabelText('ui-eholdings.date.startDate'), { target: { value: '01/01/2021' } });
        fireEvent.change(getByLabelText('ui-eholdings.date.endDate'), { target: { value: '01/31/2021' } });

        expect(getByText('stripes-components.saveAndClose')).toBeEnabled();
        expect(getByText('stripes-components.cancel')).toBeEnabled();
      });
    });

    describe('when clicking selection toggle button', () => {
      it('should show selection modal', async () => {
        const {
          getByText,
        } = renderPackageEdit({
          model: {
            ...model,
            isCustom: false,
            isSelected: true,
          },
        });

        fireEvent.click(getByText('ui-eholdings.package.removeFromHoldings'));
        await wait(1000);

        expect(getByText('ui-eholdings.package.modal.header')).toBeDefined();
      });
    });

    describe('when confirming package deselection', () => {
      it('should submit form', async () => {
        const {
          getByText,
        } = renderPackageEdit({
          model: {
            ...model,
            isCustom: false,
            isSelected: true,
          },
        });

        fireEvent.click(getByText('ui-eholdings.package.removeFromHoldings'));
        await wait(1000);
        fireEvent.click(getByText('ui-eholdings.package.modal.buttonConfirm'));
        await wait(1000);

        expect(mockOnSubmit).toBeCalled();
      });
    });
  });

  describe('when request is rejected', () => {
    it('should show error message', () => {
      const { getByText } = renderPackageEdit({
        model: {
          ...model,
          isCustom: true,
          isLoaded: false,
          request: {
            isRejected: true,
            errors: [{
              title: 'An error has occured',
            }],
          },
        },
      });

      expect(getByText('An error has occured')).toBeDefined();
    });
  });
});
