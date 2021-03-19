import React from 'react';
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
    package: {
      visibilityData: {
        reason: '',
        isHidden: false,
      },
      proxy: {
        id: 'proxy-id',
      },
    },
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
