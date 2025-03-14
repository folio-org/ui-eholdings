import {
  createContext,
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  useHistory,
  useLocation,
} from 'react-router';

const RouteHistoryContext = createContext();

const LISTENER_REGISTERED_KEY = 'eholdings-listener-registered';
const HISTORY_KEY = 'eholdings-history';

const saveToStorage = (routeHistory) => {
  sessionStorage.setItem(HISTORY_KEY, JSON.stringify(routeHistory));
};

const getRouteHistory = () => JSON.parse(sessionStorage.getItem(HISTORY_KEY)) || [];
const updateRouteHistory = (updater) => {
  const updatedRouteHistory = updater(getRouteHistory());

  saveToStorage(updatedRouteHistory);
};

const isListenerRegistered = () => JSON.parse(sessionStorage.getItem(LISTENER_REGISTERED_KEY));

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

const RouteHistoryContextProvider = ({ children }) => {
  const history = useHistory();
  const location = useLocation();

  const markLeavingEHoldings = () => {
    if (!location.pathname.startsWith('/eholdings')) {
      return;
    }

    // will be called on a non-eholdings page, so mark last eholdings location as one where we left
    updateRouteHistory(routeHistory => {
      const lastEholdingsPage = routeHistory.findIndex(page => page.pathname.startsWith('/eholdings'));

      if (lastEholdingsPage !== -1) {
        routeHistory[lastEholdingsPage].leavingEholdings = true;
      }

      return routeHistory;
    });
  };

  useEffect(() => {
    if (!Array.isArray(getRouteHistory())) {
      saveToStorage([]);
    }

    window.addEventListener('beforeunload', () => {
      // reset listener flag storage when page is refreshed
      sessionStorage.setItem(LISTENER_REGISTERED_KEY, false);
    });

    if (!isListenerRegistered()) {
      // don't unlisten so we can record navigation in other apps
      history.listen((_location) => {
        updateRouteHistory(routeHistory => {
          routeHistory.unshift(_location);
          return routeHistory;
        });
      });

      sessionStorage.setItem(LISTENER_REGISTERED_KEY, true);
    }

    const onUnmount = () => {
      markLeavingEHoldings();
    };

    return onUnmount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigateBack = useCallback(() => {
    const routeHistory = getRouteHistory();
    const countToPagesWhereLeft = routeHistory.findIndex((page) => page.leavingEholdings);

    if (countToPagesWhereLeft > 0) {
      delete routeHistory[countToPagesWhereLeft].leavingEholdings;
      saveToStorage(routeHistory);

      // go(-1) will return to previous page
      // if previous page was non eholdings - need to call go(-2)
      // and this extends to N non-eholdings pages - call go(-(N + 1))
      history.go(-(countToPagesWhereLeft + 1));
    } else {
      history.goBack();
    }
  }, [history]);

  const contextValue = {
    navigateBack,
    routeHistory: getRouteHistory(),
  };

  return (
    <RouteHistoryContext.Provider value={contextValue}>{children}</RouteHistoryContext.Provider>
  );
};

RouteHistoryContextProvider.propTypes = propTypes;

export {
  RouteHistoryContext,
  RouteHistoryContextProvider,
};
