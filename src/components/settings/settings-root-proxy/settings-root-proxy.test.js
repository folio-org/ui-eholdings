import { render } from '@testing-library/react';

import Harness from '../../../../test/jest/helpers/harness';

import SettingsRootProxy from './settings-root-proxy';

const proxyTypes = {
  errors: [],
  isFailed: false,
  isLoading: false,
  items: [
    {
      attributes: {
        id: 'EZProxy',
        name: 'EZProxy',
      },
      id: 'EZProxy',
    },
  ],
};

const rootProxy = {
  data: {
    attributes: {
      id: 'root-proxy-id',
      proxyTypeId: 'ezproxy',
    },
    id: 'root-proxy-id',
    type: 'rootProxyType',
  },
  errors: [],
  isFailed: false,
  isLoading: false,
  isUpdated: false,
};

const componentToRender = props => (
  <Harness>
    <SettingsRootProxy
      onSubmit={() => {}}
      proxyTypes={proxyTypes}
      rootProxy={rootProxy}
      {...props}
    />
  </Harness>
);

const renderSettings = (props = {}) => render(
  componentToRender(props),
);

describe('Given SettingsRootProxy', () => {
  it('should render form', () => {
    const { getByTestId } = renderSettings();

    expect(getByTestId('settings-root-proxy-form')).toBeDefined();
  });

  it('should display pane header title', () => {
    const { getByText } = renderSettings();

    expect(getByText('ui-eholdings.settings.rootProxy')).toBeDefined();
  });

  it('should render footer', () => {
    const { getByRole } = renderSettings();

    expect(getByRole('button', { name: 'stripes-components.cancel' })).toBeDefined();
    expect(getByRole('button', { name: 'stripes-core.button.save' })).toBeDefined();
  });

  it('should display Root proxy server label', () => {
    const { getByText } = renderSettings();

    expect(getByText('ui-eholdings.settings.rootProxy.server')).toBeDefined();
  });

  it('should display Root proxy server dropdown', () => {
    const {
      getByRole,
      getByText,
    } = renderSettings();

    expect(getByRole('combobox', { name: 'ui-eholdings.settings.rootProxy.server' })).toBeDefined();
    expect(getByText('EZProxy')).toBeDefined();
  });

  it('should display customer message', () => {
    const { getByText } = renderSettings();

    expect(getByText('ui-eholdings.settings.rootProxy.ebsco.customer.message')).toBeDefined();
  });

  it('should display warning message', () => {
    const { getByText } = renderSettings();

    expect(getByText('ui-eholdings.settings.rootProxy.warning')).toBeDefined();
  });

  describe('when root proxy is updated', () => {
    it('should display corresponding toast message', () => {
      const {
        getByText,
        rerender,
      } = renderSettings();

      const updatedRootProxy = {
        ...rootProxy,
        isUpdated: true,
      };

      rerender(
        componentToRender({
          rootProxy: updatedRootProxy,
        }),
      );

      expect(getByText('ui-eholdings.settings.rootProxy.updated')).toBeDefined();
    });
  });

  describe('when an error happens', () => {
    it('should display corresponding toast message', () => {
      const {
        getByText,
        rerender,
      } = renderSettings();

      const rootProxyWithError = {
        ...rootProxy,
        errors: [{ title: 'Error title' }],
      };

      rerender(
        componentToRender({
          rootProxy: rootProxyWithError,
        }),
      );

      expect(getByText('Error title')).toBeDefined();
    });
  });

  describe('when proxy types are loading', () => {
    const proxyTypesLoading = {
      ...proxyTypes,
      isLoading: true,
    };

    it('should not display Root proxy server label', () => {
      const { queryByText } = renderSettings({
        proxyTypes: proxyTypesLoading,
      });

      expect(queryByText('ui-eholdings.settings.rootProxy.server')).toBeNull();
    });

    it('should not display Root proxy server dropdown', () => {
      const { queryByRole } = renderSettings({
        proxyTypes: proxyTypesLoading,
      });

      expect(queryByRole('combobox', { name: 'ui-eholdings.settings.rootProxy.server' })).toBeNull();
    });
  });
});
