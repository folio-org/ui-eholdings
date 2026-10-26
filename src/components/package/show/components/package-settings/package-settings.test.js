import {
  render,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';

import Harness from '../../../../../../test/jest/helpers/harness';

import PackageSettings from './package-settings';

jest.mock('../../../../access-type-display', () => () => <span>Access type display</span>);

jest.mock('../../../../proxy-display', () => () => <span>Proxy display</span>);

jest.mock('../../../../token-display', () => ({ type }) => <span>{type} token display</span>);

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Editor: ({ value, readOnly, modules }) => (
    <div
      role="textbox"
      aria-label={value}
      aria-readonly={String(readOnly)}
      data-toolbar={String(modules?.toolbar)}
    >
      {value}
    </div>
  ),
}));

const model = {
  isLoading: false,
  isLoaded: true,
  isCustom: false,
  packageToken: {
    prompt: '',
  },
  visibility: [
    { category: 'PF', hidden: false, reason: '' },
    { category: 'FTF', hidden: false, reason: '' },
    { category: 'MARC', hidden: true, reason: '' },
  ],
  proxy: {
    id: 'proxy-id',
  },
  data: {
    relationships: {
      accessType: {
        data: {
          id: 'access-type-id',
        },
      },
    },
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
          EZProxy: {
            id: 'EZPoxy',
          },
        },
      },
    },
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

describe('Given PackageSettings', () => {
  let component;
  const onToggleMock = jest.fn();

  const renderPackageSettings = (props = {}) => render(
    <Harness>
      <PackageSettings
        isOpen
        onToggle={onToggleMock}
        model={model}
        packageAllowedToAddTitles
        packageSelected
        proxyTypes={proxyTypes}
        accessStatusTypes={accessStatusTypes}
        {...props}
      />
    </Harness>
  );

  afterEach(() => {
    cleanup();
    onToggleMock.mockClear();
  });

  it('should render an accordion', () => {
    component = renderPackageSettings();
    expect(component.getByText('ui-eholdings.package.packageSettings')).toBeDefined();
  });

  it('should render proxy display', () => {
    component = renderPackageSettings();
    expect(component.getByText('Proxy display')).toBeDefined();
  });

  it('should render access type display', () => {
    component = renderPackageSettings();
    expect(component.getByText('Proxy display')).toBeDefined();
  });

  describe('when a package is not selected', () => {
    it('should render package not selected message', () => {
      component = renderPackageSettings({
        packageSelected: false,
      });
      expect(component.getByText('ui-eholdings.package.visibility.notSelected')).toBeDefined();
    });
  });

  it('should render access types display', () => {
    component = renderPackageSettings();
    expect(component.getByText('Access type display')).toBeDefined();
  });

  it('should render the managed alternate names label for managed packages', () => {
    component = renderPackageSettings();

    expect(component.getByText('ui-eholdings.package.managedAltNames')).toBeDefined();
  });

  it('should render the custom alternate names label for custom packages', () => {
    component = renderPackageSettings({
      model: {
        ...model,
        isCustom: true,
      },
    });

    expect(component.getByText('ui-eholdings.package.customAltNames')).toBeDefined();
  });

  it('should render package URL and managed and custom descriptions from the model', () => {
    component = renderPackageSettings({
      model: {
        ...model,
        url: 'https://example.com',
        managedDescription: '<p>Managed description</p>',
        customDescription: '<p>Custom description</p>',
      },
    });

    expect(component.getByRole('link', { name: 'https://example.com' })).toHaveAttribute('href', 'https://example.com');
    expect(component.getByText('ui-eholdings.package.managedDescription')).toBeDefined();
    expect(component.getByText('ui-eholdings.label.customDescription')).toBeDefined();
    expect(component.getByRole('textbox', { name: '<p>Managed description</p>' })).toHaveAttribute('aria-readonly', 'true');
    expect(component.getByRole('textbox', { name: '<p>Custom description</p>' })).toHaveAttribute('aria-readonly', 'true');
  });

  it('should render a visibility checkbox for each visibility option', () => {
    component = renderPackageSettings();

    expect(component.getByLabelText('ui-eholdings.package.visibility.PF')).toBeDefined();
    expect(component.getByLabelText('ui-eholdings.package.visibility.FTF')).toBeDefined();
    expect(component.getByLabelText('ui-eholdings.package.visibility.MARC')).toBeDefined();
  });

  it('should reflect the hidden state of each visibility option', () => {
    component = renderPackageSettings();

    expect(component.getByLabelText('ui-eholdings.package.visibility.PF')).not.toBeChecked();
    expect(component.getByLabelText('ui-eholdings.package.visibility.FTF')).not.toBeChecked();
    expect(component.getByLabelText('ui-eholdings.package.visibility.MARC')).toBeChecked();
  });

  it('should disable visibility checkboxes in the view mode', () => {
    component = renderPackageSettings();

    expect(component.getByLabelText('ui-eholdings.package.visibility.PF')).toBeDisabled();
    expect(component.getByLabelText('ui-eholdings.package.visibility.FTF')).toBeDisabled();
    expect(component.getByLabelText('ui-eholdings.package.visibility.MARC')).toBeDisabled();
  });
});
