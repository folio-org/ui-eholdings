import { MemoryRouter } from 'react-router';

import {
  render,
  cleanup,
  act,
  fireEvent,
} from '@testing-library/react';

import PackageCreateRoute from './package-create';
import Harness from '../../../test/jest/helpers/harness';

const mockHistory = {
  replace: jest.fn(),
  goBack: jest.fn(),
};

const location = {
  pathname: 'pathname',
  search: '',
  hash: '',
};

const createRequest = {
  timestamp: 0,
  type: 'create',
  params: {},
  isPending: false,
  isResolved: false,
  isRejected: false,
  records: [],
  meta: {},
  errors: [],
};

const accessStatusTypes = {
  isDeleted: false,
  isLoading: false,
  items: {
    data: {},
  },
};

const mockGetAccessTypes = jest.fn();
const mockCreatePackage = jest.fn();
const mockRemoveCreateRequests = jest.fn();

const getPackageCreateRoute = (props = {}) => (
  <MemoryRouter>
    <Harness>
      <PackageCreateRoute
        accessStatusTypes={accessStatusTypes}
        createPackage={mockCreatePackage}
        createRequest={createRequest}
        getAccessTypes={mockGetAccessTypes}
        history={mockHistory}
        location={location}
        removeCreateRequests={mockRemoveCreateRequests}
        {...props}
      />
    </Harness>
  </MemoryRouter>
);

const renderPackageCreateRoute = (props = {}) => render(getPackageCreateRoute(props));

describe('Given PackageCreateRoute', () => {
  beforeEach(() => {
    mockGetAccessTypes.mockClear();
    mockCreatePackage.mockClear();
    mockRemoveCreateRequests.mockClear();
    mockHistory.replace.mockClear();
  });

  afterEach(cleanup);

  it('should handle getAccessTypes', async () => {
    await act(async () => {
      await renderPackageCreateRoute({
        props:{ getAccessTypes: mockGetAccessTypes },
      });
    });

    expect(mockGetAccessTypes).toHaveBeenCalled();
  });

  describe('when request is not resolved', () => {
    it('should not redirect to new package record', () => {
      const { rerender } = renderPackageCreateRoute();

      rerender(getPackageCreateRoute({
        createRequest: {
          ...createRequest,
          isResolved: false,
        },
      }));

      expect(mockHistory.replace).toHaveBeenCalledTimes(0);
    });
  });

  describe('when request is resolved', () => {
    it('should redirect to new package record', () => {
      const { rerender } = renderPackageCreateRoute();

      rerender(getPackageCreateRoute({
        createRequest: {
          ...createRequest,
          isResolved: true,
        },
      }));

      expect(mockHistory.replace).toHaveBeenCalled();
    });
  });

  describe('when click on close icon and form is not pristine', () => {
    it('should handle history.goBack', () => {
      const { getByRole } = renderPackageCreateRoute({
        location: {
          ...location,
          state: { eholdings: true },
        },
      });

      const packageNameInput = getByRole('textbox', { name: 'ui-eholdings.label.name' });

      fireEvent.change(packageNameInput, { target: { value: 'New package name' } });
      fireEvent.blur(packageNameInput);

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.label.icon.closeX' }));

      expect(mockHistory.goBack).toHaveBeenCalled();
    });
  });

  describe('when submit form with some values and click save', () => {
    it('should handle mockCreatePackage action', () => {
      const { getByRole } = renderPackageCreateRoute();

      const packageNameInput = getByRole('textbox', { name: 'ui-eholdings.label.name' });

      fireEvent.change(packageNameInput, { target: { value: 'New package name' } });
      fireEvent.blur(packageNameInput);

      fireEvent.click(getByRole('button', { name: 'stripes-components.saveAndClose' }));

      expect(mockCreatePackage).toHaveBeenCalled();
    });
  });
});

