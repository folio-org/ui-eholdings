import { render } from '@folio/jest-config-stripes/testing-library/react';

import ProxyDisplay from './proxy-display';

const renderProxyDisplay = (props = {}) => render(
  <ProxyDisplay
    proxy={{
      id: 'EZProxy',
      inherited: true,
    }}
    proxyTypesRecords={{
      EZProxy: {
        id: 'EZProxy',
        attributes: {
          id: 'EZProxy',
          name: 'EZProxy',
          urlMask: '',
        },
        isLoaded: true,
        isLoading: false,
        isSaving: false,
      },
      Chalmers: {
        id: 'Chalmers',
        attributes: {
          id: 'Chalmers',
          name: 'Chalmers',
          urlMask: '',
        },
        isLoaded: true,
        isLoading: false,
        isSaving: false,
      },
    }}
    inheritedProxyId="EZProxy"
    {...props}
  />
);

describe('Given ProxyDisplay', () => {
  it('should return inherited proxy', () => {
    const { getByText } = renderProxyDisplay();

    expect(getByText('ui-eholdings.proxy.inherited')).toBeDefined();
  });

  describe('when proxy is not inherited', () => {
    it('should return not inherited proxy', () => {
      const { getByText } = renderProxyDisplay({
        proxy: {
          id: 'Chalmers',
          inherited: false,
        },
      });

      expect(getByText('Chalmers')).toBeDefined();
    });
  });

  describe('when inheritedProxyId is empty', () => {
    it('should render spinner', () => {
      const { container } = renderProxyDisplay({
        inheritedProxyId: '',
      });

      expect(container.querySelector('.icon-spinner-ellipsis')).toBeDefined();
    });
  });

  describe('when proxy id is empty', () => {
    it('should render spinner', () => {
      const { container } = renderProxyDisplay({
        proxy: {
          id: '',
          inherited: false,
        },
      });

      expect(container.querySelector('.icon-spinner-ellipsis')).toBeDefined();
    });
  });

  describe('when proxy is not listed in proxy-types list', () => {
    it('should display error message', () => {
      const { getByText } = renderProxyDisplay({
        proxy: {
          id: 'NotListedProxy',
          inherited: true,
        },
      });

      expect(getByText('ui-eholdings.proxy.errorMessage')).toBeDefined();
    });
  });
});
