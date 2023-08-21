import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import {
  useLocation,
  useHistory,
} from 'react-router';

import { useHistoryBack } from './useHistoryBack';
import { RouteHistoryContext } from '../../components/route-history';

jest.mock('react-router', () => ({
  useHistory: jest.fn(),
  useLocation: jest.fn(),
}));

const mockGoBack = jest.fn();
const mockPush = jest.fn();
const mockNavigateBack = jest.fn();

const routeHistory = [{ pathname: '/erm/agreements' }, { pathname: '/eholdings' }];

const wrapper = ({ children }) => (
  <RouteHistoryContext.Provider value={{ routeHistory, navigateBack: mockNavigateBack }}>{children}</RouteHistoryContext.Provider>
);

describe('useHistoryBack hook', () => {
  useHistory.mockClear().mockReturnValue({
    goBack: mockGoBack,
    push: mockPush,
  });

  beforeEach(() => {
    mockGoBack.mockClear();
    mockPush.mockClear();
  });

  describe('when coming from eHoldings page', () => {
    it('should call history.goBack', () => {
      useLocation.mockClear().mockReturnValue({
        search: '',
        state: { eholdings: true },
      });

      const { result } = renderHook(() => useHistoryBack(), { wrapper });
      const { goBack } = result.current;

      goBack();

      expect(mockGoBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('when coming outside of eHoldings', () => {
    it('should call navigateBack', () => {
      useLocation.mockClear().mockReturnValue({
        search: '?searchType=packages',
      });

      const { result } = renderHook(() => useHistoryBack(), { wrapper });
      const { goBack } = result.current;

      goBack();

      expect(mockNavigateBack);
    });
  });
});
