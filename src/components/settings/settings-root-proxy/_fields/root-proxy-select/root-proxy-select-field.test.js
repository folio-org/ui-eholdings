import { render } from '@folio/jest-config-stripes/testing-library/react';

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
    const { queryByText } = renderRootProxySelectField(testEmptyProxyTypes);

    expect(queryByText('ui-eholdings.settings.rootProxy.server')).toBeNull;
  });

  it('should render Root Proxy Server title', () => {
    const { getByText } = renderRootProxySelectField(testProxyTypes);

    expect(getByText('ui-eholdings.settings.rootProxy.server')).toBeDefined();
  });

  it('should render dropdown list', () => {
    const { getByTestId } = renderRootProxySelectField(testProxyTypes);

    expect(getByTestId('root-proxy-select-field')).toBeDefined();
  });

  it('should display `test-name` dropdown list option', () => {
    const { getByText } = renderRootProxySelectField(testProxyTypes);

    expect(getByText('test-name')).toBeDefined();
  });
});
