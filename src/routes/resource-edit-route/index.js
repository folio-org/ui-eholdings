import { connect } from 'react-redux';

import { createResolver } from '../../redux';
import { ProxyType } from '../../redux/application';
import Resource from '../../redux/resource';
import { getAccessTypes as getAccessTypesAction } from '../../redux/actions';
import { selectPropFromData } from '../../redux/selectors';

import ResourceEditRoute from './resource-edit-route';

export default connect(
  (store, { match }) => {
    const { eholdings: { data } } = store;
    const resolver = createResolver(data);

    return {
      model: resolver.find('resources', match.params.id),
      proxyTypes: resolver.query('proxyTypes'),
      accessStatusTypes: selectPropFromData(store, 'accessStatusTypes'),
    };
  }, {
    getResource: id => Resource.find(id, { include: ['package', 'title', 'accessType'] }),
    getProxyTypes: () => ProxyType.query(),
    updateResource: model => Resource.save(model),
    destroyResource: model => Resource.destroy(model),
    getAccessTypes: getAccessTypesAction,
  }
)(ResourceEditRoute);
