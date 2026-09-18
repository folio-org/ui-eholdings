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
const mockGo = jest.fn();
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockNavigateBack = jest.fn();

const routeHistory = [{ pathname: '/erm/agreements' }, { pathname: '/eholdings' }];

const wrapper = ({ children }) => (
  <RouteHistoryContext.Provider value={{ getRouteHistory: () => routeHistory, navigateBack: mockNavigateBack }}>
    {children}
  </RouteHistoryContext.Provider>
);

const renderWithRouteHistory = (historyEntries) => {
  const historyWrapper = ({ children }) => (
    <RouteHistoryContext.Provider value={{ getRouteHistory: () => historyEntries, navigateBack: mockNavigateBack }}>
      {children}
    </RouteHistoryContext.Provider>
  );

  return renderHook(() => useHistoryBack(), { wrapper: historyWrapper });
};

describe('useHistoryBack hook', () => {
  useHistory.mockClear().mockReturnValue({
    go: mockGo,
    goBack: mockGoBack,
    push: mockPush,
    replace: mockReplace,
  });

  beforeEach(() => {
    mockGo.mockClear();
    mockGoBack.mockClear();
    mockPush.mockClear();
    mockReplace.mockClear();
    mockNavigateBack.mockClear();
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

      expect(mockNavigateBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the Connected Tasks/Jobs pane is open', () => {
    const pathname = '/eholdings/providers/123355';
    const closedSearch = '?searchType=providers&q=a&offset=1';
    const openSearch = `${closedSearch}&layer=connected-tasks-jobs`;

    beforeEach(() => {
      useLocation.mockClear().mockReturnValue({ pathname, search: openSearch });
    });

    it('returns from a package to its provider with the provider query intact', () => {
      const packagePath = '/eholdings/packages/123355-1000203613';
      const providerPath = '/eholdings/providers/123355';

      useLocation.mockReturnValue({ pathname: packagePath, search: '?layer=connected-tasks-jobs' });

      const { result } = renderWithRouteHistory([
        { pathname: packagePath, search: '?layer=connected-tasks-jobs', navigationAction: 'PUSH' },
        { pathname: packagePath, search: '', navigationAction: 'PUSH' },
        { pathname: providerPath, search: closedSearch, navigationAction: 'PUSH' },
        { pathname: '/eholdings', search: closedSearch, navigationAction: 'PUSH' },
      ]);

      result.current.goBack();

      expect(mockGo).toHaveBeenCalledWith(-2);
      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('returns to the provider after a resource was opened and closed first', () => {
      const packagePath = '/eholdings/packages/214-2418509';
      const resourcePath = '/eholdings/resources/214-2418509-14337814';
      const providerPath = '/eholdings/providers/214';
      const paneSearch = '?layer=connected-tasks-jobs';

      useLocation.mockReturnValue({ pathname: packagePath, search: paneSearch, key: 'pane' });

      const { result } = renderWithRouteHistory([
        { pathname: packagePath, search: paneSearch, key: 'pane', navigationAction: 'PUSH' },
        { pathname: packagePath, search: '', key: 'package', navigationAction: 'POP' },
        { pathname: resourcePath, search: '', key: 'resource', navigationAction: 'PUSH' },
        { pathname: packagePath, search: '', key: 'package', navigationAction: 'PUSH' },
        { pathname: providerPath, search: closedSearch, key: 'provider', navigationAction: 'PUSH' },
        { pathname: '/eholdings', search: closedSearch, key: 'search', navigationAction: 'PUSH' },
      ]);

      result.current.goBack();

      expect(mockGo).toHaveBeenCalledWith(-2);
      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('also skips a Create Task detour after returning from a resource', () => {
      const packagePath = '/eholdings/packages/214-2418509';
      const resourcePath = '/eholdings/resources/214-2418509-14337814';
      const providerPath = '/eholdings/providers/214';
      const paneSearch = '?layer=connected-tasks-jobs';
      const createSearch = new URLSearchParams({
        returnTo: `${packagePath}${paneSearch}`,
      }).toString();

      useLocation.mockReturnValue({ pathname: packagePath, search: paneSearch, key: 'return-pane' });

      const { result } = renderWithRouteHistory([
        { pathname: packagePath, search: paneSearch, key: 'return-pane', navigationAction: 'PUSH' },
        { pathname: '/tasks/tasks/create', search: `?${createSearch}`, key: 'create', navigationAction: 'PUSH' },
        { pathname: packagePath, search: paneSearch, key: 'pane', navigationAction: 'PUSH', leavingEholdings: true },
        { pathname: packagePath, search: '', key: 'package', navigationAction: 'POP' },
        { pathname: resourcePath, search: '', key: 'resource', navigationAction: 'PUSH' },
        { pathname: packagePath, search: '', key: 'package', navigationAction: 'PUSH' },
        { pathname: providerPath, search: closedSearch, key: 'provider', navigationAction: 'PUSH' },
      ]);

      result.current.goBack();

      expect(mockGo).toHaveBeenCalledWith(-4);
      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('returns from a package to its provider after cancelling Create Task', () => {
      const packagePath = '/eholdings/packages/214-6659';
      const providerPath = '/eholdings/providers/214';
      const paneSearch = '?layer=connected-tasks-jobs';
      const createSearch = new URLSearchParams({
        recordId: '214-6659',
        recordType: 'eholdingsPackage',
        returnTo: `${packagePath}${paneSearch}`,
      }).toString();

      useLocation.mockReturnValue({ pathname: packagePath, search: paneSearch });

      const { result } = renderWithRouteHistory([
        { pathname: packagePath, search: paneSearch, navigationAction: 'PUSH' },
        { pathname: '/tasks/tasks/create', search: `?${createSearch}`, navigationAction: 'PUSH' },
        { pathname: packagePath, search: paneSearch, navigationAction: 'PUSH', leavingEholdings: true },
        { pathname: packagePath, search: '', navigationAction: 'PUSH' },
        { pathname: providerPath, search: closedSearch, navigationAction: 'PUSH' },
        { pathname: '/eholdings', search: closedSearch, navigationAction: 'PUSH' },
      ]);

      result.current.goBack();

      expect(mockGo).toHaveBeenCalledWith(-4);
      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('does not skip a cross-app visit without a recorded departure from this record', () => {
      const packagePath = '/eholdings/packages/214-6659';
      const paneSearch = '?layer=connected-tasks-jobs';
      const createSearch = new URLSearchParams({
        returnTo: '/eholdings/packages/other?layer=connected-tasks-jobs',
      }).toString();

      useLocation.mockReturnValue({ pathname: packagePath, search: paneSearch });

      const { result } = renderWithRouteHistory([
        { pathname: packagePath, search: paneSearch, navigationAction: 'PUSH' },
        { pathname: '/tasks/tasks/create', search: `?${createSearch}`, navigationAction: 'PUSH' },
        { pathname: packagePath, search: '', navigationAction: 'PUSH' },
      ]);

      result.current.goBack();

      expect(mockGo).not.toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith({ pathname: '/eholdings', search: '' });
    });

    it('reads navigation recorded after the hook rendered', () => {
      const packagePath = '/eholdings/packages/123355-1000203613';
      const providerPath = '/eholdings/providers/123355';
      const liveHistory = [
        { pathname: packagePath, search: '', navigationAction: 'PUSH' },
        { pathname: providerPath, search: closedSearch, navigationAction: 'PUSH' },
      ];

      useLocation.mockReturnValue({ pathname: packagePath, search: '?layer=connected-tasks-jobs' });

      const { result } = renderWithRouteHistory(liveHistory);

      liveHistory.unshift({ pathname: packagePath, search: '?layer=connected-tasks-jobs', navigationAction: 'PUSH' });

      result.current.goBack();

      expect(mockGo).toHaveBeenCalledWith(-2);
      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('does not count same-record replacements as browser history entries', () => {
      const { result } = renderWithRouteHistory([
        { pathname, search: openSearch, navigationAction: 'PUSH' },
        { pathname, search: closedSearch, navigationAction: 'REPLACE' },
        { pathname, search: closedSearch, navigationAction: 'PUSH' },
        { pathname: '/eholdings', search: closedSearch, navigationAction: 'PUSH' },
      ]);

      result.current.goBack();

      expect(mockGo).toHaveBeenCalledWith(-2);
    });

    it('closes the record instead of only closing the pane', () => {
      const { result } = renderWithRouteHistory([
        { pathname, search: openSearch },
        { pathname, search: closedSearch },
        { pathname: '/eholdings', search: closedSearch },
      ]);

      result.current.goBack();

      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/eholdings',
        search: closedSearch,
      });
      expect(mockGoBack).not.toHaveBeenCalled();
    });

    it('closes the record after repeated pane opens', () => {
      const { result } = renderWithRouteHistory([
        { pathname, search: openSearch },
        { pathname, search: closedSearch },
        { pathname, search: openSearch },
        { pathname: '/eholdings', search: closedSearch },
      ]);

      result.current.goBack();

      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/eholdings',
        search: closedSearch,
      });
      expect(mockGoBack).not.toHaveBeenCalled();
    });

    it('does not navigate to a stale eHoldings record', () => {
      const { result } = renderWithRouteHistory([
        { pathname, search: openSearch },
        { pathname, search: closedSearch },
        { pathname: '/eholdings/providers/other', search: closedSearch },
      ]);

      result.current.goBack();

      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/eholdings',
        search: closedSearch,
      });
    });

    it('returns to search after opening the pane on two different titles', () => {
      const titleSearch = '?searchType=titles&q=a&offset=1';
      const titlePaneSearch = `${titleSearch}&layer=connected-tasks-jobs`;
      const firstTitle = '/eholdings/titles/102193986';
      const secondTitle = '/eholdings/titles/108760696';

      useLocation.mockReturnValue({ pathname: firstTitle, search: titlePaneSearch });

      const first = renderWithRouteHistory([
        { pathname: firstTitle, search: titlePaneSearch },
        { pathname: firstTitle, search: titleSearch },
        { pathname: '/eholdings', search: titleSearch },
      ]);

      first.result.current.goBack();

      useLocation.mockReturnValue({ pathname: secondTitle, search: titlePaneSearch });

      const second = renderWithRouteHistory([
        { pathname: secondTitle, search: titlePaneSearch },
        { pathname: secondTitle, search: titleSearch },
        { pathname: '/eholdings', search: titleSearch },
        { pathname: firstTitle, search: titlePaneSearch },
        { pathname: firstTitle, search: titleSearch },
      ]);

      second.result.current.goBack();

      expect(mockReplace).toHaveBeenCalledTimes(2);
      expect(mockReplace).toHaveBeenNthCalledWith(1, {
        pathname: '/eholdings',
        search: titleSearch,
      });
      expect(mockReplace).toHaveBeenNthCalledWith(2, {
        pathname: '/eholdings',
        search: titleSearch,
      });
    });

    it('does not navigate to a stale edit route', () => {
      const { result } = renderWithRouteHistory([
        { pathname, search: openSearch },
        { pathname, search: closedSearch },
        { pathname: `${pathname}/edit`, search: closedSearch },
        { pathname: '/eholdings', search: closedSearch },
      ]);

      result.current.goBack();

      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/eholdings',
        search: closedSearch,
      });
    });

    it('falls back to search when the record was opened directly', () => {
      const { result } = renderWithRouteHistory([
        { pathname, search: openSearch },
      ]);

      result.current.goBack();

      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/eholdings',
        search: closedSearch,
      });
    });
  });

  describe('when the Connected Tasks/Jobs pane was closed first', () => {
    const pathname = '/eholdings/providers/123355';
    const closedSearch = '?searchType=providers&q=a&offset=1';
    const openSearch = `${closedSearch}&layer=connected-tasks-jobs`;

    beforeEach(() => {
      useLocation.mockClear().mockReturnValue({
        pathname,
        search: closedSearch,
        state: { eholdings: true },
      });
    });

    it('skips both pane transitions and returns from a package to its provider', () => {
      const packagePath = '/eholdings/packages/123355-1000203613';
      const providerPath = '/eholdings/providers/123355';

      useLocation.mockReturnValue({ pathname: packagePath, search: '', state: { eholdings: true } });

      const { result } = renderWithRouteHistory([
        { pathname: packagePath, search: '', navigationAction: 'PUSH' },
        { pathname: packagePath, search: '?layer=connected-tasks-jobs', navigationAction: 'PUSH' },
        { pathname: packagePath, search: '', navigationAction: 'PUSH' },
        { pathname: providerPath, search: closedSearch, navigationAction: 'PUSH' },
      ]);

      result.current.goBack();

      expect(mockGo).toHaveBeenCalledWith(-3);
      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('returns to the provider after closing the pane following a Create Job detour', () => {
      const packagePath = '/eholdings/packages/214-6659';
      const providerPath = '/eholdings/providers/214';
      const paneSearch = '?layer=connected-tasks-jobs';
      const createSearch = new URLSearchParams({
        returnTo: `${packagePath}${paneSearch}`,
      }).toString();

      useLocation.mockReturnValue({ pathname: packagePath, search: '', state: { eholdings: true } });

      const { result } = renderWithRouteHistory([
        { pathname: packagePath, search: '', navigationAction: 'PUSH' },
        { pathname: packagePath, search: paneSearch, navigationAction: 'PUSH' },
        { pathname: '/tasks/jobs/create/job-templates/template-id', search: `?${createSearch}`, navigationAction: 'PUSH' },
        { pathname: packagePath, search: paneSearch, navigationAction: 'PUSH', leavingEholdings: true },
        { pathname: packagePath, search: '', navigationAction: 'PUSH' },
        { pathname: providerPath, search: closedSearch, navigationAction: 'PUSH' },
      ]);

      result.current.goBack();

      expect(mockGo).toHaveBeenCalledWith(-5);
      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('returns to the provider after visiting Orders and returning to the package', () => {
      const packagePath = '/eholdings/packages/123355-1000203613';
      const providerPath = '/eholdings/providers/123355';
      const ordersPath = '/orders/view/f190bcaf-43b0-4199-86df-5c2bc7b44e30/po-line/edit/177cdc19-5edb-45f3-b7a8-0584d3ebd150';

      useLocation.mockReturnValue({ pathname: packagePath, search: '', key: 'returned-package' });

      const { result } = renderWithRouteHistory([
        { pathname: packagePath, search: '', key: 'returned-package', navigationAction: 'PUSH' },
        { pathname: ordersPath, search: '?limit=50&offset=0&receiptStatus=Awaiting%20Receipt', key: 'orders', navigationAction: 'PUSH' },
        { pathname: packagePath, search: '', key: 'closed-pane', navigationAction: 'PUSH', leavingEholdings: true },
        { pathname: packagePath, search: '?layer=connected-tasks-jobs', key: 'pane', navigationAction: 'PUSH' },
        { pathname: packagePath, search: '', key: 'package', navigationAction: 'PUSH' },
        { pathname: providerPath, search: closedSearch, key: 'provider', navigationAction: 'PUSH' },
        { pathname: '/eholdings', search: closedSearch, key: 'search', navigationAction: 'PUSH' },
      ]);

      result.current.goBack();

      expect(mockGo).toHaveBeenCalledWith(-5);
      expect(mockNavigateBack).not.toHaveBeenCalled();
    });

    it('closes the provider rather than reopening the pane', () => {
      const { result } = renderWithRouteHistory([
        { pathname, search: closedSearch },
        { pathname, search: openSearch },
        { pathname, search: closedSearch },
        { pathname: '/eholdings', search: closedSearch },
      ]);

      result.current.goBack();

      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/eholdings',
        search: closedSearch,
      });
      expect(mockGoBack).not.toHaveBeenCalled();
    });

    it('uses the ordinary back action when no pane history exists', () => {
      const { result } = renderWithRouteHistory([
        { pathname, search: closedSearch },
        { pathname: '/eholdings', search: closedSearch },
      ]);

      result.current.goBack();

      expect(mockGoBack).toHaveBeenCalledTimes(1);
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });
});
