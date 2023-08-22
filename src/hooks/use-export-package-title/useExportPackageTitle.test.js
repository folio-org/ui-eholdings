import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import useExportPackageTitle from './useExportPackageTitle';

jest.mock('@folio/stripes/core', () => ({
  useOkapiKy: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const mockPost = jest.fn().mockReturnValue({
  json: jest.fn().mockResolvedValue({}),
});

describe('Given useExportPackageTitle', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      post: mockPost,
    });
  });

  it('should call fetch with correct data', async () => {
    const { result } = renderHook(() => useExportPackageTitle({
      onSuccess: jest.fn(),
      onError: jest.fn(),
    }), { wrapper });

    result.current.doExport({ test: 'data' });

    await waitFor(() => expect(mockPost).toHaveBeenCalledWith('data-export-spring/jobs', {
      json: {
        exportTypeSpecificParameters: {
          eHoldingsExportConfig: {
            test: 'data',
          },
        },
        type: 'E_HOLDINGS',
      },
    }));
  });

  describe('when export is successful', () => {
    beforeEach(() => {
      useOkapiKy.mockClear().mockReturnValue({
        post: mockPost,
      });
    });

    it('should call onSuccess callback', async () => {
      const onSuccess = jest.fn();

      const { result } = renderHook(() => useExportPackageTitle({
        onSuccess,
      }), { wrapper });

      result.current.doExport({ test: 'data' });

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    });
  });

  describe('when export fails', () => {
    beforeEach(() => {
      useOkapiKy.mockClear().mockReturnValue({
        post: jest.fn().mockReturnValue({
          json: jest.fn().mockRejectedValue({}),
        }),
      });
    });

    it('should call onError callback', async () => {
      const onError = jest.fn();

      const { result } = renderHook(() => useExportPackageTitle({
        onError,
      }), { wrapper });

      result.current.doExport({ test: 'data' });

      await waitFor(() => expect(onError).toHaveBeenCalled());
    });
  });
});
