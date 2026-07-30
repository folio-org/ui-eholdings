import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  act,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useProviderPackages } from './use-provider-packages';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const mockGet = jest.fn();

const getKyMock = () => ({
  get: mockGet,
});

describe('useProviderPackages', () => {
  const mockPackagesData = {
    data: [],
    meta: {
      totalResults: 100,
    },
  };
  const providerId = 'mock-provider-id';

  beforeEach(() => {
    mockGet.mockClear().mockReturnValue({
      json: jest.fn().mockResolvedValue(mockPackagesData),
    });

    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
      extend: jest.fn().mockReturnValue(getKyMock()),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch packages data', async () => {
    const { result } = renderHook(() => useProviderPackages({
      providerId,
    }), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.data).toEqual(mockPackagesData.data);
    expect(result.current.totalResults).toEqual(mockPackagesData.meta.totalResults);
  });

  it('should make a request with correct parameters', async () => {
    const { result } = renderHook(() => useProviderPackages({
      providerId,
      searchParams: {
        q: 'test',
      },
    }), { wrapper });

    await act(() => !result.current.isLoading);

    expect(mockGet).toHaveBeenCalledWith(`eholdings/providers/${providerId}/packages?q=test&page=1&count=100`);
  });

  it('should format repeatable search parameters correctly', async () => {
    const { result } = renderHook(() => useProviderPackages({
      providerId,
      searchParams: {
        q: 'test',
        filter: {
          tags: ['important', 'urgent'],
        },
      },
    }), { wrapper });

    await act(() => !result.current.isLoading);

    expect(mockGet).toHaveBeenCalledWith(`eholdings/providers/${providerId}/packages?q=test&filter[tags]=important&filter[tags]=urgent&page=1&count=100`);
  });

  describe('when fetching the next page', () => {
    it('should make a request with page parameters equal to 2', async () => {
      const { result } = renderHook(() => useProviderPackages({
        providerId,
        searchParams: {
          q: 'test',
        },
      }), { wrapper });

      await act(() => !result.current.isLoading);

      result.current.fetchNextPage();

      await waitFor(() => expect(mockGet).toHaveBeenCalledWith(`eholdings/providers/${providerId}/packages?q=test&page=2&count=100`));
      expect(result.current.page).toEqual(2);
    });
  });

  describe('when fetching the previous page', () => {
    it('should make a request with page parameters equal to 1', async () => {
      const { result } = renderHook(() => useProviderPackages({
        providerId,
        searchParams: {
          q: 'test',
        },
      }), { wrapper });

      await act(() => !result.current.isLoading);

      result.current.fetchNextPage();

      await waitFor(() => expect(mockGet).toHaveBeenCalledWith(`eholdings/providers/${providerId}/packages?q=test&page=2&count=100`));
      expect(result.current.page).toEqual(2);

      result.current.fetchPreviousPage();

      await waitFor(() => expect(mockGet).toHaveBeenCalledWith(`eholdings/providers/${providerId}/packages?q=test&page=1&count=100`));
      expect(result.current.page).toEqual(1);
    });
  });
});
