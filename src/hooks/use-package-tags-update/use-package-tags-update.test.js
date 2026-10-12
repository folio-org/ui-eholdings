import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  act,
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  useOkapiKy,
} from '@folio/stripes/core';

import { usePackageTagsUpdate } from './use-package-tags-update';

const mockPut = jest.fn();
const mockExtend = jest.fn(() => ({ put: mockPut }));

const packageId = 'test-id';
const namespace = '@folio/eholdings';
const queryKey = [namespace, packageId];

const cachedPackage = {
  data: {
    id: packageId,
    attributes: {
      name: 'pkg',
      tags: { tagList: ['old'] },
    },
  },
};

const payload = {
  type: 'tags',
  attributes: {
    name: 'pkg',
    tags: { tagList: ['new', 'old'] },
    contentType: 'Aggregated Full Text',
  },
};

describe('Given usePackageTagsUpdate', () => {
  let queryClient;

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    queryClient.setQueryData(queryKey, cachedPackage);

    mockPut.mockReset().mockReturnValue({ json: jest.fn().mockResolvedValue({}) });
    useOkapiKy.mockReturnValue({ extend: mockExtend });
  });

  describe('when updatePackageTags is called', () => {
    it('should call PUT on the package tags endpoint', async () => {
      const { result } = renderHook(() => usePackageTagsUpdate({ packageId }), { wrapper });

      act(() => result.current.updatePackageTags(payload));

      await waitFor(() => expect(mockPut).toHaveBeenCalledWith(
        `eholdings/packages/${packageId}/tags`,
        { body: JSON.stringify({ data: payload }) },
      ));
    });

    it('should optimistically update the cached package tags', async () => {
      mockPut.mockReturnValue({ json: jest.fn(() => new Promise(() => {})) });

      const { result } = renderHook(() => usePackageTagsUpdate({ packageId }), { wrapper });

      act(() => result.current.updatePackageTags(payload));

      await waitFor(() => {
        expect(queryClient.getQueryData(queryKey).data.attributes.tags).toEqual({ tagList: ['new', 'old'] });
      });
    });

    it('should invalidate the package query once the request settles', async () => {
      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
      const { result } = renderHook(() => usePackageTagsUpdate({ packageId }), { wrapper });

      act(() => result.current.updatePackageTags(payload));

      await waitFor(() => expect(invalidateSpy).toHaveBeenCalledWith({ queryKey }));
    });

    it('should call onSuccess when the request succeeds', async () => {
      const onSuccess = jest.fn();
      const { result } = renderHook(() => usePackageTagsUpdate({ packageId, onSuccess }), { wrapper });

      act(() => result.current.updatePackageTags(payload));

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      mockPut.mockReturnValue({
        json: jest.fn().mockRejectedValue({
          response: { json: () => Promise.resolve({ errors: [{ title: 'boom' }] }) },
        }),
      });
    });

    it('should roll back the cached package tags', async () => {
      const { result } = renderHook(() => usePackageTagsUpdate({ packageId }), { wrapper });

      act(() => result.current.updatePackageTags(payload));

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(queryClient.getQueryData(queryKey).data.attributes.tags).toEqual({ tagList: ['old'] });
    });

    it('should expose the backend errors', async () => {
      const { result } = renderHook(() => usePackageTagsUpdate({ packageId }), { wrapper });

      act(() => result.current.updatePackageTags(payload));

      await waitFor(() => expect(result.current.errors).toEqual([{ title: 'boom' }]));
    });
  });
});
