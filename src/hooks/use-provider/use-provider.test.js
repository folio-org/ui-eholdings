import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useProvider } from './use-provider';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const mockGet = jest.fn().mockReturnValue({ json: jest.fn().mockResolvedValue({}) });
const mockExtend = jest.fn(() => ({ get: mockGet }));

const providerId = 'test-id';

describe('Given useProvider', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      extend: mockExtend,
    });
  });

  it('should fetch a provider with a correct providerId', async () => {
    renderHook(() => useProvider({ providerId }), { wrapper });

    await waitFor(() => expect(mockGet).toHaveBeenCalledWith(`eholdings/providers/${providerId}`));
  });
});
