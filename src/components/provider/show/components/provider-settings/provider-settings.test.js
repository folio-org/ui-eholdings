import React from 'react';
import {
  render,
  cleanup,
} from '@testing-library/react';

import IntlProvider from '../../../../../../test/jest/helpers/intl';

import ProviderSettings from './provider-settings';

jest.mock('../../../../proxy-display', () => () => <span>Proxy display</span>);

jest.mock('../../../../token-display', () => () => <span>Token display</span>);

describe('Given ProviderSettings', () => {
  let component;
  const onToggleMock = jest.fn();

  const renderProviderSettings = (props = {}) => render(
    <IntlProvider>
      <ProviderSettings
        isOpen
        onToggle={onToggleMock}
        proxyTypes={{
          request: {
            isResolved: true,
          },
        }}
        rootProxy={{
          request: {
            isResolved: true,
          },
          data: {
            attributes: {
              proxyTypeId: 'proxy-id',
            },
          },
        }}
        model={{
          proxy: {
            id: 'proxy-id',
          },
          providerToken: {
            prompt: 'token',
          },
        }}
        {...props}
      />
    </IntlProvider>
  );

  afterEach(() => {
    cleanup();
    onToggleMock.mockClear();
  });

  it('should render an accordion', () => {
    component = renderProviderSettings();
    expect(component.getByText('ui-eholdings.provider.providerSettings')).toBeDefined();
  });

  it('should render proxy display', () => {
    component = renderProviderSettings();
    expect(component.getByText('Proxy display')).toBeDefined();
  });

  it('should render token display', () => {
    component = renderProviderSettings();
    expect(component.getByText('Token display')).toBeDefined();
  });

  describe('if proxy types have not loaded', () => {
    it('should not display proxy display', () => {
      component = renderProviderSettings({
        proxyTypes: {
          request: {
            isResolved: false,
          },
        },
      });

      expect(component.queryByText('Proxy display')).toBeNull();
    });

    it('should display spinner', () => {
      component = renderProviderSettings({
        proxyTypes: {
          request: {
            isResolved: false,
          },
        },
      });

      expect(component.queryByTestId('proxy-spinner')).toBeDefined();
    });
  });

  describe('if root proxy has not loaded', () => {
    it('should not display proxy display', () => {
      component = renderProviderSettings({
        rootProxy: {
          request: {
            isResolved: false,
          },
        },
      });

      expect(component.queryByText('Proxy display')).toBeNull();
    });

    it('should display spinner', () => {
      component = renderProviderSettings({
        rootProxy: {
          request: {
            isResolved: false,
          },
        },
      });

      expect(component.queryByTestId('proxy-spinner')).toBeDefined();
    });
  });
});
