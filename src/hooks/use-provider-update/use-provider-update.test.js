import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useProviderUpdate } from './use-provider-update';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const mockPut = jest.fn();
const mockExtend = jest.fn(() => ({ put: mockPut }));

const providerId = 'test-id';
const packagesSelected = 3;

describe('Given useProviderUpdate', () => {
  beforeEach(() => {
    mockPut.mockClear().mockReturnValue({ json: jest.fn().mockResolvedValue({}) });
    useOkapiKy.mockClear().mockReturnValue({
      extend: mockExtend,
    });
  });

  describe('when updateProvider is called', () => {
    it('should call PUT with correct providerId', async () => {
      const { result } = renderHook(() => useProviderUpdate({
        providerId,
        packagesSelected,
        onSuccess: jest.fn(),
      }), { wrapper });

      result.current.updateProvider({});

      await waitFor(() => expect(mockPut.mock.calls[0][0]).toEqual(`eholdings/providers/${providerId}`));
    });

    it('should call PUT with correct body', async () => {
      const { result } = renderHook(() => useProviderUpdate({
        providerId,
        packagesSelected,
        onSuccess: jest.fn(),
      }), { wrapper });

      const formValues = {
        providerToken: {
          value: 'token-value',
        },
      };

      const expectedBodyJson = JSON.stringify({
        data: {
          id: providerId,
          attributes: {
            packagesSelected,
            providerToken: {
              value: 'token-value',
            },
          },
          type: 'providers',
        },
      });

      result.current.updateProvider(formValues);

      await waitFor(() => expect(mockPut.mock.calls[0][1]).toEqual({
        body: expectedBodyJson,
      }));
    });

    describe('when packagesSelected is not available', () => {
      it('should throw and not send a PUT request', () => {
        const { result } = renderHook(() => useProviderUpdate({ providerId, onSuccess: jest.fn() }), { wrapper });

        expect(() => result.current.updateProvider({ providerToken: { value: 'token-value' } }))
          .toThrow('packagesSelected is not available');

        expect(mockPut).not.toHaveBeenCalled();
      });
    });
  });
});
