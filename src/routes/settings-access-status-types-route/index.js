import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import SettingsAccessStatusTypesRoute from './settings-access-status-types-route';
import { selectPropFromData } from '../../redux/selectors';
import {
  getAccessTypes as getAccessTypesAction,
  attachAccessType as attachAccessTypeAction,
  deleteAccessType as deleteAccessTypeAction,
  updateAccessType as updateAccessTypeAction,
  confirmDeleteAccessType as confirmDeleteAccessTypeAction,
} from '../../redux/actions';

export default connect(
  (store) => ({
    accessTypes: selectPropFromData(store, 'accessStatusTypes'),
  }), {
    getAccessTypes: getAccessTypesAction,
    attachAccessType: attachAccessTypeAction,
    deleteAccessType: deleteAccessTypeAction,
    updateAccessType: updateAccessTypeAction,
    confirmDelete: confirmDeleteAccessTypeAction,
  }
)(withRouter(SettingsAccessStatusTypesRoute));
