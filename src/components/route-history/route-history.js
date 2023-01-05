import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';

const RouteHistoryContext = createContext();

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

const RouteHistoryContextProvider = ({ children }) => {
  const history = useHistory();
  const routeHistory = useRef(JSON.parse(sessionStorage.getItem('eholdings-history')) || []);

  const markLeavingEHoldings = () => {
    // will be called on a non-eholdings page, so mark last eholdings location as one where we left
    routeHistory.current.find(page => page.pathname.includes('/eholdings')).leavingEholdings = true;
  };

  const saveToStorage = () => {
    sessionStorage.setItem('eholdings-history', JSON.stringify(routeHistory.current));
  };

  useEffect(() => {
    // don't unlisten so we can record navigation in other apps
    history.listen((_location) => {
      routeHistory.current.unshift(_location);

      saveToStorage();
    });

    const onUnmount = () => {
      markLeavingEHoldings();
      saveToStorage();
    };

    return onUnmount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigateBack = useCallback(() => {
    const countToPagesWhereLeft = routeHistory.current.findIndex((page) => page.leavingEholdings);

    if (countToPagesWhereLeft > 0) {
      // go(-1) will return to previous page
      // if previous page was non eholdings - need to call go(-2)
      // and this extends to N non-eholdings pages - call go(-(N + 1))
      history.go(-(countToPagesWhereLeft + 1));
    } else {
      history.goBack();
    }
  }, [history, routeHistory]);

  const contextValue = useMemo(() => ({
    navigateBack,
    routeHistory: routeHistory.current,
  }), [routeHistory, navigateBack]);

  return (
    <RouteHistoryContext.Provider value={contextValue}>{children}</RouteHistoryContext.Provider>
  );
};

RouteHistoryContextProvider.propTypes = propTypes;

export {
  RouteHistoryContext,
  RouteHistoryContextProvider,
};
