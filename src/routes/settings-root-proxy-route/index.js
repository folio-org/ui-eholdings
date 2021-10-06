import { connect } from 'react-redux';

import SettingsRootProxyRoute from './settings-root-proxy-route';
import {
  getRootProxy as getRootProxyAction,
  updateRootProxy as updateRootProxyAction,
  confirmUpdateRootProxy as confirmUpdateRootProxyAction,
  getProxyTypes as getProxyTypesAction,
} from '../../redux/actions';
import { selectPropFromData } from '../../redux/selectors';

export default connect(
  (store) => ({
    proxyTypes: selectPropFromData(store, 'settingsProxyTypes'),
    rootProxy: selectPropFromData(store, 'settingsRootProxy'),
  }), {
    getProxyTypes: getProxyTypesAction,
    getRootProxy: getRootProxyAction,
    updateRootProxy: updateRootProxyAction,
    confirmUpdateRootProxy: confirmUpdateRootProxyAction,
  }
)(SettingsRootProxyRoute);
