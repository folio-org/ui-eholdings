import { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { TitleManager } from '@folio/stripes/core';
import { useIntl } from 'react-intl';

import View from '../../components/settings/settings-root-proxy';

import { rootProxy as rootProxyShapes } from '../../constants';

const propTypes = propTypes = {
  confirmUpdateRootProxy: PropTypes.func.isRequired,
  getProxyTypes: PropTypes.func.isRequired,
  getRootProxy: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  proxyTypes: PropTypes.object.isRequired,
  rootProxy: rootProxyShapes.RootProxyReduxStateShape.isRequired,
  updateRootProxy: PropTypes.func.isRequired
};

const SettingsRootProxyRoute = ({
  confirmUpdateRootProxy,
  getProxyTypes,
  getRootProxy,
  history,
  match,
  proxyTypes,
  rootProxy,
  updateRootProxy,
}) => {
  const intl = useIntl();

  useEffect(() => {
    getProxyTypes(match.params.kbId);
    getRootProxy(match.params.kbId);
  }, []);

  useEffect(() => {
    if (rootProxy.isUpdated) {
      history.push({
        pathname: `/settings/eholdings/${match.params.kbId}/root-proxy`,
        state: { eholdings: true, isFreshlySaved: true }
      });

      confirmUpdateRootProxy();
    }
  }, [rootProxy.isUpdated]);

  useEffect(() => {
    getProxyTypes(match.params.kbId);
    getRootProxy(match.params.kbId);
  }, [match.params.kbId]);

  const rootProxySubmitted = (values) => {
    const { credentialsId, ...rootProxyData } = rootProxy.data;
    rootProxyData.attributes.proxyTypeId = values.rootProxyServer;

    updateRootProxy(rootProxyData, match.params.kbId);
  };

  return (
    <TitleManager
      page={intl.formatMessage({ id: 'ui-eholdings.label.settings' })}
      record={intl.formatMessage({ id: 'ui-eholdings.settings.rootProxy' })}
    >
      <View
        proxyTypes={proxyTypes}
        rootProxy={rootProxy}
        onSubmit={rootProxySubmitted}
      />
    </TitleManager>
  );
};

SettingsRootProxyRoute.propTypes = propTypes;

export default SettingsRootProxyRoute;
