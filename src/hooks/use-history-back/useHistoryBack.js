import {
  useCallback,
  useContext,
} from 'react';
import {
  useHistory,
  useLocation,
} from 'react-router';

import { RouteHistoryContext } from '../../components/route-history';
import getRecordCloseNavigation from './getRecordCloseNavigation';

const useHistoryBack = () => {
  const history = useHistory();
  const location = useLocation();
  const {
    navigateBack,
    getRouteHistory,
  } = useContext(RouteHistoryContext);

  const goBack = useCallback(() => {
    const historyEntries = getRouteHistory();
    const previousEHoldingsLocationKnown = historyEntries.length > 0;
    const closeNavigation = getRecordCloseNavigation(historyEntries, location);

    if (closeNavigation) {
      if (closeNavigation.steps) {
        history.go(-closeNavigation.steps);
      } else {
        history.replace(closeNavigation.location);
      }

      return;
    }

    if (location.state?.eholdings) {
      history.goBack();
    } else if (previousEHoldingsLocationKnown) {
      navigateBack();
    } else {
      history.push({
        pathname: '/eholdings',
      });
    }
  }, [getRouteHistory, history, location, navigateBack]);

  return {
    goBack,
  };
};

const withHistoryBack = (WrappedComponent) => {
  const WithUseHistoryBack = (props) => {
    const { goBack } = useHistoryBack();

    return <WrappedComponent goBack={goBack} {...props} />;
  };

  return WithUseHistoryBack;
};

export {
  useHistoryBack,
  withHistoryBack,
};
