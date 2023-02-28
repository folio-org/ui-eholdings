import { connect } from 'react-redux';

import ProviderShowRoute from './provider-show-route';

import { createResolver } from '../../redux';
import Provider from '../../redux/provider';
import Tag from '../../redux/tag';
import { ProxyType, RootProxy } from '../../redux/application';

import {
  getAccessTypes as getAccessTypesAction,
  getProviderPackages as getProviderPackagesAction,
  clearProviderPackages as clearProviderPackagesAction,
} from '../../redux/actions';

import { selectPropFromData } from '../../redux/selectors';
import { tagPaths } from '../../constants/tagPaths';

export default connect(
  (store, { match }) => {
    const { data } = store.eholdings;

    const resolver = createResolver(data);

    return {
      model: resolver.find('providers', match.params.providerId),
      proxyTypes: resolver.query('proxyTypes'),
      tagsModel: resolver.query('tags'),
      tagsModelOfAlreadyAddedTags: resolver.query('tags', undefined, { path: tagPaths.alreadyAddedToRecords }),
      rootProxy: resolver.find('rootProxies', 'root-proxy'),
      resolver,
      accessTypes: selectPropFromData(store, 'accessStatusTypes'),
      providerPackages: selectPropFromData(store, 'providerPackages'),
    };
  }, {
    getProvider: id => Provider.find(id, { include: 'packages' }),
    getProviderPackages: getProviderPackagesAction,
    clearProviderPackages: clearProviderPackagesAction,
    getProxyTypes: () => ProxyType.query(),
    getTags: (params, options) => Tag.query(params, options),
    updateFolioTags: (model) => Tag.create(model),
    getRootProxy: () => RootProxy.find('root-proxy'),
    getAccessTypes: getAccessTypesAction,
  }
)(ProviderShowRoute);
