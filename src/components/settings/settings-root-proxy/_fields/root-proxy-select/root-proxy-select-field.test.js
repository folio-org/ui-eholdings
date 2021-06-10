import { render } from '@testing-library/react';

import { Form } from 'react-final-form';

import RootProxySelectField from './root-proxy-select-field';

const testEmptyProxyTypes = {};
const testProxyTypes = {
  items: [
    {
      attributes: {
        id: 'test-id',
        name: 'test-name',
      },
    },
  ],
};

describe('Given RootProxySelectField', () => {
  const handleSubmit = jest.fn();

  const renderRootProxySelectField = proxyTypes => render(
    <Form
      onSubmit={handleSubmit}
      render={() => (
        <form>
          <RootProxySelectField proxyTypes={proxyTypes} />
        </form>
      )}
    />
  );

  it('should not render RootProxySelectField', () => {
    renderRootProxySelectField(testEmptyProxyTypes);

    const isRootProxySelectField = document
      .querySelector('.root-proxy-select-field');

    expect(isRootProxySelectField).toBeNull();
  });

  it('should render RootProxySelectField', () => {
    renderRootProxySelectField(testProxyTypes);

    const isRootProxySelectFieldAttribute = document
      .querySelector('.root-proxy-select-field')
      .getAttribute('data-test-eholdings-root-proxy-select-field');

    expect(isRootProxySelectFieldAttribute).toEqual('true');
  });

  it('should render Root Proxy Server title', () => {
    const { getByText } = renderRootProxySelectField(testProxyTypes);

    expect(getByText('ui-eholdings.settings.rootProxy.server')).toBeDefined();
  });

  it('should render dropdown list', () => {
    renderRootProxySelectField(testProxyTypes);

    const isRootProxySelectFieldDropdown = document
      .querySelector('#eholdings-settings-root-proxy-server');

    expect(isRootProxySelectFieldDropdown).toBeDefined();
  });

  it('should `test-name` dropdown list option', () => {
    const { getByText } = renderRootProxySelectField(testProxyTypes);

    expect(getByText('test-name')).toBeDefined();
  });
});
