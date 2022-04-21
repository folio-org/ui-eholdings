import {
  render,
  cleanup,
} from '@testing-library/react';

import Harness from '../../../../../../test/jest/helpers/harness';

import PackageSettings from './package-settings';

jest.mock('../../../../access-type-display', () => () => <span>Access type display</span>);

jest.mock('../../../../proxy-display', () => () => <span>Proxy display</span>);

jest.mock('../../../../token-display', () => ({ type }) => <span>{type} token display</span>);

const model = {
  isLoading: false,
  isLoaded: true,
  isCustom: false,
  packageToken: {
    prompt: '',
  },
  visibilityData: {
    reason: '',
    isHidden: false,
  },
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

const provider = {
  isLoaded: true,
  isLoading: false,
  providerToken: {
    prompt: '',
  },
  proxy: {
    id: 'proxy-id',
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
        provider={provider}
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
});
