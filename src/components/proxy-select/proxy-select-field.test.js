import {
  render,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';
import { Form } from 'react-final-form';

import ProxySelectField from './proxy-select-field';

describe('Given ProxySelectField', () => {
  const mockOnSubmit = jest.fn();

  const renderProxySelectField = (props = {}) => render(
    <Form
      onSubmit={mockOnSubmit}
      render={({ pristine, form: { reset } }) => (
        <form onSubmit={mockOnSubmit}>
          <ProxySelectField
            inheritedProxyId="inherited-proxy"
            proxyTypes={{
              request: {
                isResolved: true,
              },
              resolver: {
                state: {
                  proxyTypes: {
                    records: {
                      'proxy-id': {
                        id: 'proxy-id',
                        attributes: {
                          name: 'Some Proxy',
                        },
                      },
                      'inherited-proxy': {
                        id: 'inherited-proxy',
                        attributes: {
                          name: 'Inherited Proxy',
                        },
                      },
                    },
                  },
                },
              },
            }}
            {...props}
          />
          <button type="button" disabled={pristine} onClick={reset}>Cancel</button>
          <button type="submit" disabled={pristine}>Submit</button>
        </form>
      )}
    />
  );

  afterEach(() => {
    cleanup();
    mockOnSubmit.mockClear();
  });

  it('should render proxy select field', () => {
    const { getByTestId } = renderProxySelectField();

    expect(getByTestId('proxy-select-field')).toBeDefined();
  });

  it('should display inherited proxy', () => {
    const { getByText } = renderProxySelectField();

    expect(getByText('ui-eholdings.proxy.inherited')).toBeDefined();
  });

  describe('when theres only one proxy', () => {
    it('should disable field', () => {
      const { getByLabelText } = renderProxySelectField({
        proxyTypes: {
          request: {
            isResolved: true,
          },
          resolver: {
            state: {
              proxyTypes: {
                records: {
                  'proxy-id': {
                    id: 'proxy-id',
                    attributes: {
                      name: 'Some Proxy',
                    },
                  },
                },
              },
            },
          },
        },
      });

      expect(getByLabelText('ui-eholdings.proxy')).toBeDisabled();
    });
  });
});
