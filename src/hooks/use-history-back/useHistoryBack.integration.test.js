import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  MemoryRouter,
  Route,
  useHistory,
} from 'react-router';

import { RouteHistoryContextProvider } from '../../components/route-history';
import { useHistoryBack } from './useHistoryBack';

jest.unmock('react-router');

const search = '?searchType=providers&q=a&offset=1';
const searchUrl = `/eholdings${search}`;
const providerUrl = `/eholdings/providers/214${search}`;
const packageUrl = '/eholdings/packages/214-2418509';
const paneUrl = `${packageUrl}?layer=connected-tasks-jobs`;
const resourceUrl = '/eholdings/resources/214-2418509-14337814';

const CloseRecordButton = () => {
  const { goBack } = useHistoryBack();

  return <button type="button" onClick={goBack}>Close record</button>;
};

const renderApplication = () => {
  let history;
  const Application = () => {
    history = useHistory();

    return (
      <Route path="/eholdings">
        <RouteHistoryContextProvider>
          <CloseRecordButton />
        </RouteHistoryContextProvider>
      </Route>
    );
  };

  // MemoryRouter uses the same history implementation as the application's Router.
  render(<MemoryRouter initialEntries={[searchUrl]}><Application /></MemoryRouter>);

  return {
    history,
    push: (url) => act(() => history.push(url, { eholdings: true })),
    closeRecord: () => fireEvent.click(screen.getByRole('button', { name: 'Close record' })),
  };
};

describe('record close navigation with the real history provider', () => {
  let addEventListenerSpy;

  beforeEach(() => {
    sessionStorage.removeItem('eholdings-history');
    sessionStorage.removeItem('eholdings-listener-registered');
    addEventListenerSpy = jest.spyOn(window, 'addEventListener');
  });

  afterEach(() => {
    cleanup();
    addEventListenerSpy.mock.calls.forEach(([event, listener]) => {
      if (event === 'beforeunload') window.removeEventListener(event, listener);
    });
    addEventListenerSpy.mockRestore();
    sessionStorage.removeItem('eholdings-history');
    sessionStorage.removeItem('eholdings-listener-registered');
  });

  it.each([
    ['Create Task', '/tasks/tasks/create', paneUrl],
    ['Create Job', '/tasks/jobs/create/job-templates/template-id', paneUrl],
    ['Orders', '/orders/view/order-id/po-line/edit/line-id', packageUrl],
  ])('returns to the provider after a visit to %s', (_name, externalPath, returnTo) => {
    const { history, push, closeRecord } = renderApplication();

    push(providerUrl);
    push(packageUrl);
    push(paneUrl);

    if (returnTo === packageUrl) push(packageUrl);

    const handoff = new URLSearchParams({ recordId: '214-2418509', recordType: 'eholdingsPackage', returnTo });

    push(`${externalPath}?${handoff}`);
    expect(screen.queryByRole('button', { name: 'Close record' })).not.toBeInTheDocument();

    // Task creation and app switching return with a new PUSH, without router state.
    act(() => history.push(returnTo));
    closeRecord();

    expect(`${history.location.pathname}${history.location.search}`).toBe(providerUrl);

    closeRecord();

    expect(`${history.location.pathname}${history.location.search}`).toBe(searchUrl);
  });

  it('returns to the provider after closing a resource and opening the package pane', () => {
    const { history, push, closeRecord } = renderApplication();

    push(providerUrl);
    push(packageUrl);
    push(resourceUrl);
    closeRecord();
    expect(history.location.pathname).toBe(packageUrl);

    push(paneUrl);
    closeRecord();

    expect(`${history.location.pathname}${history.location.search}`).toBe(providerUrl);
  });

  it.each([true, false])('returns to the package after an Orders visit during resource editing (provider pane used: %s)', (openProviderPane) => {
    const { history, push, closeRecord } = renderApplication();

    push(providerUrl);

    if (openProviderPane) {
      push(`${providerUrl}&layer=connected-tasks-jobs`);
      push(providerUrl);
    }

    push(packageUrl);
    push(resourceUrl);
    // ResourceShowRoute replaces the view with the edit page.
    act(() => history.replace(`${resourceUrl}/edit`, { eholdings: true }));
    push('/orders/lines/view/line-id?limit=50&offset=0&receiptStatus=Awaiting%20Receipt');
    act(() => history.push(`${resourceUrl}/edit`));
    // ResourceEditRoute also uses replace when cancelling back to the view.
    act(() => history.replace(resourceUrl, { eholdings: true }));
    closeRecord();

    expect(history.location.pathname).toBe(packageUrl);

    closeRecord();
    expect(`${history.location.pathname}${history.location.search}`).toBe(providerUrl);

    closeRecord();
    expect(`${history.location.pathname}${history.location.search}`).toBe(searchUrl);
  });

  it('counts a replacement as the same browser entry after returning from a resource', () => {
    const { history, push, closeRecord } = renderApplication();

    push(providerUrl);
    push(paneUrl);
    act(() => history.replace(packageUrl, { eholdings: true }));
    push(resourceUrl);
    closeRecord();
    push(paneUrl);
    closeRecord();

    expect(`${history.location.pathname}${history.location.search}`).toBe(providerUrl);
  });

  it('does not treat returning to a different package as a round trip to the original record', () => {
    const { history, push, closeRecord } = renderApplication();

    push(providerUrl);
    push(packageUrl);
    push(paneUrl);
    push('/orders/view/order-id');
    push('/eholdings/packages/another-package?layer=connected-tasks-jobs');
    closeRecord();

    expect(history.location.pathname).toBe('/eholdings');
    expect(history.location.search).toBe('');
  });
});
