import { connect } from 'react-redux';
import { createResolver } from '../../redux';
import { ProxyType } from '../../redux/application';
import Package from '../../redux/package';
import Provider from '../../redux/provider';
import Resource from '../../redux/resource';
import { selectPropFromData } from '../../redux/selectors';
import {
  getAccessTypes as getAccessTypesAction,
  getCostPerUse as getCostPerUseAction,
  getCostPerUsePackageTitles as getCostPerUsePackageTitlesAction,
  clearCostPerUseData as clearCostPerUseDataAction,
  getPackageTitles as getPackageTitlesAction,
  clearPackageTitles as clearPackageTitlesAction,
} from '../../redux/actions';
import Tag from '../../redux/tag';

import PackageShowRoute from './package-show-route';
import { tagPaths } from '../../constants/tagPaths';

export default connect(
  (store, ownProps) => {
    const {
      eholdings: { data },
    } = store;

    const { match } = ownProps;
    const resolver = createResolver(data);
    const model = resolver.find('packages', match.params.packageId);
    return {
      model,
      proxyTypes: resolver.query('proxyTypes'),
      provider: resolver.find('providers', model.providerId),
      tagsModel: resolver.query('tags'),
      tagsModelOfAlreadyAddedTags: resolver.query('tags', undefined, { path: tagPaths.alreadyAddedToRecords }),
      resolver,
      accessStatusTypes: selectPropFromData(store, 'accessStatusTypes'),
      costPerUse: selectPropFromData(store, 'costPerUse'),
      packageTitles: selectPropFromData(store, 'packageTitles'),
    };
  },
  {
    getPackage: id => Package.find(id, { include: ['accessType'] }),
    getPackageTitles: getPackageTitlesAction,
    clearPackageTitles: clearPackageTitlesAction,
    getProxyTypes: () => ProxyType.query(),
    getTags: (params, options) => Tag.query(params, options),
    getProvider: id => Provider.find(id),
    unloadResources: collection => Resource.unload(collection),
    updatePackage: model => Package.save(model),
    updateFolioTags: (model) => Tag.create(model),
    destroyPackage: model => Package.destroy(model),
    removeUpdateRequests: () => Package.removeRequests('update'),
    getAccessTypes: getAccessTypesAction,
    getCostPerUse: getCostPerUseAction,
    getCostPerUsePackageTitles: getCostPerUsePackageTitlesAction,
    clearCostPerUseData: clearCostPerUseDataAction,
  }
)(PackageShowRoute);
