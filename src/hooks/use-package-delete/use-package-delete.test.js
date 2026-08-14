import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { usePackageDelete } from './use-package-delete';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const mockDelete = jest.fn().mockReturnValue({ json: jest.fn().mockResolvedValue({}) });
const mockExtend = jest.fn(() => ({ delete: mockDelete }));

const packageId = 'test-id';

describe('Given usePackageDelete', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      extend: mockExtend,
    });
  });

  describe('when deletePackage is called', () => {
    it('should call DELETE with correct packageId', async () => {
      const { result } = renderHook(() => usePackageDelete({ onSuccess: jest.fn() }), { wrapper });

      result.current.deletePackage(packageId);

      await waitFor(() => expect(mockDelete).toHaveBeenCalledWith(`eholdings/packages/${packageId}`));
    });
  });
});
