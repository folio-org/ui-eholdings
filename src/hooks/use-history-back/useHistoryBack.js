import {
  useCallback,
  useContext,
} from 'react';
import {
  useHistory,
  useLocation,
} from 'react-router';

import { RouteHistoryContext } from '../../components/route-history';

const useHistoryBack = () => {
  const history = useHistory();
  const location = useLocation();
  const {
    navigateBack,
    routeHistory,
  } = useContext(RouteHistoryContext);

  const goBack = useCallback(() => {
    const previousEHoldingsLocationKnown = routeHistory.length > 0;

    if (location.state?.eholdings) {
      history.goBack();
    } else if (previousEHoldingsLocationKnown) {
      navigateBack();
    } else {
      history.push({
        pathname: '/eholdings',
      });
    }
  }, [history, location, navigateBack, routeHistory]);

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
