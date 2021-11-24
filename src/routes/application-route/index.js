import { connect } from 'react-redux';

import ApplicationRoute from './application';
import { createResolver } from '../../redux';
import { Status } from '../../redux/application';
import { getKbCredentials as getKbCredentialsAction } from '../../redux/actions';
import { selectPropFromData } from '../../redux/selectors';

export default connect(
  (store) => {
    const {
      eholdings,
      discovery,
    } = store;

    return {
      status: createResolver(eholdings?.data || {}).find('statuses', 'status'),
      interfaces: discovery?.interfaces || {},
      kbCredentials: selectPropFromData(store, 'kbCredentials'),
    };
  }, {
    getBackendStatus: () => Status.find('status'),
    getKbCredentials: getKbCredentialsAction,
  }
)(ApplicationRoute);
