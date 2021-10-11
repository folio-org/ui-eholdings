import { connect } from 'react-redux';

import SettingsKnowledgeBaseRoute from './settings-knowledge-base-route';
import {
  getKbCredentialsKey as getKbCredentialsKeyAction,
  postKBCredentials as postKBCredentialsAction,
  patchKBCredentials as patchKBCredentialsAction,
  deleteKBCredentials as deleteKBCredentialsAction,
  confirmPatchKBCredentials as confirmPatchKBCredentialsAction,
  confirmPostKBCredentials as confirmPostKBCredentialsAction,
  confirmDeleteKBCredentials as confirmDeleteKBCredentialsAction,
} from '../../redux/actions';
import { selectPropFromData } from '../../redux/selectors';

export default connect(
  (store) => ({
    kbCredentials: selectPropFromData(store, 'kbCredentials'),
  }),
  {
    getKbCredentialsKey: getKbCredentialsKeyAction,
    postKBCredentials: postKBCredentialsAction,
    patchKBCredentials: patchKBCredentialsAction,
    deleteKBCredentials: deleteKBCredentialsAction,
    confirmDeleteKBCredentials: confirmDeleteKBCredentialsAction,
    confirmPatchKBCredentials: confirmPatchKBCredentialsAction,
    confirmPostKBCredentials: confirmPostKBCredentialsAction,
  }
)(SettingsKnowledgeBaseRoute);
