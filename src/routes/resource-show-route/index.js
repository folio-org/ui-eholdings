import { connect } from 'react-redux';
import { createResolver } from '../../redux';
import Resource from '../../redux/resource';
import { ProxyType } from '../../redux/application';
import Tag from '../../redux/tag';
import {
  getAccessTypes as getAccessTypesAction,
  getCostPerUse as getCostPerUseAction,
  clearCostPerUseData as clearCostPerUseDataAction,
} from '../../redux/actions';
import { selectPropFromData } from '../../redux/selectors';

import ResourceShowRoute from './resource-show-route';

export default connect(
  (store, { match }) => {
    const {
      eholdings: { data },
    } = store;

    const resolver = createResolver(data);

    return {
      model: resolver.find('resources', match.params.id),
      tagsModel: resolver.query('tags'),
      proxyTypes: resolver.query('proxyTypes'),
      resolver,
      accessTypes: selectPropFromData(store, 'accessStatusTypes'),
      costPerUse: selectPropFromData(store, 'costPerUse'),
    };
  }, {
    getResource: id => Resource.find(id, { include: ['package', 'title', 'accessType'] }),
    getProxyTypes: () => ProxyType.query(),
    updateResource: model => Resource.save(model),
    updateFolioTags: model => Tag.create(model),
    getTags: () => Tag.query(),
    destroyResource: model => Resource.destroy(model),
    getAccessTypes: getAccessTypesAction,
    removeUpdateRequests: () => Resource.removeRequests('update'),
    getCostPerUse: getCostPerUseAction,
    clearCostPerUseData: clearCostPerUseDataAction,
  }
)(ResourceShowRoute);
