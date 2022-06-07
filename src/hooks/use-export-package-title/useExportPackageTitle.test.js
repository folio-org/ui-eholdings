import { renderHook } from '@testing-library/react-hooks';
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

const mockPost = jest.fn();

describe('Given useExportPackageTitle', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      post: mockPost.mockResolvedValue(),
    });
  });

  it('should call fetch with correct data', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useExportPackageTitle({
      onSuccess: jest.fn(),
      onError: jest.fn(),
    }), { wrapper });

    result.current.doExport({ test: 'data' });

    await waitForNextUpdate();

    expect(mockPost).toHaveBeenCalledWith('data-export-spring/jobs', {
      json: {
        exportTypeSpecificParameters: {
          eHoldingsExportConfig: {
            test: 'data',
          },
        },
        type: 'E_HOLDINGS',
      },
    });
  });

  describe('when export is successful', () => {
    beforeEach(() => {
      useOkapiKy.mockClear().mockReturnValue({
        post: mockPost.mockResolvedValue(),
      });
    });

    it('should call onSuccess callback', async () => {
      const onSuccess = jest.fn();

      const { result, waitForNextUpdate } = renderHook(() => useExportPackageTitle({
        onSuccess,
      }), { wrapper });

      result.current.doExport({ test: 'data' });

      await waitForNextUpdate();

      expect(onSuccess).toHaveBeenCalled();
    });
  });

  describe('when export fails', () => {
    beforeEach(() => {
      useOkapiKy.mockClear().mockReturnValue({
        post: mockPost.mockRejectedValue(),
      });
    });

    it('should call onError callback', async () => {
      const onError = jest.fn();

      const { result, waitForNextUpdate } = renderHook(() => useExportPackageTitle({
        onError,
      }), { wrapper });

      result.current.doExport({ test: 'data' });

      await waitForNextUpdate();

      expect(onError).toHaveBeenCalled();
    });
  });
});
