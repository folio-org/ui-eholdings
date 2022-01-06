import { connect } from 'react-redux';

import PackageCreateRoute from './package-create-route';
import { createResolver } from '../../redux';
import { selectPropFromData } from '../../redux/selectors';
import { getAccessTypes as getAccessTypesAction } from '../../redux/actions';
import Package from '../../redux/package';

export default connect(
  (store) => ({
    createRequest: createResolver(store.eholdings.data).getRequest('create', { type: 'packages', pageSize: 100 }),
    accessStatusTypes: selectPropFromData(store, 'accessStatusTypes'),
  }), {
    createPackage: attrs => Package.create(attrs),
    removeCreateRequests: () => Package.removeRequests('create'),
    getAccessTypes: getAccessTypesAction,
  }
)(PackageCreateRoute);

