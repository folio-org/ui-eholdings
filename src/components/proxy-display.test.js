import { render } from '@testing-library/react';

import ProxyDisplay from './proxy-display';

const testPropsEmpty = {
  proxy: {},
  proxyTypes: {
    resolver: {
      state: {
        proxyTypes: {
          records: {},
        },
      },
    },
  },
};

const testProps = {
  proxy: {
    id: 'testproxy',
    inherited: true,
  },
  proxyTypes: {
    resolver: {
      state: {
        proxyTypes: {
          records: {
            testProxy: {
              attributes: {
                id: 'testProxy',
                name: 'testProxy',
              },
            },
          },
        },
      },
    },
  },
  inheritedProxyId: 'testproxy',
};

const testPropsNotInherited = {
  ...testProps,
  inheritedProxyId: 'othertestproxy',
};

describe('Given ProxyDisplay', () => {
  const renderProxyDisplay = ({ ...props }) => render(
    <ProxyDisplay {...props} />
  );

  it('should display proxy label', () => {
    const { getByText } = renderProxyDisplay(testProps);

    expect(getByText('ui-eholdings.proxy')).toBeDefined();
  });

  it('should display inherited proxy label', () => {
    const { getByText } = renderProxyDisplay(testProps);

    expect(getByText('ui-eholdings.proxy.inherited')).toBeDefined();
  });

  it('should not display inherited proxy label', () => {
    const { queryByText, getByText } = renderProxyDisplay(testPropsNotInherited);

    expect(queryByText('ui-eholdings.proxy.inherited')).toBeNull();
    expect(getByText('testProxy')).toBeDefined();
  });

  it('should not display proxy info', () => {
    const { queryByText } = renderProxyDisplay(testPropsEmpty);

    expect(queryByText('ui-eholdings.proxy')).toBeNull();
    expect(queryByText('ui-eholdings.proxy.inherited')).toBeNull();
    expect(queryByText('testProxy')).toBeNull();
  });
});
