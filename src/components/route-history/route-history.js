import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  useHistory,
  useLocation,
} from 'react-router';

const RouteHistoryContext = createContext();

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

const RouteHistoryContextProvider = ({ children }) => {
  const history = useHistory();
  const location = useLocation();
  const routeHistory = useRef(JSON.parse(sessionStorage.getItem('eholdings-history')) || []);

  useEffect(() => {
    const unlisten = history.listen((_location, action) => {
      if (action === 'POP') {
        routeHistory.current.shift();
      } else {
        routeHistory.current.unshift(_location);
      }
    });

    const onUnmount = () => {
      unlisten();
      sessionStorage.setItem('eholdings-history', JSON.stringify(routeHistory.current));
    };

    return onUnmount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigateBack = useCallback(() => {
    const nonEholdingsPagesCount = routeHistory.current.findIndex((page) => page.pathname.includes('eholdings') && page.pathname !== location.pathname);

    if (nonEholdingsPagesCount > 0) {
      // go(-1) will return to previous page
      // if previous page was non eholdings - need to call go(-2)
      // and this extends to N non-eholdings pages - call go(-(N + 1))
      history.go(-(nonEholdingsPagesCount + 1));
    } else {
      history.goBack();
    }
  }, [history, routeHistory, location.pathname]);

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
