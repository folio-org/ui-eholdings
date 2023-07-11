import {
  render,
  fireEvent,
} from '@testing-library/react';

import noop from 'lodash/noop';

import PackageCreate from './package-create';

import { contentTypes } from '../../../constants';

jest.mock('../_fields/custom-coverage', () => () => (<div>CoverageFields component</div>));
jest.mock('../../navigation-modal', () => ({ when }) => (when ? <div>NavigationModal component</div> : null));

const accessStatusTypes = {
  isDeleted: false,
  isLoading: false,
  items: {
    data: [],
  },
};

const renderPackageCreate = (props = {}) => render(
  <PackageCreate
    request={{ errors: [] }}
    onSubmit={noop}
    removeCreateRequests={noop}
    accessStatusTypes={accessStatusTypes}
    {...props}
  />
);

describe('PackageCreate', () => {
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

  describe('when an error occurs', () => {
    it('should show toast with the message', () => {
      const { getByText } = renderPackageCreate({
        request: {
          errors: [
            {
              title: 'Error title',
            },
          ],
        },
      });

      expect(getByText('Error title')).toBeDefined();
    });
  });
});
