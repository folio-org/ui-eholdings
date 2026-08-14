import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { usePackage } from './use-package';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const mockGet = jest.fn().mockReturnValue({ json: jest.fn().mockResolvedValue({}) });
const mockExtend = jest.fn(() => ({ get: mockGet }));

const packageId = 'test-id';

describe('Given usePackage', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      extend: mockExtend,
    });
  });

  it('should fetch a package with a correct packageId', async () => {
    renderHook(() => usePackage({ packageId }), { wrapper });

    await waitFor(() => expect(mockGet).toHaveBeenCalledWith(`eholdings/packages/${packageId}`));
  });
});
