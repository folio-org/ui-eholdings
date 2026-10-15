import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { usePackageUpdate } from './use-package-update';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const mockPut = jest.fn();
const mockExtend = jest.fn(() => ({ put: mockPut }));

const packageId = 'test-id';

describe('Given usePackageUpdate', () => {
  beforeEach(() => {
    mockPut.mockClear().mockReturnValue({ json: jest.fn().mockResolvedValue({}) });
    useOkapiKy.mockClear().mockReturnValue({
      extend: mockExtend,
    });
  });

  describe('when updatePackage is called', () => {
    it('should call PUT with correct packageId', async () => {
      const { result } = renderHook(() => usePackageUpdate({ packageId, onSuccess: jest.fn() }), { wrapper });

      result.current.updatePackage({});

      await waitFor(() => expect(mockPut.mock.calls[0][0]).toEqual(`eholdings/packages/${packageId}`));
    });
  });
});
