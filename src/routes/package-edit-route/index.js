import { connect } from 'react-redux';

import { createResolver } from '../../redux';
import { ProxyType } from '../../redux/application';
import Package from '../../redux/package';
import Provider from '../../redux/provider';
import Resource from '../../redux/resource';
import { selectPropFromData } from '../../redux/selectors';
import { getAccessTypes as getAccessTypesAction } from '../../redux/actions';

import PackageEditRoute from './package-edit-route';

export default connect(
  (store, { match }) => {
    const { eholdings: { data } } = store;
    const resolver = createResolver(data);
    const model = resolver.find('packages', match.params.packageId);
    return {
      model,
      proxyTypes: resolver.query('proxyTypes'),
      provider: resolver.find('providers', model.providerId),
      resolver,
      accessStatusTypes: selectPropFromData(store, 'accessStatusTypes'),
    };
  },
  {
    getPackage: id => Package.find(id, { include: ['accessType'] }),
    getProxyTypes: () => ProxyType.query(),
    getProvider: id => Provider.find(id),
    unloadResources: collection => Resource.unload(collection),
    updateProvider: provider => Provider.save(provider),
    updatePackage: model => Package.save(model),
    destroyPackage: model => Package.destroy(model),
    removeUpdateRequests: () => Package.removeRequests('update'),
    getAccessTypes: getAccessTypesAction,
  }
)(PackageEditRoute);
