import { connect } from 'react-redux';

import PackageCreateRoute from './package-create-route';
import { createResolver } from '../../redux';
import { selectPropFromData } from '../../redux/selectors';
import { getAccessTypes as getAccessTypesAction } from '../../redux/actions';

export default connect(
  (store) => ({
    createRequest: createResolver(store.eholdings.data).getRequest('create', { type: 'packages', pageSize: 100 }),
    accessStatusTypes: selectPropFromData(store, 'accessStatusTypes'),
  }), {
    getAccessTypes: getAccessTypesAction,
  }
)(PackageCreateRoute);

