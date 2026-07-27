import { useLocation } from 'react-router';

import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import PackageCreateRoute from './package-create-route';
import { usePackageCreate } from '../../hooks';
import Harness from '../../../test/jest/helpers/harness';

const mockHistory = {
  replace: jest.fn(),
  goBack: jest.fn(),
  block: jest.fn().mockReturnValue(jest.fn()),
};

const mockLocation = {
  pathname: 'pathname',
  search: '',
  hash: '',
};

const mockGetAccessTypes = jest.fn();
const mockCreatePackage = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn(() => mockHistory),
  useLocation: jest.fn(() => mockLocation),
}));

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  usePackageCreate: jest.fn(() => ({
    createPackage: mockCreatePackage,
    isLoading: false,
    errors: [],
  })),
}));

const accessStatusTypes = {
  isDeleted: false,
  isLoading: false,
  items: {
    data: [],
  },
};

const getPackageCreateRoute = (props = {}) => (
  <Harness>
    <PackageCreateRoute
      accessStatusTypes={accessStatusTypes}
      getAccessTypes={mockGetAccessTypes}
      {...props}
    />
    Page content
  </Harness>
);

const renderPackageCreateRoute = (props = {}) => render(getPackageCreateRoute(props));

describe('Given PackageCreateRoute', () => {
  it('should render PackageCreateRoute', () => {
    const { getByText } = renderPackageCreateRoute();

    expect(getByText('Page content')).toBeDefined();
  });

  it('should handle getAccessTypes', () => {
    renderPackageCreateRoute();

    expect(mockGetAccessTypes).toHaveBeenCalled();
  });

  describe('when the create request has not resolved', () => {
    it('should not redirect to a new package record', () => {
      renderPackageCreateRoute();

      expect(mockHistory.replace).not.toHaveBeenCalled();
    });
  });

  describe('when the create request resolves successfully', () => {
    it('should redirect to the new package record', () => {
      renderPackageCreateRoute();

      const { onSuccess } = usePackageCreate.mock.calls[0][0];

      onSuccess({ data: { id: 'new-package-id' } });

      expect(mockHistory.replace).toHaveBeenCalledWith(
        '/eholdings/packages/new-package-id',
        { eholdings: true, isNewRecord: true },
      );
    });
  });

  describe('when click on close icon and form is not pristine', () => {
    it('should handle history.goBack', () => {
      useLocation.mockReturnValueOnce({
        ...mockLocation,
        state: { eholdings: true },
      });

      const { getByRole } = renderPackageCreateRoute();

      const packageNameInput = getByRole('textbox', { name: 'ui-eholdings.label.name' });

      fireEvent.change(packageNameInput, { target: { value: 'New package name' } });
      fireEvent.blur(packageNameInput);

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.label.icon.closeX' }));

      expect(mockHistory.goBack).toHaveBeenCalled();
    });
  });

  describe('when submit form with some values and click save', () => {
    it('should call createPackage from usePackageCreate', () => {
      const {
        getByRole,
        getByText,
        getByTestId,
      } = renderPackageCreateRoute();

      const packageNameInput = getByRole('textbox', { name: 'ui-eholdings.label.name' });

      fireEvent.change(packageNameInput, { target: { value: 'New package name' } });
      fireEvent.blur(packageNameInput);

      const addCoverageSettingsButton = getByText('ui-eholdings.package.coverage.addDateRange');

      fireEvent.click(addCoverageSettingsButton);

      fireEvent.change(getByTestId('begin-coverage-0'), { target: { value: '01/01/2022' } });
      fireEvent.change(getByTestId('end-coverage-0'), { target: { value: '10/01/2022' } });
      fireEvent.blur(getByTestId('begin-coverage-0'));
      fireEvent.blur(getByTestId('end-coverage-0'));

      fireEvent.click(getByRole('button', { name: 'stripes-components.saveAndClose' }));

      expect(mockCreatePackage).toHaveBeenCalled();
    });
  });

  describe('when user adds a name, adds and delete date range and clicks on Save&close button', () => {
    it('should call createPackage from usePackageCreate', () => {
      const {
        getByRole,
        getByText,
      } = renderPackageCreateRoute();

      const packageNameInput = getByRole('textbox', { name: 'ui-eholdings.label.name' });

      fireEvent.change(packageNameInput, { target: { value: 'New package name' } });

      const addCoverageSettingsButton = getByText('ui-eholdings.package.coverage.addDateRange');

      fireEvent.click(addCoverageSettingsButton);

      const deleteEmbargoBtn = getByRole('button', { name: 'stripes-components.deleteThisItem' });
      fireEvent.click(deleteEmbargoBtn);

      fireEvent.click(getByRole('button', { name: 'stripes-components.saveAndClose' }));

      expect(mockCreatePackage).toHaveBeenCalled();
    });
  });
});
