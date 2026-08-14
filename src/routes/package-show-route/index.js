import { connect } from 'react-redux';
import { createResolver } from '../../redux';
import { ProxyType } from '../../redux/application';
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
  (store) => {
    const {
      eholdings: { data },
    } = store;

    const resolver = createResolver(data);
    return {
      proxyTypes: resolver.query('proxyTypes'),
      tagsModel: resolver.query('tags'),
      tagsModelOfAlreadyAddedTags: resolver.query('tags', undefined, { path: tagPaths.alreadyAddedToRecords }),
      resolver,
      accessStatusTypes: selectPropFromData(store, 'accessStatusTypes'),
      costPerUse: selectPropFromData(store, 'costPerUse'),
      packageTitles: selectPropFromData(store, 'packageTitles'),
    };
  },
  {
    getPackageTitles: getPackageTitlesAction,
    clearPackageTitles: clearPackageTitlesAction,
    getProxyTypes: () => ProxyType.query(),
    getTags: (params, options) => Tag.query(params, options),
    updateFolioTags: (model) => Tag.create(model),
    getAccessTypes: getAccessTypesAction,
    getCostPerUse: getCostPerUseAction,
    getCostPerUsePackageTitles: getCostPerUsePackageTitlesAction,
    clearCostPerUseData: clearCostPerUseDataAction,
  }
)(PackageShowRoute);
