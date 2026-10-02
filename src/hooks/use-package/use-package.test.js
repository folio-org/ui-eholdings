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

  it('should expose relationships', async () => {
    const resource = {
      id: '1-2',
      attributes: { name: 'Test package' },
      relationships: { accessType: { data: { id: 'access-type-id' } } },
    };

    mockGet.mockReturnValueOnce({ json: jest.fn().mockResolvedValue({ data: resource }) });

    const { result } = renderHook(() => usePackage({ packageId: 'with-relationships' }), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    expect(result.current.data.name).toBe('Test package');
    expect(result.current.data.id).toBe('1-2');
    expect(result.current.data.relationships.accessType.data.id).toBe('access-type-id');
  });
});
