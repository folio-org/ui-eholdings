import { connect } from 'react-redux';

import { createResolver } from '../../redux';
import { ProxyType } from '../../redux/application';
import { selectPropFromData } from '../../redux/selectors';
import { getAccessTypes as getAccessTypesAction } from '../../redux/actions';

import PackageEditRoute from './package-edit-route';

export default connect(
  (store) => {
    const { eholdings: { data } } = store;
    const resolver = createResolver(data);
    return {
      proxyTypes: resolver.query('proxyTypes'),
      resolver,
      accessStatusTypes: selectPropFromData(store, 'accessStatusTypes'),
    };
  },
  {
    getProxyTypes: () => ProxyType.query(),
    getAccessTypes: getAccessTypesAction,
  }
)(PackageEditRoute);
