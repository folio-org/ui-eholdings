import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import noop from 'lodash/noop';

import { PackageCreate } from './package-create';

import { contentTypes } from '../../../constants';

jest.mock('../_fields/custom-coverage', () => () => (<div>CoverageFields component</div>));
jest.mock('../../navigation-modal', () => ({ when }) => (when ? <div>NavigationModal component</div> : null));

const mockSendCallout = jest.fn();

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useCallout: jest.fn(() => ({
    sendCallout: mockSendCallout,
  })),
}));

const accessStatusTypes = {
  isDeleted: false,
  isLoading: false,
  items: {
    data: [],
  },
};

const renderPackageCreate = (props = {}) => render(
  <PackageCreate
    onSubmit={noop}
    accessStatusTypes={accessStatusTypes}
    isPackageCreateLoading={false}
    {...props}
  />
);

describe('PackageCreate', () => {
  beforeEach(() => {
    mockSendCallout.mockClear();
  });

  it('should render Package create page', () => {
    const { getByTestId } = renderPackageCreate();

    expect(getByTestId('data-test-eholdings-package-create')).toBeDefined();
  });

  it('should display the first menu pane', () => {
    const {
      getByText,
      getByRole,
    } = renderPackageCreate({
      onCancel: noop,
    });

    expect(getByText('ui-eholdings.package.create.custom')).toBeDefined();
    expect(getByRole('button', { name: 'ui-eholdings.label.icon.closeX' })).toBeDefined();
  });

  it('should not display close button in the first menu pane', () => {
    const { queryByRole } = renderPackageCreate();

    expect(queryByRole('button', { name: 'ui-eholdings.label.icon.closeX' })).toBeNull();
  });

  it('should display Package information headline', () => {
    const { getByText } = renderPackageCreate();

    expect(getByText('ui-eholdings.package.packageInformation')).toBeDefined();
  });

  it('should display input for package name', () => {
    const { getByRole } = renderPackageCreate();

    expect(getByRole('textbox', { name: 'ui-eholdings.label.name' })).toBeDefined();
  });

  it('should display dropdown field for package content type', () => {
    const { getByRole } = renderPackageCreate();

    expect(getByRole('combobox', { name: 'Content type' })).toBeDefined();
  });

  it('should display correct dropdown options for package content type', () => {
    const { getByText } = renderPackageCreate();

    Object.keys(contentTypes).forEach(contentType => {
      expect(getByText(`ui-eholdings.filter.contentType.${contentType.toLowerCase()}`)).toBeDefined();
    });
  });

  it('should display Coverage settings headline', () => {
    const { getByText } = renderPackageCreate();

    expect(getByText('ui-eholdings.label.coverageSettings')).toBeDefined();
  });

  it('should render CoverageFields component', () => {
    const { getByText } = renderPackageCreate();

    expect(getByText('CoverageFields component')).toBeDefined();
  });

  it('should display footer buttons', () => {
    const { getByRole } = renderPackageCreate();

    expect(getByRole('button', { name: 'stripes-components.cancel' })).toBeDefined();
    expect(getByRole('button', { name: 'stripes-components.saveAndClose' })).toBeDefined();
  });

  describe('when isPackageCreateLoading is true', () => {
    it('should disable the footer buttons', () => {
      const { getByRole } = renderPackageCreate({
        isPackageCreateLoading: true,
      });

      expect(getByRole('button', { name: 'stripes-components.cancel' })).toBeDisabled();
      expect(getByRole('button', { name: 'stripes-components.saveAndClose' })).toBeDisabled();
    });
  });

  describe('when click on close icon and form is not pristine', () => {
    it('should show navigation modal', () => {
      const {
        getByRole,
        getByText,
      } = renderPackageCreate({
        onCancel: noop,
      });

      const packageNameInput = getByRole('textbox', { name: 'ui-eholdings.label.name' });

      fireEvent.change(packageNameInput, { target: { value: 'Package name' } });
      fireEvent.blur(packageNameInput);

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.label.icon.closeX' }));

      expect(getByText('NavigationModal component')).toBeDefined();
    });
  });

  describe('when packageCreateErrors are provided', () => {
    it('should send a callout for each error', () => {
      renderPackageCreate({
        packageCreateErrors: [
          { title: 'Error title 1' },
          { title: 'Error title 2' },
        ],
      });

      expect(mockSendCallout).toHaveBeenCalledTimes(2);
      expect(mockSendCallout).toHaveBeenNthCalledWith(1, {
        id: 'error-0',
        message: 'Error title 1',
        type: 'error',
      });
      expect(mockSendCallout).toHaveBeenNthCalledWith(2, {
        id: 'error-1',
        message: 'Error title 2',
        type: 'error',
      });
    });
  });
});
