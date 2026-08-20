import { MemoryRouter } from 'react-router-dom';
import {
  useHistory,
  useLocation,
  useParams,
} from 'react-router';

import {
  render,
  cleanup,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import PackageEditRoute from './package-edit-route';
import { usePackageModel } from '../../hooks';
import Harness from '../../../test/jest/helpers/harness';

const packageId = 'providerid-titleid';

const mockHistoryReplace = jest.fn();

const mockLocation = {
  pathname: 'pathname',
  search: '?searchType=packages&q=test&offset=1',
  hash: '',
};

const getModelMock = () => ({
  id: packageId,
  name: 'Test package',
  description: '',
  edition: '',
  contributors: [],
  customAltNames: [
    { altName: 'test alt name 1' },
  ],
  identifiers: [],
  isLoaded: true,
  isLoading: false,
  isCustom: true,
  isSelected: true,
  isPeerReviewed: false,
  titleCount: 100,
  publicationType: 'Unspecified',
  packageToken: {
    value: 'token-value',
  },
  update: {
    errors: [],
    isPending: false,
    isRejected: false,
  },
  request: {
    errors: [],
    isRejected: false,
  },
  destroy: {
    isPending: false,
    errors: [],
  },
  visibility: [
    { category: 'PF', hidden: false, reason: '' },
    { category: 'FTF', hidden: false, reason: '' },
    { category: 'MARC', hidden: false, reason: '' },
  ],
  proxy: {
    id: 'proxy-id',
    inherited: false,
  },
});

const accessStatusTypes = {
  isDeleted: false,
  isLoading: false,
  items: {
    data: [],
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

const mockDeletePackage = jest.fn();
const mockGetAccessTypes = jest.fn();
const mockGetProxyTypes = jest.fn();
const mockUpdatePackage = jest.fn();
const mockRemoveUpdateRequests = jest.fn();

const getPackageEditRoute = (props = {}) => {
  return (
    <MemoryRouter>
      <Harness>
        <PackageEditRoute
          accessStatusTypes={accessStatusTypes}
          proxyTypes={proxyTypes}
          getAccessTypes={mockGetAccessTypes}
          getProxyTypes={mockGetProxyTypes}
          {...props}
        />
      </Harness>
    </MemoryRouter>
  );
};

const renderPackageEditRoute = (props) => render(getPackageEditRoute(props));

describe('Given PackageEditRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useHistory.mockClear().mockReturnValue({
      replace: mockHistoryReplace,
      block: jest.fn().mockReturnValue(jest.fn()),
    });
    useParams.mockClear().mockReturnValue({
      packageId,
    });
    useLocation.mockClear().mockReturnValue(mockLocation);
    usePackageModel.mockClear().mockReturnValue({
      updatePackage: mockUpdatePackage,
      deletePackage: mockDeletePackage,
      model: getModelMock(),
    });
  });

  afterEach(cleanup);

  it('should request all data', async () => {
    await renderPackageEditRoute();

    expect(mockGetProxyTypes).toHaveBeenCalled();
    expect(mockGetAccessTypes).toHaveBeenCalled();
  });

  describe('when package is deleted', () => {
    beforeEach(() => {
      usePackageModel.mockClear().mockImplementation(({ onDeleteSuccess }) => {
        return {
          model: getModelMock(),
          deletePackage: () => onDeleteSuccess(),
        };
      });
    });

    it('should redirect back to search page', async () => {
      const { getAllByRole, getByRole } = await renderPackageEditRoute();

      fireEvent.click(getAllByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' })[0]);
      fireEvent.click(getByRole('button', { name: 'ui-eholdings.package.deletePackage' }));
      fireEvent.click(getByRole('button', { name: 'ui-eholdings.package.modal.buttonConfirm.isCustom' }));

      expect(mockHistoryReplace).toHaveBeenCalledWith({
        pathname: '/eholdings',
        search: mockLocation.search,
      }, { eholdings: true });
    });
  });

  describe('when submit form with edited package', () => {
    it('should handle updatepackage', () => {
      const { getByRole } = renderPackageEditRoute();

      const packageNameInput = getByRole('textbox', { name: 'ui-eholdings.label.name' });

      fireEvent.change(packageNameInput, { target: { value: 'New package name' } });
      fireEvent.blur(packageNameInput);

      fireEvent.click(getByRole('button', { name: 'stripes-components.saveAndClose' }));

      expect(mockUpdatePackage).toHaveBeenCalled();
    });
  });

  describe('when editing custom alt names and saving a package', () => {
    it('should call updatepackage with correct custom alt names', () => {
      const {
        getByRole,
        getAllByRole,
      } = renderPackageEditRoute();

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.label.addCustomAlternateName' }));

      const newCustomAltNameInput = getAllByRole('textbox', { name: 'ui-eholdings.label.customAlternateName' })[1];
      fireEvent.change(newCustomAltNameInput, { target: { value: 'test alt name 2' } });

      fireEvent.click(getByRole('button', { name: 'stripes-components.saveAndClose' }));

      expect(mockUpdatePackage).toHaveBeenCalledWith(expect.objectContaining({
        customAltNames: [
          { altName: 'test alt name 1' },
          { altName: 'test alt name 2' },
        ],
      }));
    });
  });

  describe('when click on close icon', () => {
    it('should redirect to the view package page', () => {
      const { getByRole } = renderPackageEditRoute();

      const packageNameInput = getByRole('textbox', { name: 'ui-eholdings.label.name' });

      fireEvent.change(packageNameInput, { target: { value: 'New package name' } });
      fireEvent.blur(packageNameInput);

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.label.icon.closeX' }));

      expect(mockHistoryReplace).toHaveBeenCalled();
    });
  });

  describe('when package is not pending anymore and needs update', () => {
    beforeEach(() => {
      usePackageModel.mockClear().mockImplementation(({ onUpdateSuccess }) => {
        return {
          model: getModelMock(),
          updatePackage: () => onUpdateSuccess(),
        };
      });
    });

    it('should redirect to the view package page', () => {
      const { getByRole } = renderPackageEditRoute();

      const packageNameInput = getByRole('textbox', { name: 'ui-eholdings.label.name' });
      fireEvent.change(packageNameInput, { target: { value: 'New package name' } });

      fireEvent.click(getByRole('button', { name: 'stripes-components.saveAndClose' }));

      expect(mockHistoryReplace).toHaveBeenCalledWith(expect.objectContaining({
        pathname: `/eholdings/packages/${packageId}`,
        search: mockLocation.search,
        state: { eholdings: true, isFreshlySaved: true }
      }));
    });
  });

  describe('when package is added to holdings', () => {
    const model = {
      ...getModelMock(),
      isSelected: false,
    };

    beforeEach(() => {
      usePackageModel.mockClear().mockReturnValue({
        model,
        updatePackage: mockUpdatePackage,
      });
    });

    it('should update package', () => {
      const { getByText } = renderPackageEditRoute();

      fireEvent.click(getByText('ui-eholdings.addPackageToHoldings'));

      expect(mockUpdatePackage).toHaveBeenCalledWith({
        ...model,
        isSelected: true,
        selectedCount: model.titleCount,
        allowKbToAddTitles: true,
      });
    });
  });

  describe('when date range in the "Coverage Settings" section is removed', () => {
    describe('and user clicks Save&Close button', () => {
      beforeEach(() => {
        usePackageModel.mockClear().mockReturnValue({
          model: {
            ...getModelMock(),
            isSelected: true,
            customCoverage: {
              beginCoverage: '2023-10-30',
              endCoverage: '2023-10-31',
            },
          },
          updatePackage: mockUpdatePackage,
        });
      });

      it('should update package with the empty customCoverage', () => {
        const {
          getByRole,
          getAllByRole,
        } = renderPackageEditRoute();

        // second returned element should be the delete coverage button
        const deleteCoverageButton = getAllByRole('button', { name: 'stripes-components.deleteThisItem' })[1];
        fireEvent.click(deleteCoverageButton);
        fireEvent.click(getByRole('button', { name: 'stripes-components.saveAndClose' }));

        expect(mockUpdatePackage).toHaveBeenCalledWith(expect.objectContaining({
          customCoverage: {},
        }));
      });
    });
  });

  describe('when a custom package is deselected', () => {
    const model = {
      ...getModelMock(),
      isCustom: true,
      isSelected: true,
    };

    beforeEach(() => {
      usePackageModel.mockClear().mockReturnValue({
        model,
        deletePackage: mockDeletePackage,
        updatePackage: mockUpdatePackage,
      });
    });

    it('should call deletePackage', () => {
      const { getByText } = renderPackageEditRoute();

      fireEvent.click(getByText('ui-eholdings.package.deletePackage'));
      fireEvent.click(getByText('ui-eholdings.package.modal.buttonConfirm.isCustom'));

      expect(mockDeletePackage).toHaveBeenCalled();
    });
  });

  describe('when a managed package is deselected', () => {
    const model = {
      ...getModelMock(),
      isCustom: false,
      isSelected: true,
    };

    beforeEach(() => {
      usePackageModel.mockClear().mockReturnValue({
        model,
        updatePackage: mockUpdatePackage,
      });
    });

    it('should call updatePackage', () => {
      const { getByText } = renderPackageEditRoute();

      fireEvent.click(getByText('ui-eholdings.package.removeFromHoldings'));
      fireEvent.click(getByText('ui-eholdings.package.modal.buttonConfirm'));

      expect(mockUpdatePackage).toHaveBeenCalledWith(expect.objectContaining({
        ...model,
        isSelected: false,
        visibility: [],
        customCoverage: {},
        allowKbToAddTitles: false,
        accessTypeId: null,
      }));
    });
  });
});
