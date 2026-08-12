import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

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

const mockDelete = jest.fn();
const mockExtend = jest.fn(() => ({ delete: mockDelete }));

const packageId = 'test-id';

describe('Given usePackageDelete', () => {
  beforeEach(() => {
    mockDelete.mockReset();
    useOkapiKy.mockClear().mockReturnValue({
      extend: mockExtend,
    });
  });

  describe('when createPackage is called', () => {
    it('should POST formatted package data to eholdings/packages', async () => {
      const { result } = renderHook(() => usePackageDelete({ onSuccess: jest.fn() }), { wrapper });

      result.current.deletePackage(packageId);

      await waitFor(() => expect(mockDelete).toHaveBeenCalledWith(packageId));
    });
  });
});
