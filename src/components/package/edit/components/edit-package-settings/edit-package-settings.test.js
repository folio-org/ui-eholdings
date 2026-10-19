import {
  render,
  cleanup,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import Harness from '../../../../../../test/jest/helpers/harness';

import EditPackageSettings from './edit-package-settings';

jest.mock('../../../../proxy-select', () => () => <div>Proxy select</div>);
jest.mock('../../../../access-type-edit-section', () => () => <div>Access type edit section</div>);

describe('Given EditPackageSettings', () => {
  const mockOnToggle = jest.fn();
  const mockOnSubmit = jest.fn();
  const visibility = [
    { category: 'PF', hidden: false, reason: '' },
    { category: 'FTF', hidden: true, reason: '' },
    { category: 'MARC', hidden: false, reason: '' },
  ];
  const initialValues = {
    visibility,
  };

  const renderEditPackageSettings = (props = {}) => render(
    <Harness>
      <Form
        onSubmit={mockOnSubmit}
        initialValuesEqual={() => true}
        mutators={{ ...arrayMutators }}
        initialValues={initialValues}
        render={({ pristine, form: { reset } }) => (
          <form onSubmit={mockOnSubmit}>
            <EditPackageSettings
              isOpen
              onToggle={mockOnToggle}
              getSectionHeader={() => 'Package settings'}
              packageSelected
              initialValues={initialValues}
              model={{
                visibility,
              }}
              proxyTypes={{
                request: {
                  isResolved: true,
                },
              }}
              provider={{
                isLoaded: true,
                proxy: { id: 'provider-proxy-id' },
              }}
              {...props}
            />
            <button type="button" disabled={pristine} onClick={reset}>Cancel</button>
            <button type="submit" disabled={pristine}>Submit</button>
          </form>
        )}
      />
    </Harness>
  );

  afterEach(() => {
    cleanup();
    mockOnToggle.mockClear();
    mockOnSubmit.mockClear();
  });

  it('should render an accordion', () => {
    const { getByText } = renderEditPackageSettings();

    expect(getByText('Package settings')).toBeDefined();
  });

  describe('when package is not selected', () => {
    it('should render message', () => {
      const { getByText } = renderEditPackageSettings({
        packageSelected: false,
        packageIsCustom: true,
      });

      expect(getByText('ui-eholdings.package.packageSettings.notSelected')).toBeDefined();
    });
  });

  it('should render the visibility section headline', () => {
    const { getByText } = renderEditPackageSettings();

    expect(getByText('ui-eholdings.package.visibility')).toBeDefined();
  });

  it('should render custom package fields for custom packages', () => {
    const {
      container,
      getByRole,
    } = renderEditPackageSettings({ packageIsCustom: true });

    expect(getByRole('textbox', { name: 'ui-eholdings.label.packageUrl' })).toBeDefined();
    fireEvent.click(getByRole('button', { name: 'ui-eholdings.label.addCustomAlternateName' }));
    expect(getByRole('textbox', { name: 'ui-eholdings.label.customAlternateNames' })).toBeDefined();
    expect(container.querySelector('[contenteditable="true"]')).not.toBeNull();
    expect(container.querySelector('[data-test-eholdings-package-proxy-select-field]')).not.toBeNull();
  });

  it('should render managed package settings', () => {
    const managedPackageView = renderEditPackageSettings();

    expect(managedPackageView.container.querySelector('textarea[name="url"]')).toBeNull();
    expect(managedPackageView.container.querySelector('[data-test-eholdings-package-proxy-select-field]')).not.toBeNull();
    expect(managedPackageView.getByText('Access type edit section')).toBeDefined();
    expect(managedPackageView.getByText('ui-eholdings.package.managedAltNames')).toBeDefined();
  });

  it('should render managed package URL, alternate names, and read-only description', () => {
    const managedPackageView = renderEditPackageSettings({
      model: {
        visibility,
        url: 'https://example.com',
        managedAltNames: [{ altName: 'Managed alternate name' }],
        managedDescription: '<p>Managed description</p>',
      },
    });

    expect(managedPackageView.getByRole('link', { name: /https:\/\/example\.com/ })).toHaveAttribute('href', 'https://example.com');
    expect(managedPackageView.getByText('Managed alternate name')).toBeDefined();
    expect(managedPackageView.getByText('ui-eholdings.package.managedDescription')).toBeDefined();
    expect(managedPackageView.container.querySelector('.ql-editor').textContent).toContain('Managed description');
    expect(managedPackageView.container.querySelector('.ql-editor')).toHaveAttribute('contenteditable', 'false');
  });

  it('should not render managed-only fields for custom packages', () => {
    const customPackageView = renderEditPackageSettings({ packageIsCustom: true });

    expect(customPackageView.queryByText('Access type edit section')).toBeNull();
    expect(customPackageView.queryByText('ui-eholdings.package.managedAltNames')).toBeNull();
    expect(customPackageView.queryByText('ui-eholdings.package.managedDescription')).toBeNull();
  });
});
