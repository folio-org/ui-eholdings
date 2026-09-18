const isConnectedTasksJobsPaneOpen = (search = '') => (
  new URLSearchParams(search).get('layer') === 'connected-tasks-jobs'
);

const getSearchLocation = (search = '') => {
  const params = new URLSearchParams(search);

  if (isConnectedTasksJobsPaneOpen(search)) {
    params.delete('layer');
  }

  const nextSearch = params.toString();

  return {
    pathname: '/eholdings',
    search: nextSearch ? `?${nextSearch}` : '',
  };
};

// View and edit are two presentations of the same record.
const getRecordPathname = pathname => pathname?.replace(/\/edit$/, '');

const isCrossAppReturnToRecord = (historyEntries, pageIndex, recordPathname) => {
  if (historyEntries[pageIndex].pathname?.startsWith('/eholdings')) {
    return false;
  }

  const previousEHoldingsPage = historyEntries.slice(pageIndex + 1).find(page => (
    page.pathname?.startsWith('/eholdings')
  ));

  return getRecordPathname(previousEHoldingsPage?.pathname) === recordPathname
    && previousEHoldingsPage.leavingEholdings;
};

const getActiveHistoryEntries = (historyEntries) => {
  const activeEntries = [];

  for (let index = 0; index < historyEntries.length; index += 1) {
    const entry = historyEntries[index];
    let originalIndex = -1;

    if (entry.navigationAction === 'POP' && entry.key) {
      originalIndex = historyEntries.findIndex((olderEntry, olderIndex) => (
        olderIndex > index
        && olderEntry.key === entry.key
        && olderEntry.navigationAction !== 'POP'
      ));
    }

    if (originalIndex !== -1) {
      // Visits between a POP and its original entry are no longer behind us.
      index = originalIndex - 1;
    } else {
      activeEntries.push(entry);
    }
  }

  return activeEntries;
};

/**
 * Returns { steps } for a known parent, { location } for the search fallback,
 * or null when neither pane history nor a cross-app return needs special handling.
 */
const getRecordCloseNavigation = (historyEntries, location) => {
  const activeHistoryEntries = getActiveHistoryEntries(historyEntries);
  const recordPathname = getRecordPathname(location.pathname);

  const parentIndex = activeHistoryEntries.findIndex((page, pageIndex) => (
    getRecordPathname(page.pathname) !== recordPathname
    && !isCrossAppReturnToRecord(activeHistoryEntries, pageIndex, recordPathname)
  ));

  const recordHistory = parentIndex === -1
    ? activeHistoryEntries
    : activeHistoryEntries.slice(0, parentIndex);

  const hasConnectedPaneHistory = isConnectedTasksJobsPaneOpen(location.search)
    || recordHistory.some(page => isConnectedTasksJobsPaneOpen(page.search));

  // External pages only reach this slice after the departure record was matched.
  const hasCrossAppReturn = recordHistory.some(page => !page.pathname?.startsWith('/eholdings'));

  if (!hasConnectedPaneHistory && !hasCrossAppReturn) return null;

  // REPLACE changes an existing browser entry, so only PUSH adds a step back.
  const steps = recordHistory.filter(page => page.navigationAction === 'PUSH').length;

  const canReturnToParent = activeHistoryEntries[parentIndex]?.pathname?.startsWith('/eholdings')
    && activeHistoryEntries[0]?.pathname === location.pathname
    && (!location.key || historyEntries[0]?.key === location.key)
    && steps > 0
    && recordHistory.every(page => ['PUSH', 'REPLACE'].includes(page.navigationAction));

  if (canReturnToParent) {
    return {
      steps,
    };
  }

  return hasConnectedPaneHistory
    ? { location: getSearchLocation(location.search) }
    : null;
};

export default getRecordCloseNavigation;
