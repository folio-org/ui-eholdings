import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';

import { useUpdatePackageTitlesSelection } from './use-update-package-titles-selection';
import { INTERVAL_BEFORE_CHECK_FOR_AN_UPDATE } from '../../constants';

describe('useUpdatePackageTitlesSelection', () => {
  const mockSetIsTitlesUpdating = jest.fn();
  const mockGetPackageTitles = jest.fn();

  const defaultProps = {
    queryParams: {
      filter: {
        selected: 'true',
      },
    },
    packageModel: {
      id: 'package-id',
      isSelected: true,
    },
    setIsTitlesUpdating: mockSetIsTitlesUpdating,
    packageTitles: {
      isLoading: false,
      items: [{
        attributes: {
          isSelected: false,
        },
      }],
    },
    getPackageTitles: mockGetPackageTitles,
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockSetIsTitlesUpdating.mockClear();
    mockGetPackageTitles.mockClear();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('when updateTitles is called', () => {
    it('should set isTitlesUpdating to true', () => {
      const { result } = renderHook(() => useUpdatePackageTitlesSelection(defaultProps));

      act(() => {
        result.current.updateTitles();
      });

      expect(mockSetIsTitlesUpdating).toHaveBeenCalledWith(true);
    });
  });

  describe('when package titles are not yet updated and not loading', () => {
    it('should call getPackageTitles after the interval', () => {
      const { result } = renderHook(() => useUpdatePackageTitlesSelection(defaultProps));

      act(() => {
        result.current.updateTitles();
      });

      act(() => {
        jest.advanceTimersByTime(INTERVAL_BEFORE_CHECK_FOR_AN_UPDATE);
      });

      expect(mockGetPackageTitles).toHaveBeenCalledWith({
        packageId: defaultProps.packageModel.id,
        params: defaultProps.queryParams,
      });
    });
  });

  describe('when package titles are still loading', () => {
    it('should not call getPackageTitles', () => {
      const props = {
        ...defaultProps,
        packageTitles: {
          ...defaultProps.packageTitles,
          isLoading: true,
        },
      };

      const { result } = renderHook(() => useUpdatePackageTitlesSelection(props));

      act(() => {
        result.current.updateTitles();
      });

      act(() => {
        jest.advanceTimersByTime(INTERVAL_BEFORE_CHECK_FOR_AN_UPDATE);
      });

      expect(mockGetPackageTitles).not.toHaveBeenCalled();
    });
  });

  describe('when package titles are updated', () => {
    it('should set isTitlesUpdating to false and stop the interval', () => {
      const props = {
        ...defaultProps,
        packageTitles: {
          isLoading: false,
          items: [{
            attributes: {
              isSelected: true,
            },
          }],
        },
      };

      const { result } = renderHook(() => useUpdatePackageTitlesSelection(props));

      act(() => {
        result.current.updateTitles();
      });

      act(() => {
        jest.advanceTimersByTime(INTERVAL_BEFORE_CHECK_FOR_AN_UPDATE);
      });

      expect(mockSetIsTitlesUpdating).toHaveBeenLastCalledWith(false);
      expect(mockGetPackageTitles).not.toHaveBeenCalled();
    });
  });

  describe('when updateTitles is called multiple times', () => {
    it('should clear the previous interval', () => {
      const mockClearInterval = jest.spyOn(window, 'clearInterval');
      const { result } = renderHook(() => useUpdatePackageTitlesSelection(defaultProps));

      act(() => {
        result.current.updateTitles();
      });

      act(() => {
        result.current.updateTitles();
      });

      expect(mockClearInterval).toHaveBeenCalled();

      mockClearInterval.mockRestore();
    });
  });

  describe('when the hook is unmounted', () => {
    it('should clear the interval', () => {
      const mockClearInterval = jest.spyOn(window, 'clearInterval');
      const { result, unmount } = renderHook(() => useUpdatePackageTitlesSelection(defaultProps));

      act(() => {
        result.current.updateTitles();
      });

      unmount();

      expect(mockClearInterval).toHaveBeenCalled();

      mockClearInterval.mockRestore();
    });
  });
});
