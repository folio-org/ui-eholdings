import { useLocation } from 'react-router';
import { Field } from 'react-final-form';

import { TextArea } from '@folio/stripes/components';
import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import PackageCreateRoute from './package-create-route';
import { CustomDescription } from '../../components/package/_fields/custom-description';
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

// the real CustomDescription uses a wysiwyg Editor component, but user interactions in a test environment
// seem to not work, so here we're going to mock it with a regular textarea to test integration
jest.mock('../../components/package/_fields/custom-description', () => ({
  CustomDescription: jest.fn(),
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
  beforeEach(() => {
    jest.clearAllMocks();
    CustomDescription.mockReturnValue(
      <Field
        name="customDescription"
        type="text"
        component={TextArea}
        label="customDescription"
      />
    );
  });

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

      const customDescriptionInput = getByRole('textbox', { name: 'customDescription' });

      fireEvent.change(customDescriptionInput, { target: { value: 'New custom description' } });

      const addCoverageSettingsButton = getByText('ui-eholdings.package.coverage.addDateRange');

      fireEvent.click(addCoverageSettingsButton);

      const deleteEmbargoBtn = getByRole('button', { name: 'stripes-components.deleteThisItem' });
      fireEvent.click(deleteEmbargoBtn);

      fireEvent.click(getByRole('button', { name: 'stripes-components.saveAndClose' }));

      expect(mockCreatePackage.mock.calls[0][0]).toEqual(expect.objectContaining({
        contentType: 'Unknown',
        customDescription: 'New custom description',
        isFreeAccess: false,
        name: 'New package name',
      }));
    });
  });

  describe('when customCoverages contains a date range', () => {
    it('should format the dates using YYYY-MM-DD', async () => {
      const {
        getByRole,
        getByText,
      } = renderPackageCreateRoute();

      const packageNameInput = getByRole('textbox', { name: 'ui-eholdings.label.name' });

      fireEvent.change(packageNameInput, { target: { value: 'New package name' } });

      const addCoverageSettingsButton = getByText('ui-eholdings.package.coverage.addDateRange');

      fireEvent.click(addCoverageSettingsButton);

      const startCoverageField = getByRole('textbox', { name: 'ui-eholdings.date.startDate' });
      const endCoverageField = getByRole('textbox', { name: 'ui-eholdings.date.endDate' });

      fireEvent.change(startCoverageField, { target: { value: '01/01/2026' } });
      fireEvent.change(endCoverageField, { target: { value: '01/02/2026' } });

      fireEvent.click(getByRole('button', { name: 'stripes-components.saveAndClose' }));

      expect(mockCreatePackage.mock.calls[0][0]).toEqual(expect.objectContaining({
        contentType: 'Unknown',
        isFreeAccess: false,
        name: 'New package name',
        customCoverage: {
          beginCoverage: '2026-01-01',
          endCoverage: '2026-01-02',
        },
      }));
    });
  });

  describe('when customDisplayName, customDescription, url contain empty entries', () => {
    it('should filter out the empty entries', async () => {
      const { getByRole } = renderPackageCreateRoute();

      const packageNameInput = getByRole('textbox', { name: 'ui-eholdings.label.name' });

      fireEvent.change(packageNameInput, { target: { value: 'New package name' } });

      const customDescriptionInput = getByRole('textbox', { name: 'customDescription' });
      fireEvent.change(customDescriptionInput, { target: { value: '   ' } });

      const customDisplayNameInput = getByRole('textbox', { name: 'ui-eholdings.label.displayName' });
      fireEvent.change(customDisplayNameInput, { target: { value: '   ' } });

      const urlInput = getByRole('textbox', { name: 'ui-eholdings.label.packageUrl' });
      fireEvent.change(urlInput, { target: { value: '   ' } });

      const addAltNameBtn = getByRole('button', { name: 'ui-eholdings.label.addCustomAlternateName' });
      fireEvent.click(addAltNameBtn);

      const customAltNameInput = getByRole('textbox', { name: 'ui-eholdings.label.customAlternateNames' });
      fireEvent.change(customAltNameInput, { target: { value: '   ' } });

      fireEvent.click(getByRole('button', { name: 'stripes-components.saveAndClose' }));

      expect(mockCreatePackage.mock.calls[0][0]).toEqual({
        accessTypeId: undefined,
        contentType: 'Unknown',
        isFreeAccess: false,
        name: 'New package name',
        customAltNames: [],
      });
    });
  });
});
