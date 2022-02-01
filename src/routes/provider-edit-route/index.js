import { connect } from 'react-redux';

import { createResolver } from '../../redux';
import Provider from '../../redux/provider';
import { ProxyType, RootProxy } from '../../redux/application';

import ProviderEditRoute from './provider-edit-route';

export default connect(
  ({ eholdings: { data } }, { match }) => ({
    model: createResolver(data).find('providers', match.params.providerId),
    proxyTypes: createResolver(data).query('proxyTypes'),
    rootProxy: createResolver(data).find('rootProxies', 'root-proxy')
  }), {
    getProvider: id => Provider.find(id),
    updateProvider: model => Provider.save(model),
    getProxyTypes: () => ProxyType.query(),
    getRootProxy: () => RootProxy.find('root-proxy'),
    removeUpdateRequests: () => Provider.removeRequests('update'),
  }
)(ProviderEditRoute);
