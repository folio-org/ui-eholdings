import {
  render,
  cleanup,
} from '@testing-library/react';

import Harness from '../../../../../test/jest/helpers/harness';

import ResourceSettings from './resource-settings';

jest.mock('../../../access-type-display', () => () => <div>Access type display</div>);
jest.mock('../../../proxy-display', () => () => <div>Proxy display</div>);

describe('Given ResourceSettings', () => {
  let component;
  const onToggleMock = jest.fn();

  const defaultPackage = {
    visibilityData: {
      reason: '',
      isHidden: false,
    },
    isCustom: true,
    proxy: {
      id: 'proxy-id',
    },
  };

  const defaultModel = {
    visibilityData: {
      reason: '',
      isHidden: false,
    },
    isLoading: false,
    url: 'some-url',
    title: {
      isTitleCustom: false,
    },
    package: defaultPackage,
  };

  const renderResourceSettings = (props = {}) => render(
    <Harness>
      <ResourceSettings
        isOpen
        onToggle={onToggleMock}
        accessStatusTypes={{
          isLoading: false,
          items: {
            data: [{
              id: 'access-type-id',
              attributes: {
                name: 'access type name',
              },
            }],
          },
        }}
        proxyTypes={{
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
        }}
        resourceSelected
        model={defaultModel}
        {...props}
      />
    </Harness>
  );

  afterEach(() => {
    cleanup();
    onToggleMock.mockClear();
  });

  it('should render an accordion', () => {
    component = renderResourceSettings();
    expect(component.getByText('ui-eholdings.resource.resourceSettings')).toBeDefined();
  });

  describe('when resource is hidden', () => {
    it('should display resource hidden message', () => {
      component = renderResourceSettings({
        model: {
          ...defaultModel,
          visibilityData: {
            isHidden: true,
            reason: 'reason',
          },
        },
      });
      expect(component.getByTestId('resource-show-visibility').textContent).toEqual('ui-eholdings.package.visibility.no');
    });
  });

  describe('when resource is not selected', () => {
    it('should display resource hidden message', () => {
      component = renderResourceSettings({
        resourceSelected: false,
      });
      expect(component.getByTestId('resource-show-visibility').textContent).toEqual('ui-eholdings.package.visibility.no');
    });
  });

  describe('when package is custom', () => {
    it('should show custom url', () => {
      component = renderResourceSettings();
      expect(component.getByText('ui-eholdings.custom')).toBeDefined();
    });
  });

  describe('when package is managed', () => {
    it('should show managed url', () => {
      component = renderResourceSettings({
        model: {
          ...defaultModel,
          package: {
            ...defaultPackage,
            isCustom: false,
          },
        },
      });
      expect(component.getByText('ui-eholdings.managed')).toBeDefined();
    });
  });


  it('should render proxy display', () => {
    component = renderResourceSettings();
    expect(component.getByText('Proxy display')).toBeDefined();
  });

  it('should display a link', () => {
    component = renderResourceSettings();
    expect(component.getByText('some-url')).toBeDefined();
  });

  it('should render access type display', () => {
    component = renderResourceSettings();
    expect(component.getByText('Access type display')).toBeDefined();
  });
});
